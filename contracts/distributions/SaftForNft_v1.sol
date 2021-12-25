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

import "../dependencies/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../dependencies/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "../dependencies/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../dependencies/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

// SIMPLE AGREEMENT FOR FUTURE TOKENS (SAFT)
interface ISaft {
    // The Purchaser shall purchase Tokens from the Company in accordance with the following terms:
    struct PurchaserInfo {
        uint256 maximumTokenAllocation; // (1) Maximum number of suDAO Tokens to be purchased by the Purchaser
                                        // (2) Price per token is maximumTokenAllocation / maximumPurchaseAmount
        IERC20 paymentMethod;           // (4) Payment method, for example USDT
        uint64 paymentDeadline;         // (5) Payment ultimate date.
        uint64 fullVestingTimestamp;    // (6) Default vesting period is 12 months
        uint64 cliffTimestamp;          //     with 3 months cliff.

        uint256 _tokensBought;
        uint256 _tokensClaimed;
    }

    function purchase(address purchaser, uint256 payAmount, address _nft) external payable;
    function availableToClaim(address purchaser) external view returns (uint256);
    function claimTokens() external;
}

contract SaftForNft_v1 is ISaft, Ownable {
    using SafeERC20 for IERC20;
    IERC20 public immutable suDAO;

    address public immutable dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // dai
    address[] public supportedNFTs;
    mapping (address => bool) public supportedNFT;
    mapping (address => uint256) public pricePerNFT;

    mapping (address => PurchaserInfo) public presale;
    uint256 public totalTokensSold;
    uint256 public immutable endDate = block.timestamp + 60 days;

    function addNFT(address _nft) external onlyOwner {
        require(!supportedNFT[_nft], "NFT added already");

        supportedNFT[_nft] = true;
        supportedNFTs.push(_nft);
    }

    function setPriceForNFTType(address _nft, uint256 _price) external onlyOwner {
        require(supportedNFT[_nft], "NFT is not supported");

        pricePerNFT[_nft] = _price;
    }

    function purchase(address purchaser, uint256 payAmount, address _nft) external payable override {
        PurchaserInfo storage p = presale[purchaser];
        uint purchaserBalance = IERC721Enumerable(_nft).balanceOf(purchaser);
        // check that allocation exits
        require(p.maximumTokenAllocation != 0,
            "purchase isn't initialized");
        require(block.timestamp <= p.paymentDeadline,
            "payment deadline is over");
        require(supportedNFT[_nft],
            "NFT is not supported");
        require(purchaserBalance >= 1,
            "purchaser doesn't have NFT");
        require(pricePerNFT[_nft] > 0, "Price for NFT is not specified");

        uint256 id = IERC721Enumerable(_nft).tokenOfOwnerByIndex(purchaser, 0);
        IERC721Enumerable(_nft).safeTransferFrom(purchaser, address(this), id);

        // maximumPurchaseAmount would give maximumTokenAllocation
        // so payAmount would give maximumTokenAllocation * (payAmount / maximumPurchaseAmount)
        payAmount = payAmount - payAmount % pricePerNFT[_nft];
        uint256 purchaseAmount = payAmount / pricePerNFT[_nft];

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
            paymentMethod: IERC20(dai),
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
            IERC20(dai),
            p.paymentDeadline,
            p.fullVestingTimestamp,
            p.cliffTimestamp
        );
    }

    // ???
    function updatePaymentDeadline(address purchaser, uint64 newPaymentPeriodSeconds) external onlyOwner {
        PurchaserInfo storage p = presale[purchaser];
        p.paymentDeadline = uint64(block.timestamp) + newPaymentPeriodSeconds;
    }

    // TODO: remove
    function increaseAllocation(
        address purchaser,
        uint256 newMaxTokenAllocation
    ) external onlyOwner {
        PurchaserInfo storage p = presale[purchaser];
        require(p.maximumTokenAllocation != 0, "purchase isn't initialized");

        require(newMaxTokenAllocation > p.maximumTokenAllocation, "invalid newMaxTokenAllocation");
        suDAO.safeTransferFrom(msg.sender, address(this), newMaxTokenAllocation - p.maximumTokenAllocation);

        p.maximumTokenAllocation = newMaxTokenAllocation;
    }

    // TOOD: remove
    function decreaseAllocation(
        address purchaser,
        uint256 newMaxTokenAllocation
    ) external onlyOwner {
        PurchaserInfo storage p = presale[purchaser];
        require(p.maximumTokenAllocation != 0, "purchase isn't initialized");

        require(newMaxTokenAllocation <= p.maximumTokenAllocation, "invalid newMaxTokenAllocation");
        require(p._tokensBought <= newMaxTokenAllocation, "newMaxTokenAllocation < tokensBought");

        suDAO.safeTransfer(msg.sender, p.maximumTokenAllocation - newMaxTokenAllocation);

        p.maximumTokenAllocation = newMaxTokenAllocation;
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

    // TODO: rename to rescure
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
        IERC20 stakeTokenAddress,
        uint64 stakeDeadlineTimestamp,
        uint64 rewardCliffTimestamp,
        uint64 rewardVestingTimestamp
    );
    event Staked(address account, uint256 stakedAmount);
    event ClaimedReward(address account, uint256 rewardAmount);
}
