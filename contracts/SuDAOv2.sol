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

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./access-control/SuAccessControlAuthenticated.sol";

/**
 * @title Governance token for StableUnit Decentralized Autonomous Organisation
 */
contract SuDAOv2 is ERC20VotesUpgradeable, ERC20BurnableUpgradeable, SuAccessControlAuthenticated {
    using SafeERC20Upgradeable for ERC20Upgradeable;

    uint256 public constant MAX_SUPPLY = 16_000_000 * 100 * 1e18;
    uint256 public constant MAX_POST_VESTING_INFLATION = 5_000_000 * 100 * 1e18;
    uint32 public constant MIN_FULLY_DILUTED_VESTING = 4 * 365 days;
    uint32 public DEPLOY_TIME;

    error MaxSupplyExceeded();

    function initialize(address _accessControlSingleton) initializer public {
        __SuAuthenticated_init(_accessControlSingleton);
        __ERC20_init("StableUnit DAO v2", "SuDAO");

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
    function rescueTokens(ERC20Upgradeable token) external onlyRole(DAO_ROLE) {
        // allow to rescue ether
        if (address(token) == address(0)) {
            payable(msg.sender).transfer(address(this).balance);
        } else {
            token.safeTransfer(address(msg.sender), token.balanceOf(address(this)));
        }
    }

    receive() external payable {}

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
    internal
    override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
    internal
    override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
    internal
    override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._burn(account, amount);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
