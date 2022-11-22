// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";

interface ISuVotes is IERC165Upgradeable {
    /**
    * Instead of delegate that is deprecated here we should use delegateOnBehalf that has SYSTEM_ROLE
    */
    function delegateOnBehalf(address account, address delegatee) external virtual;
}
