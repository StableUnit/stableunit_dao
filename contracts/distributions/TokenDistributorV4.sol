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
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "../access-control/SuAccessControlAuthenticated.sol";
import "../interfaces/IBonus.sol";
import "../interfaces/IveERC20.sol";

/**
 * @title The contract that distribute suDAO tokens for community based on NFT membership
 */
contract TokenDistributorV4 is SuAccessControlAuthenticated {
    using SafeCastUpgradeable for int256;
    using SafeCastUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using Math for *;

    // immutable values in non-upgradable contracts
    address public VE_ERC_20;
    address public SU_DAO;
    IBonus public BONUS_CONTRACT;

    uint64 public startTimestamp;                 // The date when participation is available
    uint64 public deadlineTimestamp;              // Ultimate date when participation is available

    address public donationToken;                 // For now it's only DAI
    uint256 public donationTokenToUSD1e18;        // donationTokenAmount * donationTokenToUSD1e18 == usd value * 1e18
    int256[] public bondingCurvePolynomial1e18;   // curve that shows how much rewards users can get when system got x donations

    uint256 public minimumDonation;
    uint256 public maximumDonation;

    uint256 public donationGoalMin;
    uint256 public donationGoalMax;

    uint64 public fullVestingSeconds;             // Default vesting period is 12 months
    uint64 public cliffSeconds;                   // With 3 months cliff.
    uint64 public tgeUnlockRatio1e18;
    uint64 public vestingFrequencySeconds;

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private nftRequirement;
    // stats
    struct BonusStats {
        uint256 bonusRewarded;
    }
    BonusStats public bonusStats;
    mapping(address => uint256) public donations; // Donation amounts
    uint256 public totalDonations;                // Sum of all user donations

    error NoActiveDistributionError();
    error DistributionTimeframeError();
    error AccessNftNotValidError(address accessNft);
    error NoAccessNftError(address account, address accessNft);
    error NotEnoughRewardLeft(uint256 donationAmountUsd1e18);
    error NegativeAntiderivative(uint256 x);
    error VestingError();
    error DonationAmountError();
    error DonationGoalError(uint256 minGaol, uint256 maxGoal, uint256 totalDonations);
    error DonationTokenError();


    function initialize(address _accessControlSingleton, address _suDAO, address _veErc20, address _bonusContract) initializer public {
        __SuAuthenticated_init(_accessControlSingleton);
        SU_DAO = _suDAO;
        VE_ERC_20 = _veErc20;
        BONUS_CONTRACT = IBonus(_bonusContract);
        IERC20Upgradeable(_suDAO).approve(address(_veErc20), type(uint256).max);
    }

    function bondingCurvePolynomial1e18At(uint256 x) public view returns (int256) {
        int256 xSigned = x.toInt256();
        uint256 l = bondingCurvePolynomial1e18.length;
        int256 x_ = 1;
        int256 px = 0;
        for (uint256 i = 0; i < l; i++) {
            px = px + bondingCurvePolynomial1e18[i] * x_ / (1e18 ** i).toInt256();
            x_ = x_ * xSigned;
        }
        return px;
    }

    function antiderivativeOfBondingCurvePolynomial1e18At(uint256 x) public view returns (uint256) {
        int256 xSigned = x.toInt256();
        uint256 l = bondingCurvePolynomial1e18.length;
        int256 x_ = xSigned;
        int256 px = 0;
        for (uint256 i = 0; i < l; i++) {
            px = px + bondingCurvePolynomial1e18[i] * x_ / (i.toInt256() + 1);
            x_ = x_ * xSigned;
        }
        if (px < 0) revert NegativeAntiderivative(x);
        return uint256(px);
    }

    function getBondingCurveRewardAmountFromDonationUSD(uint256 donationAmountUSD1e18) public view returns (uint256) {
        uint256 S1 = antiderivativeOfBondingCurvePolynomial1e18At(totalDonations * donationTokenToUSD1e18 / 1e18);
        uint256 S2 = antiderivativeOfBondingCurvePolynomial1e18At((totalDonations * donationTokenToUSD1e18 + donationAmountUSD1e18) / 1e18);
        uint256 rewards = S2 - S1;
        if (rewards > IERC20Upgradeable(SU_DAO).balanceOf(address(this))) {
            revert NotEnoughRewardLeft(donationAmountUSD1e18);
        }
        return rewards;
    }

    function getAccessNfts() public view returns (address[] memory) {
        return nftRequirement.values();
    }

    function getAccessNftsForUser(address account) public view returns (address[] memory) {
        address[] memory nfts = nftRequirement.values();
        uint256 l = nfts.length;
        address[] memory answer = new address[](l);
        for (uint256 i = 0; i < l; i++) {
            if (IERC721Upgradeable(nfts[i]).balanceOf(account) > 0) {
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
        if (IERC721Upgradeable(accessNft).balanceOf(msg.sender) == 0)
            revert NoAccessNftError(msg.sender, accessNft);

        if (donationAmount < minimumDonation)
            revert DonationAmountError();
        uint256 bonusAllocation = Math.max(BONUS_CONTRACT.getAllocation(msg.sender), BONUS_CONTRACT.getNftAllocation(accessNft));
        uint256 maxAllocation = bonusAllocation == 0 ? maximumDonation : bonusAllocation;
        if (donations[msg.sender] + donationAmount > maxAllocation) revert DonationAmountError();

        uint256 rewardAmount = getBondingCurveRewardAmountFromDonationUSD(donationAmount * donationTokenToUSD1e18) ;

        uint256 bonusRewardRatio = Math.max(BONUS_CONTRACT.getBonus(msg.sender), BONUS_CONTRACT.getNftBonus(accessNft));
        bonusStats.bonusRewarded = rewardAmount * bonusRewardRatio / 1e18;
        rewardAmount = rewardAmount * (1e18 + bonusRewardRatio) / 1e18;

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
        if (IERC721Upgradeable(accessNft).balanceOf(user) > 0) {
            return Math.min(
                maximumDonation - donations[user],
                donationGoalMax - totalDonations
            );
        }
        return 0;
    }

    function takeDonationBack() external {
        if (block.timestamp < deadlineTimestamp)
            revert DistributionTimeframeError();
        if (totalDonations >= donationGoalMin)
            revert DonationGoalError(donationGoalMin, donationGoalMax, totalDonations);
        if (IERC20Upgradeable(VE_ERC_20).balanceOf(msg.sender) > 0)
            revert DonationAmountError();

        uint256 donationAmount = donations[msg.sender];
        donations[msg.sender] = 0;
        totalDonations = totalDonations - donationAmount;
        IERC20Upgradeable(donationToken).safeTransfer(msg.sender, donationAmount);
    }

    /**
     * @notice The admin can set new or edit existing token vesting details
     */
    function setDistributionVesting(
        uint64 _fullVestingSeconds,
        uint64 _cliffSeconds,
        uint64 _tgeUnlockRatio1e18,
        uint64 _vestingFrequencySeconds
    ) external onlyRole(ADMIN_ROLE) {
        if (_cliffSeconds > _fullVestingSeconds) {
            revert VestingError();
        }
        if (_tgeUnlockRatio1e18 > 1e18) {
            revert VestingError();
        }
        if (_vestingFrequencySeconds == 0 || _vestingFrequencySeconds > _fullVestingSeconds) {
            revert VestingError();
        }
        fullVestingSeconds = _fullVestingSeconds;
        cliffSeconds = _cliffSeconds;
        tgeUnlockRatio1e18 = _tgeUnlockRatio1e18;
        vestingFrequencySeconds = _vestingFrequencySeconds;
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
        uint256 _donationTokenToUSD1e18
    ) external onlyRole(ADMIN_ROLE) {
        if (_startTimestamp >= _deadlineTimestamp)
            revert DistributionTimeframeError();
        if (_donationGoalMin > _donationGoalMax)
            revert DonationGoalError(_donationGoalMin, _donationGoalMax, totalDonations);
        if (_minimumDonation > _maximumDonation)
            revert DonationAmountError();
        if(_donationToken == address(0))
            revert DonationTokenError();

        startTimestamp = _startTimestamp;
        deadlineTimestamp = _deadlineTimestamp;
        donationGoalMin = _donationGoalMin;
        donationGoalMax = _donationGoalMax;
        minimumDonation = _minimumDonation;
        maximumDonation = _maximumDonation;
        donationToken = _donationToken;
        donationTokenToUSD1e18 = _donationTokenToUSD1e18;
    }

    function setBondingCurve(int256[] memory _bondingCurvePolynomial1e18) external onlyRole(ADMIN_ROLE) {
        bondingCurvePolynomial1e18 = _bondingCurvePolynomial1e18;
    }

    function setNftAccess(address accessNft, bool valid) external onlyRole(ADMIN_ROLE) {
        if (valid) {
            nftRequirement.add(accessNft);
        } else {
            nftRequirement.remove(accessNft);
        }
    }

    receive() external payable {}

    function getDistributorStaticData() view external returns (
        uint64 startTimestamp_,
        uint64 deadlineTimestamp_,
        uint256 minimumDonation_,
        uint256 maximumDonation_,
        uint256 donationGoalMin_,
        uint256 donationGoalMax_,
        address donationToken_,
        uint64 fullVestingSeconds_,
        uint64 cliffSeconds_,
        uint64 tgeUnlockRatio1e18_,
        uint64 vestingFrequencySeconds_
    ) {
        startTimestamp_ = startTimestamp;
        deadlineTimestamp_ = deadlineTimestamp;
        minimumDonation_ = minimumDonation;
        maximumDonation_ = maximumDonation;
        donationGoalMin_ = donationGoalMin;
        donationGoalMax_ = donationGoalMax;
        donationToken_ = donationToken;
        fullVestingSeconds_ = fullVestingSeconds;
        cliffSeconds_ = cliffSeconds;
        tgeUnlockRatio1e18_ = tgeUnlockRatio1e18;
        vestingFrequencySeconds_ = vestingFrequencySeconds;
    }

    /**
     * @notice The DAO can take away donations.
     * @dev The DAO can't take away SuDAO token already distributed to users,
     *      because they are stored on different contract
     */
    function daoWithdraw(IERC20Upgradeable token, address to, uint256 amount) external onlyRole(DAO_ROLE) {
        if (block.timestamp < deadlineTimestamp)
            revert DistributionTimeframeError();
        if (totalDonations < donationGoalMin)
            revert DonationGoalError(donationGoalMin, donationGoalMax, totalDonations);

        token.safeTransfer(to, amount);
    }

//    function emergencyWithdraw(IERC20Upgradeable token) external onlyRole(DAO_ROLE) {
//        if (address(token) == address(0)) {
//            payable(msg.sender).transfer(address(this).balance);
//        } else {
//            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
//        }
//    }

    event Participated(address msg_sender, uint256 donationAmount);

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[48] private __gap;
}
