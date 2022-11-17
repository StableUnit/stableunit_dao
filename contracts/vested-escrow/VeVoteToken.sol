// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../access-control/SuAccessControlAuthenticated.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
import "./VotesUpgradable.sol";


abstract contract VeVoteToken is SuAccessControlAuthenticated, VotesUpgradeable, IERC165Upgradeable {
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
    function delegateOnBehalf(address account, address delegatee) public virtual onlyRole(SYSTEM_ROLE) {
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
