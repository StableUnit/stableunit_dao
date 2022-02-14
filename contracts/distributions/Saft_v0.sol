// SPDX-License-Identifier: MIT
/*

     /$$$$$$   /$$               /$$       /$$           /$$   /$$           /$$   /$$
    /$$__  $$ | $$              | $$      | $$          | $$  | $$          |__/  | $$
   | $$  \__//$$$$$$    /$$$$$$ | $$$$$$$ | $$  /$$$$$$ | $$  | $$ /$$$$$$$  /$$ /$$$$$$
   |  $$$$$$|_  $$_/   |____  $$| $$__  $$| $$ /$$__  $$| $$  | $$| $$__  $$| $$|_  $$_/
    \____  $$ | $$      /$$$$$$$| $$  \ $$| $$| $$$$$$$$| $$  | $$| $$  \ $$| $$  | $$
    /$$  \ $$ | $$ /$$ /$$__  $$| $$  | $$| $$| $$_____/| $$  | $$| $$  | $$| $$  | $$ /$$
   |  $$$$$$/ |  $$$$/|  $$$$$$$| $$$$$$$/| $$|  $$$$$$$|  $$$$$$/| $$  | $$| $$  |  $$$$/
    \______/   \___/   \_______/|_______/ |__/ \_______/ \______/ |__/  |__/|__/   \___/

*/
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// SIMPLE AGREEMENT FOR FUTURE TOKENS (SAFT)
interface ISaft {
    // The Purchaser shall purchase Tokens from the Company in accordance with the following terms:
    struct PurchaserInfo {
        uint256 maximumTokenAllocation; // (1) Maximum number of suDAO Tokens to be purchased by the Purchaser
        // (2) Price per token is maximumTokenAllocation / maximumPurchaseAmount
        uint256 maximumPurchaseAmount;  // (3) Maximum purchase amount, for example 50,000 USDT
        IERC20 paymentMethod;           // (4) Payment method, for example USDT
        uint64 paymentDeadline;         // (5) Payment ultimate date.
        uint64 fullVestingTimestamp;    // (6) Default vesting period is 12 months
        uint64 cliffTimestamp;          //     with 3 months cliff.

        uint256 _tokensBought;
        uint256 _tokensClaimed;
    }

    function purchase(address purchaser, uint256 payAmount) external payable;
    function availableToClaim(address purchaser) external view returns (uint256);
    function claimTokens() external;
}

