// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface ISuDAOUpgrader {

    /* ===================== EVENTS ===================== */
    event Participated(address account, uint256 donationAmount);

    /* ===================== ERRORS ===================== */
    error NoContractRewardLeft();

    /* ==================== MUTABLE METHODS ==================== */

    /**
     * @notice Allows to participate for users with required NFT
     * @param donationAmount The amount of SU_DAO tokens
     */
    function participate(uint256 donationAmount) payable external;
}
