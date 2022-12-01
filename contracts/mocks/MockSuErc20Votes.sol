// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "../vested-escrow/SuVoteToken.sol";

contract MockSuErc20Votes is SuVoteToken, ERC20BurnableUpgradeable {
    function initialize(address _accessControlSingleton, string memory _name, string memory _symbol) initializer public {
        __ERC20_init(_name, _symbol);
        __SuVoteToken__init(_accessControlSingleton);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
        _transferVotingUnits(address(0), account, 1);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
        _transferVotingUnits(account, address(0), 1);
    }

    // Only for testing purpose
    function delegate(address account, address newDelegation) public {
        return _delegate(account, newDelegation);
    }

    // Only for testing purpose
    function delegate(address delegatee) public virtual override {
        address account = _msgSender();
        _delegate(account, delegatee);
    }

    function _getVotingUnits(address account) internal view virtual override returns (uint256) {
        return balanceOf(account);
    }
}
