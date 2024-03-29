// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IBonus {
    /**
     * @notice Info for each nft.
     * `allocation` User allocation
     * `donationBonusRatio` Bonus during distribution
     */
    struct NFTInfo {
        uint256 allocation;
        uint256 donationBonusRatio;
    }

    /**
     * @notice Info of each user.
     * `xp` The amount of XP.
     * `allocation` User allocation
     * `donationBonusRatio` Bonus during distribution
     */
    struct UserInfo {
        uint256 xp;
        uint256 allocation;
        uint256 donationBonusRatio;
    }

    /**
     * @notice Info of each admin (Can setup communityAdmin)
     * `isAdmin` Boolean if it's admin
     */
    struct AdminInfo {
        bool isAdmin;
    }

    /**
     * @notice Info of each community admin (Can distribute XP).
     * `xpLimit` The amount of XP that admin can distribute over other users
     * `levelLimit` Admins can't distribute tokens so that (user level > levelLimit)
     */
    struct CommunityAdminInfo {
        uint256 xpLimit;
        uint16 levelLimit;
    }

    /**
     * @notice Set allocation and donationBonusRatio for NFT
     * `isAdmin` Address of admin
     */
    function setNftInfo(address nft, uint256 allocation, uint256 donationBonusRatio) external;

    /**
     * @notice Set allocation and donationBonusRatio for user
     * `isAdmin` Address of admin
     */
    function setUserInfo(address user, uint256 allocation, uint256 donationBonusRatio) external;

    /**
     * @notice Get user level according to constant distribution. Max value: 65535
     * `user` Address of user
     */
    function getLevel(address user) external view returns ( uint16 );

    /**
     * @notice Add or remove new admin
     * `isAdmin` Address of admin
     */
    function setAdmin(address admin, bool isAdmin) external;

    /**
     * @notice Set new community admin parameters
     * `admin` Address of admin
     * `xpLimit` The amount of XP that admin can distribute over other users
     * `levelLimit` Admins can't distribute tokens so that (user level >= levelLimit)
     */
    function setCommunityAdmin(address admin, uint256 xpLimit, uint16 levelLimit) external;

    /**
     * @notice Admin can give xp points to user
     * `user` Address of user
     * `xp` The amount of XP that admin want to give user (xp <= admin.xpLimit && levelAfter(user) <= admin.levelLimit)
     */
    function distributeXp(address user, uint256 xp) external;

    /**
     * @notice Get user allocation
     * `user` Address of user
     */
    function getAllocation(address user) external view returns ( uint256 );

    /**
     * @notice Get user bonus reward for donation
     * `user` Address of user
     */
    function getBonus(address user) external view returns ( uint256 );

    /**
     * @notice Get nft allocation
     * `user` Address of user
     */
    function getNftAllocation(address nft) external view returns ( uint256 );

    /**
     * @notice Get nft bonus reward for donation
     * `user` Address of nft
     */
    function getNftBonus(address nft) external view returns ( uint256 );

    /**
     * @notice Returns true/false whether this NFT with tokenId can do transfer
     */
    function isTokenTransferable(address nft, uint256 tokenId) external view returns (bool);
}
