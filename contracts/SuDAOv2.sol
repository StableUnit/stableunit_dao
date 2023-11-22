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

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./periphery/contracts/access-control/SuAuthenticatedNonUpgradeable.sol";

/**
 * @title Governance token for StableUnit Decentralized Autonomous Organisation
 */
contract SuDAOv2 is ERC20Votes, ERC20Burnable, SuAuthenticatedNonUpgradeable {
    using SafeERC20 for ERC20;

    uint256 public constant MAX_SUPPLY = 16_000_000 * 100 * 1e18;
    uint256 public constant MAX_POST_VESTING_INFLATION = 5_000_000 * 100 * 1e18;
    uint32 public constant MIN_FULLY_DILUTED_VESTING = 4 * 365 days;
    uint32 public DEPLOY_TIME;

    error MaxSupplyExceeded();

    constructor(address _accessControlSingleton)
    ERC20("StableUnit DAO v2", "SuDAO")
    ERC20Permit("StableUnit DAO v2")
    SuAuthenticatedNonUpgradeable(_accessControlSingleton)
    {
        DEPLOY_TIME = uint32(block.timestamp);
    }

    function mint(address account, uint256 amount) external onlyRole(DAO_ROLE) {
        uint32 timePassed = uint32(block.timestamp) - DEPLOY_TIME;
        uint256 currentMaxSupply = timePassed < MIN_FULLY_DILUTED_VESTING
            ? MAX_SUPPLY
            : MAX_SUPPLY + MAX_POST_VESTING_INFLATION;
        if (totalSupply() + amount > currentMaxSupply) revert MaxSupplyExceeded();

        _mint(account, amount);
    }

    /**
     * @notice The DAO can take away tokens accidentally sent to the contract.
     */
    function rescueTokens(ERC20 token) external onlyRole(DAO_ROLE) {
        // allow to rescue ether
        if (address(token) == address(0)) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }

    receive() external payable {}

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}
