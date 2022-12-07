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
import "./access-control/SuAccessControlAuthenticated.sol";

contract Bonus is IBonus, SuAccessControlAuthenticated {
    mapping(address => NFTInfo) public nftInfo;
    mapping(address => UserInfo) public userInfo;

    mapping(address => AdminInfo) public adminInfo;
    mapping(address => CommunityAdminInfo) public communityAdminInfo;

    mapping(uint16 => uint256) public levelMap;

    function initialize(address _accessControlSingleton, address defaultAdmin) public initializer {
        __SuAuthenticated_init(_accessControlSingleton);
        adminInfo[defaultAdmin].isAdmin = true;

        levelMap[1] = 1000;
        levelMap[2] = 2000;
        levelMap[3] = 3200;
        levelMap[4] = 4600;
        levelMap[5] = 6200;
        levelMap[6] = 8000;
        levelMap[7] = 10000;
        levelMap[8] = 12200;
        levelMap[9] = 14700;
        levelMap[10] = 17500;
        levelMap[11] = 20600;
        levelMap[12] = 24320;
        levelMap[13] = 28784;
        levelMap[14] = 34140;
        levelMap[15] = 40567;
        levelMap[16] = 48279;
        levelMap[17] = 57533;
        levelMap[18] = 68637;
        levelMap[19] = 81961;
        levelMap[20] = 97949;
        levelMap[21] = 117134;
        levelMap[22] = 140156;
        levelMap[23] = 167782;
        levelMap[24] = 200933;
        levelMap[25] = 240714;
        levelMap[26] = 288451;
        levelMap[27] = 345735;
        levelMap[28] = 414475;
        levelMap[29] = 496963;
        levelMap[30] = 595948;
        levelMap[31] = 714730;
        levelMap[32] = 857268;
        levelMap[33] = 1028313;
        levelMap[34] = 1233567;
        levelMap[35] = 1479871;
        levelMap[36] = 1775435;
        levelMap[37] = 2130111;
        levelMap[38] = 2555722;
        levelMap[39] = 3066455;
        levelMap[40] = 3679334;
        levelMap[41] = 4414788;
        levelMap[42] = 5297332;
        levelMap[43] = 6356384;
        levelMap[44] = 7627246;
        levelMap[45] = 9152280;
        levelMap[46] = 10982320;
        levelMap[47] = 13178368;
        levelMap[48] = 15813625;
        levelMap[49] = 18975933;
        levelMap[50] = 22770702;
        levelMap[51] = 27324424;
        levelMap[52] = 32788890;
        levelMap[53] = 39346249;
        levelMap[54] = 47215079;
        levelMap[55] = 56657675;
        levelMap[56] = 67988790;
        levelMap[57] = 81586128;
        levelMap[58] = 97902933;
        levelMap[59] = 117483099;
        levelMap[60] = 140979298;
        levelMap[61] = 169174736;
        levelMap[62] = 203009261;
        levelMap[63] = 243610691;
        levelMap[64] = 292332407;
        levelMap[65] = 350798466;
        levelMap[66] = 420957736;
        levelMap[67] = 505148860;
        levelMap[68] = 606178208;
        levelMap[69] = 727413425;
        levelMap[70] = 872895685;
        levelMap[71] = 1047474397;
        levelMap[72] = 1256968851;
        levelMap[73] = 1508362195;
        levelMap[74] = 1810034207;
        levelMap[75] = 1810034207;
    }

    function getLevelByXP(uint256 xp) public view returns (uint16) {
        for (uint16 i = 1; i <= 75; ++i) {
            if (xp < levelMap[i]) {
                return i;
            }
        }
        return 1;
    }

    function getLevel(address user) public view override returns (uint16) {
        return getLevelByXP(userInfo[user].xp);
    }

    function setAdmin(address admin, bool isAdmin) public onlyRole(DAO_ROLE) override {
        adminInfo[admin].isAdmin = isAdmin;
    }

    function setCommunityAdmin(address communityAdmin, uint256 xpLimit, uint16 levelLimit) public override {
        require(adminInfo[msg.sender].isAdmin, "Need admin rights");
        communityAdminInfo[communityAdmin].xpLimit = xpLimit;
        communityAdminInfo[communityAdmin].levelLimit = levelLimit;
    }

    function setNftInfo(address nft, uint256 allocation, uint256 donationBonusRatio) public override {
        require(adminInfo[msg.sender].isAdmin, "Need admin rights");
        nftInfo[nft].allocation = allocation;
        nftInfo[nft].donationBonusRatio = donationBonusRatio;
    }

    function setUserInfo(address user, uint256 allocation, uint256 donationBonusRatio) public override {
        require(adminInfo[msg.sender].isAdmin, "Need admin rights");
        userInfo[user].allocation = allocation;
        userInfo[user].donationBonusRatio = donationBonusRatio;
    }

    function distributeXp(address user, uint256 xp) public override {
        require(communityAdminInfo[msg.sender].levelLimit > 0, "Need communityAdmin rights");
        require(
            xp <= communityAdminInfo[msg.sender].xpLimit,
            "XP to distribute shouldn't be more than admin xpLimit"
        );

        communityAdminInfo[msg.sender].xpLimit = communityAdminInfo[msg.sender].xpLimit - xp;
        userInfo[user].xp = userInfo[user].xp + xp;

        uint16 newUserLevel = getLevelByXP(userInfo[user].xp);
        require(
            newUserLevel <= communityAdminInfo[msg.sender].levelLimit,
            "User level should be less than admin levelLimit"
        );
    }

    function getAllocation(address user) public view override returns (uint256) {
        return userInfo[user].allocation;
    }

    function getNftAllocation(address nft) public view override returns (uint256) {
        return nftInfo[nft].allocation;
    }


    function getBonus(address user) public view override returns (uint256) {
        return userInfo[user].donationBonusRatio;
    }

    function getNftBonus(address nft) public view override returns (uint256) {
        return nftInfo[nft].donationBonusRatio;
    }

    /**
     * @dev See {IBonus-isTokenTransferable}.
     */
    function isTokenTransferable(address nft, uint256 tokenId) external pure returns (bool) {
        return false;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[45] private __gap;
}