contract Saft_v0 is ISaft, Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable suDAO;

    mapping (address => PurchaserInfo) public presale;
    uint256 public totalTokensSold;
    uint256 public immutable endDate = block.timestamp + 60 days;

    function purchase(address purchaser, uint256 payAmount) external payable override {
        PurchaserInfo storage p = presale[purchaser];
        // check that allocation exits
        require(p.maximumTokenAllocation != 0,
            "purchase isn't initialized");
        require(block.timestamp <= p.paymentDeadline,
            "payment deadline is over");
        // maximumPurchaseAmount would give maximumTokenAllocation
        // so payAmount would give maximumTokenAllocation * (payAmount / maximumPurchaseAmount)
        uint256 purchaseAmount = p.maximumTokenAllocation * payAmount / p.maximumPurchaseAmount;
        require(p._tokensBought + purchaseAmount <= p.maximumTokenAllocation,
            "exceeded the purchase limit");
        // pay
        if(p.paymentMethod == IERC20(address(0))) {
            require(msg.value == payAmount, "invalid payment amount");
        } else {
            p.paymentMethod.safeTransferFrom(msg.sender, address(this), payAmount);
        }
        // receive the purchaseToken
        p._tokensBought = p._tokensBought + purchaseAmount;
        totalTokensSold = totalTokensSold + purchaseAmount;
        //
        emit Staked(purchaser, purchaseAmount);
    }

    function tokenVested(address purchaser) public view returns (uint256) {
        PurchaserInfo memory p = presale[purchaser];
        uint64 t = uint64(block.timestamp);
        // can't claim anything before cliff period is over
        if (t <= p.cliffTimestamp) return 0;
        // after vesting is over - 100% of bought tokens are available to claim
        if (p.fullVestingTimestamp < t) return p._tokensBought;
        // otherwise, in the period [cliff ... fullyVested] vesting is proportional to the time passed
        uint256 timeSinceCliffSeconds = t - p.cliffTimestamp;
        uint256 vestingPeriodSeconds = p.fullVestingTimestamp - p.cliffTimestamp;
        return p._tokensBought * timeSinceCliffSeconds / vestingPeriodSeconds;
    }

    function availableToClaim(address purchaser) public view override returns (uint256) {
        return tokenVested(purchaser) - presale[purchaser]._tokensClaimed;
    }

    function claimTokens() external override {
        PurchaserInfo storage p = presale[msg.sender];
        require(p._tokensBought > 0,
            "nothing to claim");
        require(p.cliffTimestamp < block.timestamp,
            "cannot claim tokens before cliff is over");
        uint256 claimAmount = availableToClaim(msg.sender);
        // send claimAmount token to the user and add that amount to tokensClaimed
        p._tokensClaimed = p._tokensClaimed + claimAmount;
        suDAO.safeTransfer(msg.sender, claimAmount);
        emit ClaimedReward(msg.sender, claimAmount);
    }

    constructor (IERC20 _suDAO) {
        suDAO = _suDAO;
    }

    function addPurchaser (
        address purchaser,
        uint256 maximumTokenAllocation,
        uint256 maximumPurchaseAmount,
        IERC20 paymentMethod,
        uint64 paymentPeriodSeconds,
        uint64 cliffSeconds,
        uint64 vestingPeriodSeconds
    ) external onlyOwner {
        require(presale[purchaser].maximumTokenAllocation == 0,
            "purchase is already initialized");
        require(maximumTokenAllocation >= 1e18,
            "allocation is too small");
        require(vestingPeriodSeconds > cliffSeconds,
            "negative vesting");
        suDAO.safeTransferFrom(msg.sender, address(this), maximumTokenAllocation);

        // create account
        PurchaserInfo memory p = PurchaserInfo({
        maximumTokenAllocation: maximumTokenAllocation,
        maximumPurchaseAmount: maximumPurchaseAmount,
        paymentMethod: paymentMethod,
        paymentDeadline: uint64(block.timestamp) + paymentPeriodSeconds,
        fullVestingTimestamp: uint64(block.timestamp) + vestingPeriodSeconds,
        cliffTimestamp: uint64(block.timestamp) + cliffSeconds,
        _tokensBought: 0,
        _tokensClaimed: 0
        });
        // save the account on blockchain
        presale[purchaser] = p;
        // log this information
        emit AddedAccount(
            purchaser,
            maximumTokenAllocation,
            maximumPurchaseAmount,
            paymentMethod,
            p.paymentDeadline,
            p.fullVestingTimestamp,
            p.cliffTimestamp
        );
    }

    function updatePaymentDeadline(address purchaser, uint64 newPaymentPeriodSeconds) external onlyOwner {
        PurchaserInfo storage p = presale[purchaser];
        p.paymentDeadline = uint64(block.timestamp) + newPaymentPeriodSeconds;
    }

    function increaseAllocation(
        address purchaser,
        uint256 newMaxTokenAllocation,
        uint256 newMaxPurchaseAmount
    ) external onlyOwner {
        PurchaserInfo storage p = presale[purchaser];
        require(p.maximumTokenAllocation != 0, "purchase isn't initialized");

        require(newMaxTokenAllocation > p.maximumTokenAllocation, "invalid newMaxTokenAllocation");
        suDAO.safeTransferFrom(msg.sender, address(this), newMaxTokenAllocation - p.maximumTokenAllocation);

        p.maximumTokenAllocation = newMaxTokenAllocation;
        p.maximumPurchaseAmount = newMaxPurchaseAmount;
    }

    function decreaseAllocation(
        address purchaser,
        uint256 newMaxTokenAllocation,
        uint256 newMaxPurchaseAmount
    ) external onlyOwner {
        PurchaserInfo storage p = presale[purchaser];
        require(p.maximumTokenAllocation != 0, "purchase isn't initialized");

        require(newMaxTokenAllocation <= p.maximumTokenAllocation, "invalid newMaxTokenAllocation");
        require(p._tokensBought <= newMaxTokenAllocation, "newMaxTokenAllocation < tokensBought");

        suDAO.safeTransfer(msg.sender, p.maximumTokenAllocation - newMaxTokenAllocation);

        p.maximumTokenAllocation = newMaxTokenAllocation;
        p.maximumPurchaseAmount = newMaxPurchaseAmount;
    }

    /**
     * @notice Purchaser can donate all unclaimed tokens to the system
     */
    function donatePurchasedTokens() external {
        PurchaserInfo storage p = presale[msg.sender];
        require(p._tokensBought > 0, "Account isn't funded");
        // how many tokens are still on the account?
        uint256 tokenUnclaimedBalance = p._tokensBought - p._tokensClaimed;
        // remove them from bought tokens
        p._tokensBought = p._tokensBought - tokenUnclaimedBalance;
        totalTokensSold = totalTokensSold - tokenUnclaimedBalance;
    }

    function adminWithdraw(IERC20 token) external onlyOwner {
        if (token == suDAO) {
            require(block.timestamp > endDate, "Presale haven't finish yet");
            // allow to withdraw unsold suDAO only
            uint256 withdrawAmount = suDAO.balanceOf(address(this)) - totalTokensSold;
            if (withdrawAmount > 0) {
                suDAO.safeTransfer(address(msg.sender), withdrawAmount);
            }
        } if (token == IERC20(address(0))) {
        // allow to rescue ether
        payable(owner()).transfer(address(this).balance);
    } else {
        uint256 withdrawAmount = token.balanceOf(address(this));
        if (withdrawAmount > 0) {
            token.safeTransfer(address(msg.sender), withdrawAmount);
        }
    }
    }

    receive() external payable {}

    event AddedAccount(
        address account,
        uint256 maxRewardTokens,
        uint256 maxStakeTokens,
        IERC20 stakeTokenAddress,
        uint64 stakeDeadlineTimestamp,
        uint64 rewardCliffTimestamp,
        uint64 rewardVestingTimestamp
    );
    event Staked(address account, uint256 stakedAmount);
    event ClaimedReward(address account, uint256 rewardAmount);
}
