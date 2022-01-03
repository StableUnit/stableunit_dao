// SPDX-License-Identifier: MIT
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
pragma solidity ^0.8.7;

import "../dependencies/openzeppelin-contracts/contracts/utils/math/Math.sol";
import "./TokenDistributor_v2s1.sol";
import "../NFT/StableUnitDAOaNFT.sol";


/**
 * @title Extended version of TokenDistributor_v2 that support bonus participation for aNFT token holders
 * @notice All functions of TokenDistributor_v2 are available too.
 * @custom:experimental This is an experimental contract.
 */
contract TokenDistributor_v3s1 is TokenDistributor_v2s1 {
    using SafeERC20 for IERC20;

    StableUnitDAOaNFT public immutable A_NFT;

    constructor(StableUnitDAOaNFT _aNft, ERC20 _suDao, TimelockVault _timelockVault)
    TokenDistributor_v2s1(_suDao, _timelockVault)
    {
        A_NFT = _aNft;
    }

    /**
     * notice Allows to participate for users with required NFT **and** aNFT that gives bonus
     * param distributionId The id of distribution, set in setDistribution method
     * param donationAmount The amount of tokens specified in distributions[distributionId].donationMethod
     */
    function participateWithBonus(uint256 distributionId, uint256 donationAmount) payable external {
        DistributionInfo storage distribution = distributions[distributionId];

        // check basic participation requirements
        require(distribution.maximumDonationAmount > 0, "distribution doesn't exit");
        require(block.timestamp >= distribution.startTimestamp, "participation has not started yet");
        require(block.timestamp <= distribution.deadlineTimestamp, "participation is over");
        require(IERC721(distribution.nftRequirement).balanceOf(msg.sender) > 0, "caller doesn't have community NFT");
        require(A_NFT.balanceOf(msg.sender) > 0, "caller doesn't have aNFT");

        // bonus depends on the aNFT level as reward off, i.e.
        // 25% off = 1/(1-0.25) = 4/3 = +33% bonus
        // 75% off = 1/(1-0.75) = x4 = +300% bonus
        uint256 bonus = 1e18 * A_NFT.getLevel(msg.sender) / A_NFT.BASE_LEVEL();
        uint256 rewardAmount = donationAmount
        * distribution.maximumRewardAllocation / distribution.maximumDonationAmount
        * bonus / 1e18;

        uint256 totalRewardAmount = TIMELOCK_VAULT.totalDeposited(msg.sender) + rewardAmount;
        require(totalRewardAmount >= distribution.minimumRewardAllocation, "insufficient minimal amount");
        require(totalRewardAmount <= distribution.maximumRewardAllocation * bonus / 1e18, "exceeded participation limit");

        // get tokens from user
        if (distribution.donationMethod == address(0)) {
            require(msg.value == donationAmount, "invalid donation amount");
        } else {
            IERC20(distribution.donationMethod).safeTransferFrom(msg.sender, address(this), donationAmount);
        }
        // give reward to the user
        require(SU_DAO.balanceOf(address(this)) >= rewardAmount, "not enough reward left");
        TIMELOCK_VAULT.safeLockUnderVesting(
            msg.sender,
            rewardAmount,
            distribution.fullVestingSeconds,
            distribution.cliffSeconds
        );
        emit Participated(msg.sender, distributionId, donationAmount);
    }
}
