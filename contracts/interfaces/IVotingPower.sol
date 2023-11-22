// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts-upgradeable/governance/utils/IVotesUpgradeable.sol";

// TODO: add comments
interface IVotingPower is IERC20, IERC20Metadata, IVotesUpgradeable {
    error UnavailableFunctionalityError();
    error WrongArgumentsError();
    error BaseAssumptionError();
    error BadTokenInstance();

    function setTokenWeight(address _token, uint256 _weight) external;
}
