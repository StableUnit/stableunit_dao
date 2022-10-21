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
import "../vested-escrow/veERC20.sol";
import "../utils/SuAccessControl.sol";
import "../utils/BancorFormula.sol";

/**
 * @title The contract that distribute suDAO tokens for community based on NFT membership
 */
contract TokenDistributor_v4 is BancorFormula, SuAccessControl {
    using SafeERC20 for IERC20;
    using Math for *;

    veERC20 public immutable VE_ERC_20;
    IERC20 public immutable SU_DAO;
    address public immutable BONUS_CONTRACT;

    uint64 startTimestamp;                 // The date when participation is available
    uint64 deadlineTimestamp;              // Ultimate date when participation is available

    uint256 minimumDonationUsd;            // Let's think that price(donationToken) = $1
    uint256 maximumDonationUsd;
    uint256 reserveRatio;                  // Reserve ratio for Bancor formula, represented in ppm, 1-1000000

    uint256 donationGoalMin;
    uint256 donationGoalMax;
    mapping(address => uint256) donations; // Donation amounts
    uint256 totalDonations;                // Sum of all user donations
    address donationToken;                 // For now it's only DAI

    uint64 fullVestingSeconds;             // Default vesting period is 12 months
    uint64 cliffSeconds;                   // With 3 months cliff.

    address[] nftRequirement;                // User should have certain NFT to be able to participate

    constructor (IERC20 _suDAO, veERC20 _veErc20, address _bonusContract) {
        SU_DAO = _suDAO;
        VE_ERC_20 = _veErc20;
        BONUS_CONTRACT = _bonusContract;
        _suDAO.approve(address(_veErc20), type(uint256).max);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    // TODO: get clear function that: start from p0, at minGoal is p1, at maxGoal is p2. super safe and unhackable
    function getBondingCurvePrice(uint256 donationAmount) public returns (uint256) {
        return calculatePurchaseReturn(
            donationGoalMax,
            totalDonations,
            reserveRatio,
            donationAmount
        );
    }

    /**
     * notice Allows to participate for users with required NFT
     * param donationAmount The amount of tokens specified in donationToken
     */
    // TODO: pass access nft address as the last argument
    function participate(uint256 donationAmount) payable external {
        require(maximumDonationAmount > 0, "distribution doesn't exit");
        require(block.timestamp >= startTimestamp, "participation has not started yet");
        require(block.timestamp <= deadlineTimestamp, "participation is over");
        // TODO: nft requirement is an array
        require(IERC721(nftRequirement).balanceOf(msg.sender) > 0, "caller doesn't have required NFT");
        require(
            donationAmount > minimumDonationUsd,
            "Your donation should be greater than minimum donation"
        );

        uint256 bonusAllocation = IBonus(BONUS_CONTRACT).userInfo[msg.sender].allocation;
        uint256 maxAllocation = bonusAllocation == 0 ? maximumDonationUsd : bonusAllocation;
        require(
            donations[msg.sender] + donationAmount < maxAllocation,
            "Your donations should be less than max donation"
        );

        uint256 bonusDiscountRatio = IBonus(BONUS_CONTRACT).userInfo[msg.sender].discountRatioPresale;
        uint256 rewardAmount = getBondingCurvePrice(donationAmount) * (1e18 + bonusDiscountRatio) / 1e18;

        // get donation from the user
        IERC20(donationToken).safeTransferFrom(msg.sender, address(this), donationAmount);
        totalDonations = totalDonations + donationAmount;
        donations[msg.sender] = donations[msg.sender] + donationAmount;

        // give reward to the user
        require(SU_DAO.balanceOf(address(this)) >= rewardAmount, "not enough reward left");
        VE_ERC_20.safeLockUnderVesting(
            msg.sender,
            rewardAmount,
            fullVestingSeconds,
            cliffSeconds
        );
        emit Participated(msg.sender, donationAmount);
    }

    /**
     * @notice Get the max donation that user can do
     */
    function getMaximumDonationAmount(address user) view external returns (uint256) {
        if (IERC721(nftRequirement).balanceOf(user) == 0) return 0;

        return Math.min(
            maximumDonationUsd - donations[user],
            donationGoalMax - totalDonations
        );
    }

    function takeDonationBack() public {
        require(block.timestamp >= deadlineTimestamp, "Participation has not yet ended");
        require(totalDonations < donationGoalMin, "Min goal reached");
        require(VE_ERC_20.balanceOf(msg.sender) == 0, "You should donate all your tokens in veERC20");

        uint256 donationAmount = donations[msg.sender];
        donations[msg.sender] = 0;
        totalDonations = totalDonations - donationAmount;
        IERC20(donationToken).safeTransferFrom(address(this), msg.sender, donationAmount);
    }

    /**
     * @notice The owner can set new or edit existing token distribution with no restrictions
     */
    function setDistributionInfo(
        uint256 _startTimestamp,
        uint256 _deadlineTimestamp,
        uint256 _reserveRatio,
        uint256 _donationGoalMin,
        uint256 _donationGoalMax,
        uint256 _minimumDonationUsd,
        uint256 _maximumDonationUsd,
        address _donationToken,
        uint64 _fullVestingSeconds,
        uint64 _cliffSeconds,
        address[] _nftRequirement
    ) external onlyRole(MINTER_ROLE) {
        require(cliffSeconds < fullVestingSeconds, "!cliff seconds < vesting seconds");
        require(minimumRewardAllocation <= maximumRewardAllocation, "!min < max rewards");
        require(startTimestamp < deadlineTimestamp, "!startTimestamp < deadlineTimestamp");
        require(donationGoalMin <= donationGoalMax, "!donationGoalMin <= donationGoalMax");
        require(minimumDonationUsd <= maximumDonationUsd, "!minimumDonationUsd <= maximumDonationUsd");

        startTimestamp  = _startTimestamp;
        deadlineTimestamp = _deadlineTimestamp;
        rewardRatioPolynom1E18 = _reserveRatio;
        donationGoalMin = _donationGoalMin;
        donationGoalMax = _donationGoalMax;
        minimumDonationUsd = _minimumDonationUsd;
        maximumDonationUsd = _maximumDonationUsd;
        donationToken = _donationToken;
        fullVestingSeconds = _fullVestingSeconds;
        cliffSeconds = _cliffSeconds;
        nftRequirement = _nftRequirement;

        emit SetDistribution(
            _startTimestamp,
            _deadlineTimestamp,
            _reserveRatio,
            _donationGoalMin,
            _donationGoalMax,
            _minimumDonationUsd,
            _maximumDonationUsd,
            _donationToken,
            _fullVestingSeconds,
            _cliffSeconds,
            _nftRequirement
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

    event Participated(address msg_sender, uint256 donationAmount);
    event SetDistribution(
        uint256 _startTimestamp,
        uint256 _deadlineTimestamp,
        uint256 _reserveRatio,
        uint256 _donationGoalMin,
        uint256 _donationGoalMax,
        uint256 _minimumDonationUsd,
        uint256 _maximumDonationUsd,
        address _donationToken,
        uint64 _fullVestingSeconds,
        uint64 _cliffSeconds,
        address[] _nftRequirement
    );
}
