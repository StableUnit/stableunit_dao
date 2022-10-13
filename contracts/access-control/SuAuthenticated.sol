// SPDX-License-Identifier: BSL 1.1

pragma solidity >=0.7.6;

import "../interfaces/ISuAccessControl.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title SuAuthenticated
 * @dev other contracts should inherit to be authenticated
 */
abstract contract SuAuthenticated is Initializable{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant COMMUNITY_ADMIN_ROLE = keccak256("COMMUNITY_ADMIN_ROLE");
    bytes32 private constant DEFAULT_ADMIN_ROLE = 0x00;

    /// @dev should be passed in constructor
    function __SuAuthenticated_init(address _accessControlSingleton) internal onlyInitializing {
        // Do we need SuAccessControlSingleton?
        ACCESS_CONTROL_SINGLETON = ISuAccessControl(_accessControlSingleton);
    }

    /// @dev check DEFAULT_ADMIN_ROLE
    modifier onlyOwner() {
        require(ACCESS_CONTROL_SINGLETON.hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "SuAuth: onlyOwner AUTH_FAILED");
        _;
    }

    /// @dev check ADMIN_ROLE
    modifier onlyAdmin() {
        require(ACCESS_CONTROL_SINGLETON.hasRole(ADMIN_ROLE, msg.sender), "SuAuth: onlyAdmin AUTH_FAILED");
        _;
    }

    /// @dev check COMMUNITY_ADMIN_ROLE
    modifier onlyCommunityAdmin() {
        require(ACCESS_CONTROL_SINGLETON.hasRole(COMMUNITY_ADMIN_ROLE, msg.sender), "SuAuth: onlyCommunityAdmin AUTH_FAILED");
        _;
    }
}
