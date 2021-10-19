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
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "../TimelockVault.sol";
import "hardhat/console.sol";

/**
 * @title The contract that distribute suDAO tokens for community based on NFT membership
 */
contract TokenDistributor_v2s1 is Ownable {
    using SafeERC20 for IERC20;

    TimelockVault public immutable TIMELOCK_VAULT;
    IERC20 public immutable SU_DAO;

    struct DistributionInfo {
        uint256 minimumRewardAllocation;    // Minimum amount of suDAO Tokens to acquire
        uint256 maximumRewardAllocation;    // Maximum amount of suDAO Tokens to acquire
        uint256 maximumDonationAmount;      // Maximum donation amount, for example 50,000 USDT
        address donationMethod;             // for example USDT address
        uint64 startTimestamp;              // the date when participation is available
        uint64 deadlineTimestamp;           // ultimate date when participation is available
        uint64 fullVestingSeconds;          // Default vesting period is 12 months
        uint64 cliffSeconds;                //      with 3 months cliff.
        //
        address nftRequirement;             // User should have certain NFT to be able to participate
    }

    mapping(uint256 => DistributionInfo) public distributions;

    constructor (IERC20 _suDAO, TimelockVault _timelockVault) {
        SU_DAO = _suDAO;
        TIMELOCK_VAULT = _timelockVault;
        _suDAO.approve(address(_timelockVault), type(uint256).max);
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

        uint256 rewardAmount = distribution.maximumRewardAllocation * donationAmount / distribution.maximumDonationAmount;
        uint256 totalRewardAmount = TIMELOCK_VAULT.totalDeposited(msg.sender) + rewardAmount;
        require(totalRewardAmount >= distribution.minimumRewardAllocation, "insufficient minimal amount");
        require(totalRewardAmount <= distribution.maximumRewardAllocation, "exceeded participation limit");

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

    /**
     * @notice The owner can set new or edit existing token distribution with no restrictions
     */
    function getMaximumDonationAmount(uint256 distributionId, address user) view external returns (uint256) {
        DistributionInfo storage distribution = distributions[distributionId];
        if (IERC721(distribution.nftRequirement).balanceOf(user) == 0) return 0;
        return distribution.maximumRewardAllocation - TIMELOCK_VAULT.totalDeposited(user);
    }

    /**
     * @notice The owner can set new or edit existing token distribution with no restrictions
     */
    function setDistribution(
        uint256 id,
        uint256 minimumRewardAllocation,
        uint256 maximumRewardAllocation,
        uint256 maximumDonationAmount,
        address donationMethod,
        uint64 startTimestamp,
        uint64 deadlineTimestamp,
        uint64 fullVestingSeconds,
        uint64 cliffSeconds,
        address nftRequirement
    ) external onlyOwner {
        require(cliffSeconds < fullVestingSeconds, "cliff seconds < vesting seconds");
        require(minimumRewardAllocation <= maximumRewardAllocation, "invalid min/max rewards");

        distributions[id] = DistributionInfo({
        minimumRewardAllocation : minimumRewardAllocation,
        maximumRewardAllocation : maximumRewardAllocation,
        maximumDonationAmount : maximumDonationAmount,
        donationMethod : donationMethod,
        startTimestamp: startTimestamp,
        deadlineTimestamp : deadlineTimestamp,
        fullVestingSeconds : fullVestingSeconds,
        cliffSeconds : cliffSeconds,
        nftRequirement : nftRequirement
        });

        emit SetDistribution(
            id,
            minimumRewardAllocation,
            maximumRewardAllocation,
            maximumDonationAmount,
            donationMethod,
            startTimestamp,
            deadlineTimestamp,
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
    function adminWithdraw(IERC20 token) external onlyOwner {
        if (token == IERC20(address(0))) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }

    event Participated(address msg_sender, uint256 distributionId, uint256 donationAmount);
    event SetDistribution(
        uint256 id,
        uint256 minimumRewardAllocation,
        uint256 maximumRewardAllocation,
        uint256 maximumDonationAmount,
        address donationMethod,
        uint64 startTimestamp,
        uint64 deadlineTimestamp,
        uint64 fullVestingSeconds,
        uint64 cliffSeconds,
        address nftRequirement
    );
}
