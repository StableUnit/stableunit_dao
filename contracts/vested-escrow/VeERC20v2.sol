// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
/*
      /$$$$$$            /$$$$$$$   /$$$$$$   /$$$$$$
     /$$__  $$          | $$__  $$ /$$__  $$ /$$__  $$
    | $$  \__/ /$$   /$$| $$  \ $$| $$  \ $$| $$  \ $$
    |  $$$$$$ | $$  | $$| $$  | $$| $$$$$$$$| $$  | $$
     \____  $$| $$  | $$| $$  | $$| $$__  $$| $$  | $$
     /$$  \ $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$
    |  $$$$$$/|  $$$$$$/| $$$$$$$/| $$  | $$|  $$$$$$/
     \______/  \______/ |_______/ |__/  |__/ \______/

*/
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../access-control/SuAccessControlAuthenticated.sol";
import "../interfaces/ISuVoteToken.sol";
import "./SuVoteToken.sol";
import "../interfaces/IveERC20v2.sol";

/*
 * @title The contact enables the storage of erc20 tokens under the linear time-vesting with the cliff time-lock.
 * @notice During cliff period all tokens are locked so the user can't claim it.
 * After the cliff period is over token gets gradually unlock every second until the vesting is over.
 *
 * For example, if cliff is 3 months and vesting is 12 months,
 *      during the first 3 mouths user can't claim anything
 *      after 4 months (i.e. 1 month after the cliff) user can claim 1/9 of all tokens
 *      after 6 months user can claim 3/9 of all tokens etc.
 * It's possible to claim tokens by parts during vesting, or claim all at once when vesting if over.
 *
 * To make balance visible in the erc20 wallets, the contact "looks like" erc20 token by implementing its interface
 * however all non-view methods such as transfer or approve aren't active and will be reverted.
*/
// TODO: change timestamp to uint32
contract VeERC20v2 is SuVoteToken, ERC20BurnableUpgradeable, IveERC20v2 {
    using SafeERC20Upgradeable for ERC20Upgradeable;

    ERC20Upgradeable public LOCKED_TOKEN;
    uint32 public TGE_MAX_TIMESTAMP;
    uint32 public tgeTimestamp;
    uint32 public idoTimestamp;

    mapping(address => VestingInfo) public vestingInfo;

    function initialize(
        address _accessControlSingleton,
        ERC20Upgradeable _lockedToken,
        uint32 _maxTgeTimestamp,
        uint32 _idoTimestamp
    ) initializer public {
        string memory veSymbol = string.concat("ve", _lockedToken.symbol());
        __SuVoteToken__init(_accessControlSingleton, veSymbol);
        __ERC20_init(string.concat("vested escrow ", _lockedToken.name()), veSymbol);

        LOCKED_TOKEN = _lockedToken;
        TGE_MAX_TIMESTAMP = _maxTgeTimestamp;
        tgeTimestamp = TGE_MAX_TIMESTAMP;
        idoTimestamp = _idoTimestamp;
    }

    function updateIdoTimestamp(uint32 newIdoTimestamp) external onlyRole(ADMIN_ROLE) {
        if (newIdoTimestamp < uint32(block.timestamp)) revert IDOInPastError();
        idoTimestamp = newIdoTimestamp;
    }

    function updateTgeTimestamp(uint32 newTgeTimestamp) external onlyRole(ADMIN_ROLE) {
        if (newTgeTimestamp < uint32(block.timestamp)) revert TGEInPastError();
        if (newTgeTimestamp > TGE_MAX_TIMESTAMP) revert TGEBeyondLimitError();
        tgeTimestamp = newTgeTimestamp;
    }

    function totalDeposited(address user) public view returns (uint256) {
        return super.balanceOf(user) + vestingInfo[user].amountAlreadyWithdrawn;
    }

    function totalClaimed(address user) public view returns (uint256) {
        return vestingInfo[user].amountAlreadyWithdrawn;
    }

    function lockUnderVesting(
        address account,
        uint256 amount,
        uint256 vestingSeconds,
        uint256 cliffSeconds,
        uint256 tgeUnlockRatio1e18,
        uint256 vestingFrequencySeconds
    ) external onlyRole(ADMIN_ROLE)
    {
        _mergeVesting(account, vestingSeconds, cliffSeconds, tgeUnlockRatio1e18, vestingFrequencySeconds);
        addBalance(account, amount);
    }

    /**
    * @notice updates lock settings for the account and chose longest among existing one and passed arguments
    * @param account Beneficiary of the vesting account.
    * @param vestingSeconds Amount of seconds when linear vesting would be over. Starts from cliff.
    * @param cliffSeconds Amount of seconds while tokens would be completely locked.
    * @param tgeUnlockRatio1e18 ratio/1e18 ⊂ [0..1] that indicates how many tokens are going to be unlocked during TGE
    * @param vestingFrequencySeconds how frequently token are going to be unlocked after the cliff.
    */
    function _mergeVesting(
        address account,
        uint256 vestingSeconds,
        uint256 cliffSeconds,
        uint256 tgeUnlockRatio1e18,
        uint256 vestingFrequencySeconds
    ) internal {
        if (cliffSeconds > vestingSeconds) revert BadCliffAndVesting();
        if (tgeUnlockRatio1e18 > 1e18) revert BadUnlockRatio();

        if (vestingInfo[account].vestingSeconds < vestingSeconds) {
            vestingInfo[account].vestingSeconds = vestingSeconds;
        }

        if (vestingInfo[account].cliffSeconds < cliffSeconds) {
            vestingInfo[account].cliffSeconds = cliffSeconds;
        }

        if (vestingInfo[account].tgeUnlockRatio1e18 > tgeUnlockRatio1e18) {
            vestingInfo[account].tgeUnlockRatio1e18 = tgeUnlockRatio1e18;
        }

        if (vestingInfo[account].vestingFrequencySeconds < vestingFrequencySeconds) {
            vestingInfo[account].vestingFrequencySeconds = vestingFrequencySeconds;
        }
    }

    function addBalance(address account, uint256 amount) public {
        LOCKED_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        // mint more veERC20 tokens for the account
        _mint(account, amount);
        _transferVotingUnits(address(0), account, amount);
        // if don't delegate, delegate to yourself by default
        if (delegates(account) == address(0)) {
            _delegate(account, account);
        }
    }

    function availableToClaim(address user) public view returns (uint256) {
        VestingInfo memory info = vestingInfo[user];
        uint256 t = block.timestamp;
        // if the time is before the TGE - there's nothing vested yet
        if (t < tgeTimestamp) return 0;

        // if it's past TGE, there's at lest tgeUnlockRatio is vested
         uint256 vested = totalDeposited(user) * info.tgeUnlockRatio1e18 / 1e18;

        // if the time is before the cliff
        if (t < (tgeTimestamp + info.cliffSeconds)) {
            // there's nothing additional vested yet
        } else {
            // if after the cliff

            // if it's beyond vesting time
            if ((tgeTimestamp + info.vestingSeconds) < t) {
                // everything is vested
                vested = totalDeposited(user);
            } else {
                // otherwise the amount is proportional to the amount after the cliff before end of vesting
                uint256 x = totalDeposited(user);
                // how much second passed after cliff
                uint256 y = (t - (tgeTimestamp + info.cliffSeconds));
                // how much seconds from cliff to end of vesting
                uint256 z = (uint256(info.vestingSeconds) - uint256(info.cliffSeconds));
                // y2 := max y2 : vestingFrequencySeconds*N <= y
                uint256 y2 = y / info.vestingFrequencySeconds * info.vestingFrequencySeconds;

                vested = x * y2 / z;
            }
        }

        // the answer is how much is vested in total minus how much already withdrawn
        return vested - uint256(info.amountAlreadyWithdrawn);
    }

    function claim() external {
        uint256 claimAmount = availableToClaim(msg.sender);
        if (claimAmount == 0) revert ClaimZeroError();
        vestingInfo[msg.sender].amountAlreadyWithdrawn = vestingInfo[msg.sender].amountAlreadyWithdrawn + claimAmount;
        _burn(msg.sender, claimAmount);
        _transferVotingUnits(msg.sender, address(0), claimAmount);
        LOCKED_TOKEN.safeTransfer(msg.sender, claimAmount);
    }

    function donateTokens(address toDAO) external {
        if (hasRole(DAO_ROLE, toDAO) == false) revert BadDAOAddress(toDAO);
        uint256 balance = super.balanceOf(msg.sender);
        if (balance > 0) revert NoBalance();
        vestingInfo[msg.sender].amountAlreadyWithdrawn = vestingInfo[msg.sender].amountAlreadyWithdrawn + uint64(balance);
        _burn(msg.sender, balance);
        _transferVotingUnits(msg.sender, address(0), balance);
        LOCKED_TOKEN.safeTransfer(toDAO, balance);
    }

    function rescue(ERC20Upgradeable token) external onlyRole(DAO_ROLE) {
        require(token != LOCKED_TOKEN, "No allowed to rescue this token");
        // allow to rescue ether
        if (address(token) == address(0)) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }
    receive() external payable {}

    function burnAll() external {
        uint256 balance = super.balanceOf(msg.sender);
        super._burn(msg.sender, balance);
        _transferVotingUnits(msg.sender, address(0), balance);
        // TODO: check if is okay if user withdraw something before burnAll(). Write test for this case.
        vestingInfo[msg.sender].amountAlreadyWithdrawn = 0;
    }

    function transfer(address, uint256) public virtual override returns (bool) {
        revert UnavailableFunctionalityError();
    }

    function supportsInterface(bytes4 interfaceId) public virtual view override returns (bool) {
        return interfaceId == type(ISuVoteToken).interfaceId || super.supportsInterface(interfaceId);
    }

    function _getVotingUnits(address account) internal view virtual override returns (uint256) {
        return super.balanceOf(account);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
