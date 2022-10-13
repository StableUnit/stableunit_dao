// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IBonus {
    /**
     * @notice Info of each user.
     * `xp` The amount of XP.
     * `allocation` User allocation
     * `discountPresale` Discount during presale
    **/
    struct UserInfo {
        uint256 xp;
        uint256 allocation;
        uint256 discountPresale;
    }

    /**
     * @notice Info of each admin.
     * `xpLimit` The amount of XP that admin can distribute over other users
     * `levelLimit` Admins can't distribute tokens so that (user level > levelLimit)
    **/
    struct AdminInfo {
        uint256 xpLimit;
        uint16 levelLimit;
    }

    /**
     * @notice Get user level according to constant distribution. Max value: 65535
     * `user` Address of user
    **/
    function getLevel(address user) external view returns ( uint16 );

    /**
     * @notice Add new admin or replace it
     * `admin` Address of admin
     * `xpLimit` The amount of XP that admin can distribute over other users
     * `levelLimit` Admins can't distribute tokens so that (user level > levelLimit)
    **/
    function addAdmin(address admin, uint256 xpLimit, uint16 levelLimit) external;

    /**
     * @notice Admin can give xp points to user
     * `user` Address of user
     * `xp` The amount of XP that admin want to give user (xp <= admin.xpLimit && levelAfter(user) <= admin.levelLimit)
    **/
    function distribute(address user, uint256 xp) external;
}
