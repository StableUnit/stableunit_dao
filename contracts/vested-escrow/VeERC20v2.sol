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
contract VeERC20v2 is SuVoteToken, ERC20Upgradeable, IveERC20v2 {
    using SafeERC20Upgradeable for ERC20Upgradeable;
    using SafeERC20Upgradeable for ERC20BurnableUpgradeable;

    ERC20BurnableUpgradeable public LOCKED_TOKEN;
    uint32 public tgeTimestamp;

    // ratio/1e18 ⊂ [0..1] that indicates how many tokens are going to be unlocked during TGE
    // uint64 is enough because log2(1e18) ~= 60
    uint64 public tgeUnlockRatio1e18;

    // Amount of seconds while tokens would be completely locked.
    uint32 public cliffSeconds;

    // Amount of seconds when vesting would be over. Starts from cliff.
    uint32 public vestingSeconds;

    // how frequently token are going to be unlocked after the cliff.
    uint32 public vestingFrequencySeconds;

    mapping(address => uint256) public alreadyWithdrawn;
    mapping(address => bool) public isTransferable;

    function initialize(
        address _accessControlSingleton,
        ERC20BurnableUpgradeable _lockedToken,
        uint32 _maxTgeTimestamp
    ) initializer public {
        string memory veSymbol = string.concat("ve", _lockedToken.symbol());
        __SuVoteToken__init(_accessControlSingleton, veSymbol);
        __ERC20_init(string.concat("voted escrow ", _lockedToken.name()), veSymbol);

        LOCKED_TOKEN = _lockedToken;
        tgeTimestamp = _maxTgeTimestamp;

        cliffSeconds = 6 * 30 days;
        vestingSeconds = 24 * 30 days;
        vestingFrequencySeconds = 6 * 30 days;
        tgeUnlockRatio1e18 = 10 * 1e16; // 10%
    }

    function updateTimestamps(
        uint32 newTgeTimestamp,
        uint32 newCliffSeconds,
        uint32 newVestingSeconds,
        uint64 newTgeUnlockRatio,
        uint32 newVestingFrequencySeconds
    ) external onlyRole(ADMIN_ROLE) {
        if (newTgeTimestamp < uint32(block.timestamp)) revert TGEInPastError();
        if (newTgeUnlockRatio > 1e18) revert BadUnlockRatio();
        if (newVestingSeconds == 0) revert BadVestingTimestamps();
        if (
            newVestingSeconds == 0 ||
            (newVestingSeconds / newVestingFrequencySeconds * newVestingFrequencySeconds) != newVestingSeconds
        ) revert BadVestingTimestamps();

        tgeTimestamp = newTgeTimestamp;
        cliffSeconds = newCliffSeconds;
        vestingSeconds = newVestingSeconds;
        tgeUnlockRatio1e18 = newTgeUnlockRatio;
        vestingFrequencySeconds = newVestingFrequencySeconds;
    }

    function totalDeposited(address user) public view returns (uint256) {
        return super.balanceOf(user) + alreadyWithdrawn[user];
    }

    function totalClaimed(address user) public view returns (uint256) {
        return alreadyWithdrawn[user];
    }

    function lockUnderVesting(address account, uint256 amount) external onlyRole(ADMIN_ROLE) {
        LOCKED_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        // mint more veERC20 tokens for the account
        _mint(account, amount);
        _transferVotingUnits(address(0), account, amount);
        // if don't delegate, delegate to yourself by default
        if (delegates(account) == address(0)) {
            _delegate(account, account);
        }
    }

    function availableToClaim(address account) public view returns (uint256) {
        uint256 t = block.timestamp;
        // if the time is before the TGE - there's nothing vested yet
        if (t < tgeTimestamp) return 0;

        uint256 N = totalDeposited(account);

        // if it's past TGE, there's at least tgeUnlockRatio is vested
        uint256 vested = N * tgeUnlockRatio1e18 / 1e18;

        // if the time is before the cliff
        if (t < (tgeTimestamp + cliffSeconds)) {
            // there's nothing additional vested yet
        } else { // if after the cliff
            // if it's beyond vesting time = everything is vested
            if ((tgeTimestamp + cliffSeconds + vestingSeconds) < t) {
                vested = N;
            } else {
                // how much second passed after cliff
                uint256 timePassed = (t - (tgeTimestamp + cliffSeconds));
                // last full vesting part (i.e 13 month => k = 12 month with vestingFrequencySeconds = 6 month)
                uint256 fullVestingPart = timePassed / vestingFrequencySeconds * vestingFrequencySeconds;

                // (N - vested) = tokens left to be vested after tge
                vested = vested + (N - vested) * fullVestingPart / vestingSeconds;
            }
        }

        // the answer is how much is vested in total minus how much already withdrawn
        return vested <= alreadyWithdrawn[account] ? 0 : vested - alreadyWithdrawn[account];
    }

    function claim() external {
        uint256 claimAmount = availableToClaim(msg.sender);
        if (claimAmount == 0) revert ClaimZeroError();
        alreadyWithdrawn[msg.sender] = alreadyWithdrawn[msg.sender] + claimAmount;
        _burn(msg.sender, claimAmount);
        _transferVotingUnits(msg.sender, address(0), claimAmount);
        LOCKED_TOKEN.safeTransfer(msg.sender, claimAmount);

        emit Claimed(msg.sender, claimAmount);
    }

    // TODO: check if we need that and it's secure
    // function donateTokens(address toDAO) external {
    //     if (hasRole(DAO_ROLE, toDAO) == false) revert BadDAOAddress(toDAO);
    //     uint256 balance = super.balanceOf(msg.sender);
    //     if (balance == 0) revert NoBalance();
    //     alreadyWithdrawn[msg.sender] = alreadyWithdrawn[msg.sender] + balance;
    //     _burn(msg.sender, balance);
    //     _transferVotingUnits(msg.sender, address(0), balance);
    //     LOCKED_TOKEN.safeTransfer(toDAO, balance);
    // }

    function rescue(ERC20Upgradeable token) external onlyRole(DAO_ROLE) {
        // allow to rescue ether
        if (address(token) == address(0)) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }
    receive() external payable {}

    // function burnAll() external {
    //     uint256 balance = super.balanceOf(msg.sender);
    //     super._burn(msg.sender, balance);
    //     _transferVotingUnits(msg.sender, address(0), balance);
    //     // TODO: check if is okay if user withdraw something before burnAll(). Write test for this case.
    //     alreadyWithdrawn[msg.sender] = 0;
    // }

    /*
     * @dev Admin can set expections for veERC20 and let some accounts to tranfer locked tokens
     */
    function adminTransferUnlock(address account, bool _isTransferable) external onlyRole(ADMIN_ROLE) {
        isTransferable[account] = _isTransferable;
    }

    // TODO: Should we enable transfers? Need for staking in for liquidation, or briding for governance?
    // possible update: owner/admin should maintains whitelist of addresses,
    // if at least one of sender,recipient are in this list - allow to transfer.
    // But we should think it though. Perhaps update updatability really solves it though.
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        if (isTransferable[msg.sender] || isTransferable[to]) {
            super._transfer(msg.sender, to, amount);
            _transferVotingUnits(msg.sender, to, amount);
        } else {
            revert UnableToTransfer(msg.sender);
        }
        return true;
    }

    function burn(uint256 amount) public virtual {
        _burn(msg.sender, amount);
        _transferVotingUnits(msg.sender, address(0), amount);
        LOCKED_TOKEN.burn(amount);
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
