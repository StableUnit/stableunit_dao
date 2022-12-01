// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/utils/IVotesUpgradeable.sol";

interface ISuVoteToken is IVotesUpgradeable, IERC165Upgradeable {
    /**
    * Instead of delegate that is deprecated here we should use delegateOnBehalf that has SYSTEM_ROLE
    */
    function delegateOnBehalf(address account, address delegatee) external virtual;

    function getTotalSupply() external view returns (uint256);
}
