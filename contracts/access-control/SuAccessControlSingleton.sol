// SPDX-License-Identifier: BSL 1.1

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

pragma solidity ^0.8.0;

/**
 * @title SuAccessControl
 * @dev Access control for contracts. SuVaultParameters can be inherited from it.
 */
// TODO: refactor by https://en.wikipedia.org/wiki/Principle_of_least_privilege
contract SuAccessControlSingleton is AccessControlUpgradeable {
    /**
     * @dev Initialize the contract with initial owner to be deployer
     */
    function initialize() public initializer {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
}
