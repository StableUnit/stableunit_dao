// SPDX-License-Identifier: BSL 1.1

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/**
 * @title SuAccessControlModifiers
 * @dev other contracts should inherit to be authenticated
 */
abstract contract SuAccessControlModifiers is AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /**
     * @dev Initialize the contract with initial owner to be deployer
     */
    function __SuAccessControlModifiers_init() public initializer {
        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @dev check DEFAULT_ADMIN_ROLE
    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "SuAuth: onlyOwner AUTH_FAILED");
        _;
    }

    /// @dev check ADMIN_ROLE
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "SuAuth: onlyAdmin AUTH_FAILED");
        _;
    }
}
