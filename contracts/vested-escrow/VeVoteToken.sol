// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../access-control/SuAccessControlAuthenticated.sol";
import "./VotesUpgradable.sol";
import "../interfaces/ISuVotes.sol";

abstract contract VeVoteToken is SuAccessControlAuthenticated, VotesUpgradeable, ISuVotes {
    function initialize(address _accessControlSingleton) public initializer
    {
        __SuAuthenticated_init(_accessControlSingleton);
    }

    error UnavailableFunctionalityError();

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     */
    function delegate(address) public virtual override {
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
