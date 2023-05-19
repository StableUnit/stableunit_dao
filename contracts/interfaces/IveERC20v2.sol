// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

interface IveERC20v2 {
    struct VestingInfo {
        // we keep all data in one 256 bits slot to safe on gas usage
        uint256 amountAlreadyWithdrawn;
        uint256 cliffSeconds;
        uint256 vestingSeconds;
        uint256 tgeUnlockRatio1e18; // [0..1], uint64 is enough because log2(1e18) ~= 60
        uint256 vestingFrequencySeconds;
    }

    /* ===================== ERRORS ===================== */

    error TGEInPastError();
    error IDOInPastError();
    error TGEBeyondLimitError();
    error ClaimZeroError();
    error BadCliffAndVesting();
    error BadUnlockRatio();
    error BadDAOAddress(address dao);
    error NoBalance();

    /* ==================== MUTABLE METHODS ==================== */

    // @notice owner of the contract can set up TGE date within set limits.
    function updateTgeTimestamp(uint32 newTgeTimestamp) external;

    // @notice owner of the contract can set up IDO date (token release data)
    function updateIdoTimestamp(uint32 newTgeTimestamp) external;

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
    ) external;

    /**
    * @notice Adds more tokens to the existing (possibly zero) vesting account. Doesn't change vesting period!
    * @param account Beneficiary of the vesting account.
    * @param amount Amount of token to be send to user under vesting, which will be deducted from msg.sender.
    */
    function addBalance(address account, uint256 amount) external;

    // @notice User can claim their vested tokens.
    function claim() external;

    // @notice User can donate tokens under vesting to DAO or other admin contract as us treasury.
    function donateTokens(address toDAO) external;

    // @notice The DAO can take away tokens accidentally sent to the contract.
    function rescue(ERC20Upgradeable token) external;

    function burnAll() external;

    /* ==================== VIEW METHODS ==================== */

    // @notice Total amount of token was deposited under vesting on behalf of the user.
    function totalDeposited(address user) external view returns (uint256);

    // @notice Total amount of token user had claimed.
    function totalClaimed(address user) external view returns (uint256);

    /**
    * @notice Checks amount of vested tokens minus already withdrawn.
    * @return Returns amount of tokens the users can withdraw right now.
    */
    function availableToClaim(address user) external view returns (uint256);
}
