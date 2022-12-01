// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../access-control/SuAccessControlAuthenticated.sol";
import "@openzeppelin/contracts-upgradeable/governance/utils/VotesUpgradeable.sol";
import "../interfaces/ISuVoteToken.sol";

abstract contract SuVoteToken is SuAccessControlAuthenticated, VotesUpgradeable, ISuVoteToken {
    function __SuVoteToken__init(address _accessControlSingleton) public initializer
    {
        __SuAuthenticated_init(_accessControlSingleton);
        __EIP712_init("SuVoteToken", "1");
    }

    function getTotalSupply() public view returns (uint256) {
        return _getTotalSupply();
    }

    error UnavailableFunctionalityError();

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     */
    function delegate(address) public virtual override(IVotesUpgradeable, VotesUpgradeable) {
        revert UnavailableFunctionalityError();
    }

    /**
     * @dev Delegates votes from the account to `delegatee`.
     */
    function delegateOnBehalf(address account, address delegatee) public virtual override onlyRole(SYSTEM_ROLE) {
        _delegate(account, delegatee);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    override (SuAccessControlAuthenticated, IERC165Upgradeable)
    virtual
    view
    returns (bool) {
        return interfaceId == type(IVotesUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }
}
