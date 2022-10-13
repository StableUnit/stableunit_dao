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
import "./interfaces/IBonus.sol";

// TODO: add onlyAdmin and onlyOwner modificators
contract Bonus is IBonus {
    mapping(address => UserInfo) public userInfo;
    mapping(address => AdminInfo) public adminInfo;

    function getLevel(address user) public override {
        // implementation
        return 1;
    }

    function addAdmin(address admin, uint256 xpLimit, uint16 levelLimit) public onlyOwner override {
        adminInfo[admin].xpLimit = xpLimit;
        adminInfo[admin].levelLimit = levelLimit;
    }

    function distribute(address user, uint256 xp) onlyAdmin override {
        require(xp <= adminInfo[msg.sender].xpLimit, "XP to distribute shouldn't be more than admin xpLimit");
        // implementation
    }
}
