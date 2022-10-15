// SPDX-License-Identifier: BSL 1.1

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./SuAuthenticated.sol";

pragma solidity ^0.8.0;

/**
 * @title SuAccessControl
 * @dev Access control for contracts. SuVaultParameters can be inherited from it.
 */
// TODO: refactor by https://en.wikipedia.org/wiki/Principle_of_least_privilege
contract SuAccessControlSingleton is AccessControlUpgradeable, SuAuthenticated {
    /**
     * @dev Initialize the contract with initial owner to be deployer
     */
    function initialize() public initializer {
        __AccessControl_init();
        __SuAuthenticated_init(address(this));
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
    * @dev Transfers ownership of the contract to a new account (`newOwner`).
    * Can only be called by the current owner.
    */
    function transferOwnership(address newOwner) external {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Ownable: caller is not the owner");

        if (hasRole(ADMIN_ROLE, msg.sender)) {
            grantRole(ADMIN_ROLE, newOwner);
            revokeRole(ADMIN_ROLE, msg.sender);
        }

        if (hasRole(COMMUNITY_ADMIN_ROLE, msg.sender)) {
            grantRole(COMMUNITY_ADMIN_ROLE, newOwner);
            revokeRole(COMMUNITY_ADMIN_ROLE, msg.sender);
        }

        grantRole(DEFAULT_ADMIN_ROLE, newOwner);
        revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
