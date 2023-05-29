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

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "../access-control/SuAccessControlAuthenticated.sol";
import "../interfaces/ISuDAOUpgrader.sol";
import "../interfaces/IveERC20v2.sol";

/**
 * @title The contract that distribute suDAO tokens for community based on NFT membership
 */
contract SuDAOUpgrader is SuAccessControlAuthenticated, ISuDAOUpgrader {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IveERC20v2 public VE_ERC_20;
    IERC20Upgradeable public SU_DAO;
    IERC20Upgradeable public SU_DAO_OLD;

    function initialize(
        address _accessControlSingleton,
        address _suDAOOld,
        address _suDAONew,
        address _veErc20
    ) initializer public {
        __SuAuthenticated_init(_accessControlSingleton);
        SU_DAO_OLD = IERC20Upgradeable(_suDAOOld);
        SU_DAO = IERC20Upgradeable(_suDAONew);
        VE_ERC_20 = IveERC20v2(_veErc20);

        IERC20Upgradeable(_suDAONew).approve(_veErc20, type(uint256).max);
    }

    function participate(uint256 donationAmount) payable external {
        uint256 rewardAmount = donationAmount * 100 * 16 / 21;

        // get tokens from user
        SU_DAO_OLD.safeTransferFrom(msg.sender, address(this), donationAmount);
        // give reward to the user
        if (SU_DAO.balanceOf(address(this)) < rewardAmount) revert NoContractRewardLeft();
        VE_ERC_20.lockUnderVesting(msg.sender, rewardAmount);

        emit Participated(msg.sender, donationAmount);
    }

    receive() external payable {}

    /**
     * @notice The owner of the contact can take away tokens sent to the contract.
     * @dev The owner can't take away SuDAO token already distributed to users, because they are stored on timelockVault
     */
    function adminWithdraw(IERC20Upgradeable token) external onlyRole(ADMIN_ROLE) {
        if (token == IERC20Upgradeable(address(0))) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }

    uint256[48] private __gap;
}
