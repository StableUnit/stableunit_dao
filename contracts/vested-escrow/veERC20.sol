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
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";
import "../access-control/SuAccessControlModifiers.sol";
import "../interfaces/IveERC20.sol";

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
contract veERC20 is ERC20Upgradeable, SuAccessControlModifiers, IveERC20 {
    using SafeERC20Upgradeable for ERC20Upgradeable;

    ERC20Upgradeable public LOCKED_TOKEN;
    uint32 public TGE_MAX_TIMESTAMP;
    uint32 public tgeTimestamp;

    struct VestingInfo {
        // we keep all data in one 256 bits slot to safe on gas usage
        uint256 amountAlreadyWithdrawn;
        uint256 cliffSeconds;
        uint256 vestingSeconds;
        uint256 tgeUnlockRatio1e18; // [0..1], uint64 is enough because log2(1e18) ~= 60
        uint256 vestingFrequencySeconds;
    }
    mapping(address => VestingInfo) public vestingInfo;

    function initialize(ERC20Upgradeable _lockedToken) initializer public {
        __ERC20_init(string.concat("vested escrow ", _lockedToken.name()), string.concat("ve", _lockedToken.symbol()));
        LOCKED_TOKEN = _lockedToken;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        TGE_MAX_TIMESTAMP = 1685577600; // Unix Timestamp	1685577600 = GMT+0 Thu Jun 01 2023 00:00:00 GMT+0000
        tgeTimestamp = TGE_MAX_TIMESTAMP;
    }

    /**
    * @notice owner of the contract can set up TGE date within set limits.
    */
    function updateTgeTimestamp(uint32 newTgeTimestamp) external onlyOwner {
        require(uint32(block.timestamp) <= newTgeTimestamp, "veERC20: TGE date can't be in the past");
        require(newTgeTimestamp <= TGE_MAX_TIMESTAMP, "veERC20: new TGE date is beyond limit");
        tgeTimestamp = newTgeTimestamp;
    }

    /**
    * @notice Total amount of token was deposited under vesting on behalf of the user.
    */
    function totalDeposited(address user) public view returns (uint256) {
        return IERC20Upgradeable(this).balanceOf(user);
    }

    /**
    * @notice Total amount of token user had claimed.
    */
    function totalClaimed(address user) public view returns (uint256) {
        return vestingInfo[user].amountAlreadyWithdrawn;
    }

    /**
    * @notice Creates an account with time-vesting for the user and withdraws these tokens from msg.sender.
    * @param account Beneficiary of the vesting account.
    * @param amount Amount of tokens to be send, which will be deducted from msg.sender.
    * @param vestingSeconds Amount of seconds when linear vesting would be over. Starts from cliff.
    * @param cliffSeconds Amount of seconds while tokens would be completely locked.
    * @param tgeUnlockRatio1e18 ratio/1e18 ⊂ [0..1] that indicates how many tokens are going to be unlocked during TGE
    * @param vestingFrequencySeconds how frequently token are going to be unlocked after the cliff.
    */
    function lockUnderVesting(
        address account,
        uint256 amount,
        uint256 vestingSeconds,
        uint256 cliffSeconds,
        uint256 tgeUnlockRatio1e18,
        uint256 vestingFrequencySeconds
    ) external onlyOwner override
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
        require(cliffSeconds <= vestingSeconds, "cliffTime should be less then vestingTime");
        require(tgeUnlockRatio1e18 <= 1e18, "tgeUnlockRatio should be less than 1");

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

    /**
    * @notice Adds more tokens to the existing (possibly zero) vesting account. Doesn't change vesting period!
    * @param account Beneficiary of the vesting account.
    * @param amount Amount of token to be send to user under vesting, which will be deducted from msg.sender.
    */
    function addBalance(address account, uint256 amount) public {
        LOCKED_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        // mint more veERC20 tokens for the account
        _mint(account, amount);
    }

    /**
     * @notice Checks amount of vested tokens minus already withdrawn.
     * @return Returns amount of tokens the users can withdraw right now.
     */
    function availableToClaim(address user) public view returns (uint256) {
        VestingInfo memory info = vestingInfo[user];
        uint256 t = block.timestamp;
        // if the time is before the TGE - there's nothing vested yet
        if (t < tgeTimestamp) return 0;

        // if it's past TGE, there's at lest tgeUnlockRatio is vested
         uint256 vested = super.balanceOf(user) * info.tgeUnlockRatio1e18/1e18;

        // if the time is before the cliff
        if (t < (tgeTimestamp + info.cliffSeconds)) {
            // there's nothing additional vested yet
        } else {
            // if after the cliff

            // if it's beyond vesting time
            if ((tgeTimestamp + info.vestingSeconds) < t) {
                // everything is vested
                vested = super.balanceOf(user);
            } else {
                // otherwise the amount is proportional to the amount after the cliff before end of vesting
                uint256 x = super.balanceOf(user);
                // how much second passed after cliff
                uint256 y = (t - (tgeTimestamp + info.cliffSeconds));
                // how much seconds from cliff to end of vesting
                uint256 z = (uint256(info.vestingSeconds) - uint256(info.cliffSeconds));
                // y2 := max y2 : vestingFrequencySeconds*N <= y
                uint256 y2 = y / info.vestingFrequencySeconds * info.vestingFrequencySeconds;

                vested = x * y2 / z;
            }
        }

        // the answer is how much is vested in total minute how much already withdrawn
        return vested - uint256(info.amountAlreadyWithdrawn);
    }

    /**
     * @notice User can claim their vested tokens.
     */
    function claim() external {
        uint256 claimAmount = availableToClaim(msg.sender);
        require(claimAmount > 0, "Can't claim 0 tokens");
        vestingInfo[msg.sender].amountAlreadyWithdrawn = vestingInfo[msg.sender].amountAlreadyWithdrawn + claimAmount;
        LOCKED_TOKEN.safeTransfer(msg.sender, claimAmount);
    }

    /**
     * @notice User can donate tokens under vesting to DAO or other admin contract as us treasury.
     */
    function donateTokens(address toAdmin) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, toAdmin) == true, "invalid admin address");
        uint256 balance = balanceOf(msg.sender);
        require(balance > 0, "nothing to donate");
        vestingInfo[msg.sender].amountAlreadyWithdrawn = vestingInfo[msg.sender].amountAlreadyWithdrawn + uint64(balance);
        LOCKED_TOKEN.safeTransfer(toAdmin, balance);
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return super.balanceOf(account) - vestingInfo[account].amountAlreadyWithdrawn;
    }

    /**
    * @notice The owner of the contact can take away tokens accidentally sent to the contract.
    */
    function rescue(ERC20Upgradeable token) external onlyOwner {
        require(token != LOCKED_TOKEN, "No allowed to rescue this token");
        // allow to rescue ether
        if (address(token) == address(0)) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }
    receive() external payable {}
}
