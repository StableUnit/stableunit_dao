// SPDX-License-Identifier: BSL 1.1

pragma solidity >=0.7.6;

import "../interfaces/ISuAccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title SuAuthenticated
 * @dev other contracts should inherit to be authenticated
 */
abstract contract SuAccessControlAuthenticated is ISuAccessControl, Context {
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant DAO_ROLE = 0x00;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant COMMUNITY_ADMIN_ROLE = keccak256("COMMUNITY_ADMIN_ROLE");

    /// @dev the address of SuAccessControlSingleton - it should be one for all contract that inherits SuAuthenticated
    ISuAccessControl public ACCESS_CONTROL_SINGLETON;

    error OnlyRoleError(bytes32 role, address msgSender);

    /// @dev should be passed in constructor
    constructor(address _accessControlSingleton) {
        ACCESS_CONTROL_SINGLETON = ISuAccessControl(_accessControlSingleton);
    }

    modifier onlyRole(bytes32 role) {
        if (!hasRole(role, msg.sender)) revert OnlyRoleError(role, msg.sender);
        _;
    }

    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
        return ACCESS_CONTROL_SINGLETON.hasRole(role, account);
    }

    function getRoleAdmin(bytes32 role) public view virtual returns (bytes32) {
        return ACCESS_CONTROL_SINGLETON.getRoleAdmin(role);
    }


    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return ACCESS_CONTROL_SINGLETON.supportsInterface(interfaceId);
    }
}
