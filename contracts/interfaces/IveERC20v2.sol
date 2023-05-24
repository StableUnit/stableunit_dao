// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

interface IveERC20v2 {
    /* ====================== VARS ====================== */
    function alreadyWithdrawn (address user) external view returns (uint256 amountAlreadyWithdrawn);

    /* ===================== EVENTS ===================== */
    event Claimed(address account, uint256 claimAmount);

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

    /**
    * @notice Creates an account with time-vesting for the user and withdraws these tokens from msg.sender.
    * @param account Beneficiary of the vesting account.
    * @param amount Amount of tokens to be send, which will be deducted from msg.sender.
    */
    function lockUnderVesting(address account, uint256 amount) external;

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
