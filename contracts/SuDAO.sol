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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./access-control/SuAccessControlAuthenticated.sol";

/**
 * @title Governance token for StableUnit Decentralized Autonomous Organisation
 */
contract SuDAO is ERC20Votes, ERC20Burnable, SuAccessControlAuthenticated {
    using SafeERC20 for ERC20;

    uint256 public constant MAX_SUPPLY = 21_000_000 * 1e18;

    constructor(address _accessControlSingleton, uint256 _initMint)
        SuAccessControlAuthenticated(_accessControlSingleton)
        ERC20("StableUnit DAO", "SuDAO")
        ERC20Permit("StableUnit DAO")
    {
        _mint(msg.sender, _initMint);
    }

    function mint(address account, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "max supply is exceeded");
        _mint(account, amount);
    }

    /**
     * @notice The owner of the contact can take away tokens accidentally sent to the contract.
     */
    function rescueTokens(ERC20 token) external onlyRole(DEFAULT_ADMIN_ROLE) {
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
    override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
    internal
    override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
