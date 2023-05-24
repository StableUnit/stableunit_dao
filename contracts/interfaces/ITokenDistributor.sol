// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

struct DistributionInfo {
    uint256 minimumRewardAllocation;    // Minimum amount of suDAO Tokens to acquire
    uint256 maximumRewardAllocation;    // Maximum amount of suDAO Tokens to acquire
    uint256 maximumDonationAmount;      // Maximum donation amount, for example 50,000 USDT
    address nftRequirement;             // User should have certain NFT to be able to participate
}

interface ITokenDistributor {

    /* ===================== EVENTS ===================== */
    event Participated(address account, uint256 donationAmount);

    /* ===================== ERRORS ===================== */
    error NoNFT(address account);
    error NoContractRewardLeft();

    /* ==================== MUTABLE METHODS ==================== */

    /**
     * @notice Allows to participate for users with required NFT
     * @param donationAmount The amount of SU_DAO tokens
     */
    function participate(uint256 donationAmount) payable external;

    // @notice Update the address of nftRequirement. Only owner can call it
    function updateNftRequirement (address _nftRequirement) external;
}
