// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
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
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./interfaces/IBonus.sol";
import "./access-control/SuAccessControlUpgradable.sol";

contract Bonus is IBonus, SuAccessControlUpgradable {
    mapping(address => NFTInfo) public nftInfo;
    mapping(address => UserInfo) public userInfo;
    mapping(address => CommunityAdminInfo) public communityAdminInfo;
    mapping(address => AdminInfo) public adminInfo;

    function initialize(address _accessControlSingleton) public initializer {
        __SuAuthenticated_init(_accessControlSingleton);
    }

    function _getLevelByXP(uint256 xp) internal pure returns (uint16) {
        if (xp < 1000) return 1;
        if (xp < 2000) return 2;
        if (xp < 3200) return 3;
        if (xp < 4600) return 4;
        if (xp < 6200) return 5;
        if (xp < 8000) return 6;
        if (xp < 10000) return 7;
        if (xp < 12200) return 8;
        if (xp < 14700) return 9;

        if (xp < 17500) return 10;
        if (xp < 20600) return 11;
        if (xp < 24320) return 12;
        if (xp < 28784) return 13;
        if (xp < 34140) return 14;
        if (xp < 40567) return 15;
        if (xp < 48279) return 16;
        if (xp < 57533) return 17;
        if (xp < 68637) return 18;
        if (xp < 81961) return 19;

        if (xp < 97949) return 20;
        if (xp < 117134) return 21;
        if (xp < 140156) return 22;
        if (xp < 167782) return 23;
        if (xp < 200933) return 24;
        if (xp < 240714) return 25;
        if (xp < 288451) return 26;
        if (xp < 345735) return 27;
        if (xp < 414475) return 28;
        if (xp < 496963) return 29;

        if (xp < 595948) return 30;
        if (xp < 714730) return 31;
        if (xp < 857268) return 32;
        if (xp < 1028313) return 33;
        if (xp < 1233567) return 34;
        if (xp < 1479871) return 35;
        if (xp < 1775435) return 36;
        if (xp < 2130111) return 37;
        if (xp < 2555722) return 38;
        if (xp < 3066455) return 39;

        if (xp < 3679334) return 40;
        if (xp < 4414788) return 41;
        if (xp < 5297332) return 42;
        if (xp < 6356384) return 43;
        if (xp < 7627246) return 44;
        if (xp < 9152280) return 45;
        if (xp < 10982320) return 46;
        if (xp < 13178368) return 47;
        if (xp < 15813625) return 48;
        if (xp < 18975933) return 49;

        if (xp < 22770702) return 50;
        if (xp < 27324424) return 51;
        if (xp < 32788890) return 52;
        if (xp < 39346249) return 53;
        if (xp < 47215079) return 54;
        if (xp < 56657675) return 55;
        if (xp < 67988790) return 56;
        if (xp < 81586128) return 57;
        if (xp < 97902933) return 58;
        if (xp < 117483099) return 59;

        if (xp < 140979298) return 60;
        if (xp < 169174736) return 61;
        if (xp < 203009261) return 62;
        if (xp < 243610691) return 63;
        if (xp < 292332407) return 64;
        if (xp < 350798466) return 65;
        if (xp < 420957736) return 66;
        if (xp < 505148860) return 67;
        if (xp < 606178208) return 68;
        if (xp < 727413425) return 69;

        if (xp < 872895685) return 70;
        if (xp < 1047474397) return 71;
        if (xp < 1256968851) return 72;
        if (xp < 1508362195) return 73;
        if (xp < 1810034207) return 74;
        if (xp >= 1810034207) return 75;

        return 1;
    }

    function getLevel(address user) public view override returns (uint16) {
        return _getLevelByXP(userInfo[user].xp);
    }

    function setAdmin(address admin, bool isAdmin) public onlyRole(DAO_ROLE) override {
        adminInfo[admin].isAdmin = isAdmin;
    }

    function setCommunityAdmin(address communityAdmin, uint256 xpLimit, uint16 levelLimit) public onlyRole(ADMIN_ROLE) override {
        require(adminInfo[msg.sender].isAdmin, "Need admin rights");
        communityAdminInfo[communityAdmin].xpLimit = xpLimit;
        communityAdminInfo[communityAdmin].levelLimit = levelLimit;
    }

    function setNftInfo(address nft, uint256 allocation, uint256 discountRatioPresale) public onlyRole(ADMIN_ROLE) override {
        nftInfo[nft].allocation = allocation;
        nftInfo[nft].discountRatioPresale = discountRatioPresale;
    }

    function setUserInfo(address user, uint256 allocation, uint256 discountRatioPresale) public onlyRole(ADMIN_ROLE) override {
        userInfo[user].allocation = allocation;
        userInfo[user].discountRatioPresale = discountRatioPresale;
    }

    function distribute(address user, uint256 xp) public onlyRole(COMMUNITY_ADMIN_ROLE) override {
        require(
            xp <= communityAdminInfo[msg.sender].xpLimit,
            "XP to distribute shouldn't be more than admin xpLimit"
        );
        communityAdminInfo[msg.sender].xpLimit = communityAdminInfo[msg.sender].xpLimit - xp;
        userInfo[user].xp = userInfo[user].xp + xp;

        uint16 newUserLevel = _getLevelByXP(userInfo[user].xp);
        require(
            newUserLevel <= communityAdminInfo[msg.sender].levelLimit,
            "User level should be les than admin levelLimit"
        );
    }

    function getAllocation(address user) public view override returns (uint256) {
        return userInfo[user].allocation;
    }

    function getDiscount(address user) public view override returns (uint256) {
        return userInfo[user].discountRatioPresale;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[45] private __gap;
}
