// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./access-control/SuAccessControlAuthenticated.sol";
import "./cross-chain/CrossChainToken.sol";

/**
 * @title Governance token
 */
contract SomeTokenDAO is ERC20VotesUpgradeable, SuAccessControlAuthenticated, CrossChainToken {
    using SafeERC20Upgradeable for ERC20Upgradeable;

    uint256 public constant MAX_SUPPLY = 21_000_000 * 1e18;

    // Check _lzEndpoint in cross-chain/CrossChainToken.sol comments
    function initialize(address _accessControlSingleton, address _lzEndpoint) initializer public {
        __SuAuthenticated_init(_accessControlSingleton);
        // TODO: rename
        __CrossChainToken_init("SomeToken DAO", "SomeTokenDAO", _lzEndpoint);
    }

    function mint(address account, uint256 amount) external onlyRole(DAO_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "max supply is exceeded");
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
