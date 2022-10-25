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
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "../access-control/SuAccessControlAuthenticated.sol";
import "../interfaces/IBonus.sol";
import "../interfaces/IveERC20.sol";

/**
 * @title The contract that distribute suDAO tokens for community based on NFT membership
 */
contract TokenDistributorV4 is SuAccessControlAuthenticated {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using Math for *;

    address public VE_ERC_20;
    address public SU_DAO;
    address public BONUS_CONTRACT;

    uint64 public startTimestamp;                 // The date when participation is available
    uint64 public deadlineTimestamp;              // Ultimate date when participation is available

    uint256 public minimumDonation;            // Let's think that price(donationToken) = $1
    uint256 public maximumDonation;
    uint256[] public bondingCurvePolynomial1e18;                  // Reserve ratio for Bancor formula, represented in ppm, 1-1000000

    uint256 public donationGoalMin;
    uint256 public donationGoalMax;
    mapping(address => uint256) public donations; // Donation amounts
    uint256 public totalDonations;                // Sum of all user donations
    address public donationToken;                 // For now it's only DAI

    uint64 public fullVestingSeconds;             // Default vesting period is 12 months
    uint64 public cliffSeconds;                   // With 3 months cliff.
    uint64 public tgeUnlockRatio1e18;
    uint64 public vestingFrequencySeconds;

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private nftRequirement;


    error NoActiveDistributionError();
    error DistributionTimeframeError();
    error AccessNftNotValidError(address accessNft);
    error NoAccessNftError(address account, address accessNft);


    function initialize (address _accessControlSingleton, address _suDAO, address _veErc20, address _bonusContract) initializer public {
        __SuAuthenticated_init(_accessControlSingleton);
        SU_DAO = _suDAO;
        VE_ERC_20 = _veErc20;
        BONUS_CONTRACT = _bonusContract;
        IERC20Upgradeable(_suDAO).approve(address(_veErc20), type(uint256).max);
    }

    function bondingCurvePolynomial1e18At(uint256 x) public view returns (uint256) {
        uint256 l = bondingCurvePolynomial1e18.length;
        uint256 x_ = 1;
        uint256 px = 0;
        for (uint256 i = 0; i < l; i++) {
            px = px + bondingCurvePolynomial1e18[i]*x_ / 1e18;
            x_ = x_*x;
        }
        return px;
    }

    function antiderivativeOfBondingCurvePolynomial1e18At(uint256 x) public view returns (uint256) {
        uint256 l = bondingCurvePolynomial1e18.length;
        uint256 x_ = x;
        uint256 px = 0;
        for (uint256 i = 0; i < l; i++) {
            px = px + bondingCurvePolynomial1e18[i]*x_ / (i+1);
            x_ = x_*x;
        }
        return px;
    }

    function getBondingCurveRewardAmountFromDonation(uint256 donationAmount) public view returns (uint256) {
        uint256 S1 = antiderivativeOfBondingCurvePolynomial1e18At(totalDonations);
        uint256 S2 = antiderivativeOfBondingCurvePolynomial1e18At(totalDonations + donationAmount);
        return Math.min(IERC20Upgradeable(SU_DAO).balanceOf(address(this)), S2 - S1);
    }

    function getAccessNftsForUser(address account) external returns (address[] memory) {
        address[] memory nfts = nftRequirement.values();
        uint256 l = nfts.length;
        address[] memory answer = new address[](l);
        for (uint256 i = 0; i < l; i++) {
            if (IERC721(nfts[i]).balanceOf(msg.sender) > 0) {
                answer[i] = nfts[i];
            }
        }
        return answer;
    }

    /**
     * notice Allows to participate for users with required NFT
     * param donationAmount The amount of tokens specified in donationToken
     */
    function participate(uint256 donationAmount, address accessNft) payable external {
        if (donationGoalMax == 0)
            revert NoActiveDistributionError();
        if (block.timestamp < startTimestamp || deadlineTimestamp < block.timestamp)
            revert DistributionTimeframeError();
        if (!nftRequirement.contains(accessNft))
            revert AccessNftNotValidError(accessNft);
        if (IERC721(accessNft).balanceOf(msg.sender) == 0)
            revert NoAccessNftError(msg.sender, accessNft);

        require(
            donationAmount > minimumDonation,
            "Your donation should be greater than minimum donation"
        );

        uint256 bonusAllocation = IBonus(BONUS_CONTRACT).getAllocation(msg.sender);
        uint256 maxAllocation = bonusAllocation == 0 ? maximumDonation : bonusAllocation;
        require(
            donations[msg.sender] + donationAmount < maxAllocation,
            "Your donations should be less than max donation"
        );

        uint256 bonusDiscountRatio = IBonus(BONUS_CONTRACT).getDiscount(msg.sender);
        uint256 rewardAmount = getBondingCurveRewardAmountFromDonation(donationAmount) * (1e18 + bonusDiscountRatio) / 1e18;

        // get donation from the user
        IERC20Upgradeable(donationToken).safeTransferFrom(msg.sender, address(this), donationAmount);
        totalDonations = totalDonations + donationAmount;
        donations[msg.sender] = donations[msg.sender] + donationAmount;

        // give reward to the user
        require(IERC20Upgradeable(SU_DAO).balanceOf(address(this)) >= rewardAmount, "not enough reward left");
        IveERC20(VE_ERC_20).lockUnderVesting(
            msg.sender,
            rewardAmount,
            fullVestingSeconds,
            cliffSeconds,
            tgeUnlockRatio1e18,
            vestingFrequencySeconds
        );
        emit Participated(msg.sender, donationAmount);
    }

    /**
     * @notice Get the max donation that user can do
     */
    function getMaximumDonationAmount(address user, address accessNft) view external returns (uint256) {
        if (IERC721(accessNft).balanceOf(msg.sender) > 0) {
            return Math.min(
                maximumDonation - donations[user],
                donationGoalMax - totalDonations
            );
        }
        return 0;
    }

    function takeDonationBack() external {
        require(block.timestamp >= deadlineTimestamp, "Participation has not yet ended");
        require(totalDonations < donationGoalMin, "Min goal reached");
        require(IERC20Upgradeable(VE_ERC_20).balanceOf(msg.sender) == 0, "You should donate all your tokens in veERC20");

        uint256 donationAmount = donations[msg.sender];
        donations[msg.sender] = 0;
        totalDonations = totalDonations - donationAmount;
        IERC20Upgradeable(donationToken).safeTransferFrom(address(this), msg.sender, donationAmount);
    }

    /**
     * @notice The owner can set new or edit existing token distribution with no restrictions
     */
    function setDistributionInfo(
        uint64 _startTimestamp,
        uint64 _deadlineTimestamp,
        uint256 _donationGoalMin,
        uint256 _donationGoalMax,
        uint256 _minimumDonation,
        uint256 _maximumDonation,
        address _donationToken,
        uint64 _fullVestingSeconds,
        uint64 _cliffSeconds,
        uint64 _tgeUnlockRatio1e18,
        uint64 _vestingFrequencySeconds
    ) external onlyRole(ADMIN_ROLE) {
        require(_startTimestamp < _deadlineTimestamp, "!_startTimestamp < _deadlineTimestamp");
        require(_donationGoalMin <= _donationGoalMax, "!donationGoalMin <= donationGoalMax");
        require(_minimumDonation <= _maximumDonation, "!minimumDonationUsd <= maximumDonationUsd");
        require(_donationToken != address(0), "donationToken is null");
        require(_cliffSeconds < _fullVestingSeconds, "!cliff seconds < vesting seconds");
        require(_tgeUnlockRatio1e18 <= 1e18, "tgeUnlockRatio should be less than 1");

        startTimestamp = _startTimestamp;
        deadlineTimestamp = _deadlineTimestamp;
        donationGoalMin = _donationGoalMin;
        donationGoalMax = _donationGoalMax;
        minimumDonation = _minimumDonation;
        maximumDonation = _maximumDonation;
        donationToken = _donationToken;
        fullVestingSeconds = _fullVestingSeconds;
        cliffSeconds = _cliffSeconds;
        tgeUnlockRatio1e18 = _tgeUnlockRatio1e18;
        vestingFrequencySeconds = _vestingFrequencySeconds;

        emit SetDistribution(
            _startTimestamp,
            _deadlineTimestamp,
            _donationGoalMin,
            _donationGoalMax,
            _minimumDonation,
            _maximumDonation,
            _donationToken,
            _fullVestingSeconds,
            _cliffSeconds,
            _tgeUnlockRatio1e18,
            _vestingFrequencySeconds
        );
    }

    function setNftAccess(address accessNft, bool valid) external onlyRole(ADMIN_ROLE) {
        if (valid) {
            nftRequirement.add(accessNft);
        } else {
            nftRequirement.remove(accessNft);
        }
    }

    receive() external payable {}

    function getDistributorStaticData() public returns (
        uint64 startTimestamp,
        uint64 deadlineTimestamp,
        uint256 minimumDonation,
        uint256 maximumDonation,
        uint256 donationGoalMin,
        uint256 donationGoalMax,
        address donationToken,
        uint64 fullVestingSeconds,
        uint64 cliffSeconds,
        uint64 tgeUnlockRatio1e18,
        uint64 vestingFrequencySeconds
    ) {
        return (
            startTimestamp,
            deadlineTimestamp,
            minimumDonation,
            maximumDonation,
            donationGoalMin,
            donationGoalMax,
            donationToken,
            fullVestingSeconds,
            cliffSeconds,
            tgeUnlockRatio1e18,
            vestingFrequencySeconds
        );
    }

    /**
     * @notice The owner of the contact can take away tokens sent to the contract.
     * @dev The owner can't take away SuDAO token already distributed to users, because they are stored on timelockVault
     */
    function adminWithdraw(IERC20Upgradeable token) external onlyRole(DAO_ROLE) {
        if (token == IERC20Upgradeable(address(0))) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }

    event Participated(address msg_sender, uint256 donationAmount);
    event SetDistribution(
        uint64 _startTimestamp,
        uint64 _deadlineTimestamp,
        uint256 _donationGoalMin,
        uint256 _donationGoalMax,
        uint256 _minimumDonation,
        uint256 _maximumDonation,
        address _donationToken,
        uint64 _fullVestingSeconds,
        uint64 _cliffSeconds,
        uint64 _tgeUnlockRatio1e18,
        uint64 _vestingFrequencySeconds
    );

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
