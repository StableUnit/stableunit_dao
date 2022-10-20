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

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../vested-escrow/VeERC20.sol";
import "../utils/SuAccessControl.sol";
import "../utils/BancorFormula.sol";

/**
 * @title The contract that distribute suDAO tokens for community based on NFT membership
 */
contract TokenDistributor_v4 is BancorFormula, SuAccessControl {
    using SafeERC20 for IERC20;
    using Math for *;

    VeERC20 public immutable VE_ERC_20;
    IERC20 public immutable SU_DAO;
    address public immutable BONUS_CONTRACT;

    struct DistributionInfo {
        uint64 startTimestamp;                 // the date when participation is available
        uint64 deadlineTimestamp;              // ultimate date when participation is available

        uint256 minimumDonationUsd;            // let's think that price(donationToken) = $1
        uint256 maximumDonationUsd;
        uint256 reserveRatio;                  // reserve ratio for Bancor formula, represented in ppm, 1-1000000

        uint256 donationGoalMin;
        uint256 donationGoalMax;
        mapping(address => uint256) donations; // donationAmounts
        uint256 totalDonations;                // sum of all user donations
        address donationToken;                 // For now it's only DAI

        uint64 fullVestingSeconds;             // Default vesting period is 12 months
        uint64 cliffSeconds;                   //      with 3 months cliff.
        // unlockFrequency
        // tgeUnlock
        //
        address[] nftRequirement;                // User should have certain NFT to be able to participate
    }

    mapping(uint256 => DistributionInfo) public distributions;

    constructor (IERC20 _suDAO, VeERC20 _veErc20, address _bonusContract) {
        SU_DAO = _suDAO;
        VE_ERC_20 = _veErc20;
        BONUS_CONTRACT = _bonusContract;
        _suDAO.approve(address(_veErc20), type(uint256).max);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function getBondingCurvePrice(uint256 distributionId, uint256 donationAmount) public returns (uint256) {
        DistributionInfo storage distribution = distributions[distributionId];

        return calculatePurchaseReturn(
            distribution.donationGoalMax,
            distribution.totalDonations,
            distribution.reserveRatio,
            donationAmount
        );
    }

    /**
     * notice Allows to participate for users with required NFT
     * param distributionId The id of distribution, set in setDistribution method
     * param donationAmount The amount of tokens specified in distributions[distributionId].donationMethod
     */
    function participate(uint256 distributionId, uint256 donationAmount) payable external {
        DistributionInfo storage distribution = distributions[distributionId];

        require(distribution.maximumDonationAmount > 0, "distribution doesn't exit");
        require(block.timestamp >= distribution.startTimestamp, "participation has not started yet");
        require(block.timestamp <= distribution.deadlineTimestamp, "participation is over");
        require(IERC721(distribution.nftRequirement).balanceOf(msg.sender) > 0, "caller doesn't have required NFT");
        require(
            donationAmount > distribution.minimumDonationUsd,
            "Your donation should be greater than minimum donation"
        );

        uint256 bonusAllocation = IBonus(BONUS_CONTRACT).userInfo[msg.sender].allocation;
        uint256 maxAllocation = bonusAllocation == 0 ? distribution.maximumDonationUsd : bonusAllocation;
        require(
            donations[msg.sender] + donationAmount < maxAllocation,
            "Your donations should be less than max donation"
        );

        uint256 bonusDiscountRatio = IBonus(BONUS_CONTRACT).userInfo[msg.sender].discountRatioPresale;
        uint256 rewardAmount = getBondingCurvePrice(donationAmount) * (1e18 + bonusDiscountRatio) / 1e18;

        // get donation from the user
        IERC20(distribution.donationMethod).safeTransferFrom(msg.sender, address(this), donationAmount);
        distribution.totalDonations = distribution.totalDonations + donationAmount;
        donations[msg.sender] = donations[msg.sender] + donationAmount;

        // give reward to the user
        require(SU_DAO.balanceOf(address(this)) >= rewardAmount, "not enough reward left");
        VE_ERC_20.safeLockUnderVesting(
            msg.sender,
            rewardAmount,
            distribution.fullVestingSeconds,
            distribution.cliffSeconds
        );
        emit Participated(msg.sender, distributionId, donationAmount);
    }

    /**
     * @notice Get the max donation that user can do
     */
    function getMaximumDonationAmount(uint256 distributionId, address user) view external returns (uint256) {
        DistributionInfo storage distribution = distributions[distributionId];
        if (IERC721(distribution.nftRequirement).balanceOf(user) == 0) return 0;

        return Math.min(
            distribution.maximumDonationUsd - distribution.donations[user],
            distribution.donationGoalMax - distribution.donations[user]
        );
    }

    function takeDonationBack(uint256 distributionId) public {
        DistributionInfo storage distribution = distributions[distributionId];

        require(block.timestamp >= distribution.deadlineTimestamp, "Participation has not yet ended");
        require(distribution.totalDonations < distribution.donationGoalMin, "Min goal reached");
        require(VE_ERC_20.balanceOf(msg.sender) == 0, "You should donate all your tokens in veERC20");

        uint256 donationAmount = distribution.donations(msg.sender);
        IERC20(distribution.donationMethod).safeTransferFrom(address(this), msg.sender, donationAmount);
        distribution.totalDonations = distribution.totalDonations - donationAmount;
    }

    /**
     * @notice The owner can set new or edit existing token distribution with no restrictions
     */
    function setDistribution(
        uint256 id,
        uint256 startTimestamp,
        uint256 deadlineTimestamp,
        uint256[] rewardRatioPolynom1E18,
        uint256 donationGoalMin,
        uint256 donationGoalMax,
        uint256 minimumDonationUsd,
        uint256 maximumDonationUsd,
        address donationToken,
        uint64 fullVestingSeconds,
        uint64 cliffSeconds,
        address nftRequirement
    ) external onlyRole(MINTER_ROLE) {
        require(cliffSeconds < fullVestingSeconds, "!cliff seconds < vesting seconds");
        require(minimumRewardAllocation <= maximumRewardAllocation, "!min < max rewards");
        require(startTimestamp < deadlineTimestamp, "!startTimestamp < deadlineTimestamp");
        require(donationGoalMin <= donationGoalMax, "!donationGoalMin <= donationGoalMax");
        require(minimumDonationUsd <= maximumDonationUsd, "!minimumDonationUsd <= maximumDonationUsd");

        distributions[id] = DistributionInfo({
            startTimestamp: startTimestamp,
            deadlineTimestamp: deadlineTimestamp,
            rewardRatioPolynom1E18: rewardRatioPolynom1E18,
            donationGoalMin: donationGoalMin,
            donationGoalMax: donationGoalMax,
            minimumDonationUsd: minimumDonationUsd,
            maximumDonationUsd: maximumDonationUsd,
            totalDonations: 0,
            donationToken: donationToken,
            fullVestingSeconds: fullVestingSeconds,
            cliffSeconds: cliffSeconds,
            nftRequirement: nftRequirement
        });

        emit SetDistribution(
            startTimestamp,
            deadlineTimestamp,
            rewardRatioPolynom1E18,
            donationGoalMin,
            donationGoalMax,
            minimumDonationUsd,
            maximumDonationUsd,
            donationToken,
            fullVestingSeconds,
            cliffSeconds,
            nftRequirement
        );
    }

    receive() external payable {}

    /**
     * @notice The owner of the contact can take away tokens sent to the contract.
     * @dev The owner can't take away SuDAO token already distributed to users, because they are stored on timelockVault
     */
    function adminWithdraw(IERC20 token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token == IERC20(address(0))) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }

    event Participated(address msg_sender, uint256 distributionId, uint256 donationAmount);
    event SetDistribution(
        uint256 id,
        uint256 startTimestamp,
        uint256 deadlineTimestamp,
        uint256[] rewardRatioPolynom1E18,
        uint256 donationGoalMin,
        uint256 donationGoalMax,
        uint256 minimumDonationUsd,
        uint256 maximumDonationUsd,
        address donationToken,
        uint64 fullVestingSeconds,
        uint64 cliffSeconds,
        address nftRequirement
    );
}
