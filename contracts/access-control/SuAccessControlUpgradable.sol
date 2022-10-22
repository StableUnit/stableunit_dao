// SPDX-License-Identifier: BSL 1.1

pragma solidity >=0.7.6;

import "../interfaces/ISuAccessControl.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";

/**
 * @title SuAuthenticated
 * @dev other contracts should inherit to be authenticated
 */
abstract contract SuAccessControlUpgradable is IAccessControlUpgradeable, IERC165Upgradeable, Initializable {
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant DAO_ROLE = 0x00;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant COMMUNITY_ADMIN_ROLE = keccak256("COMMUNITY_ADMIN_ROLE");

    /// @dev the address of SuAccessControlSingleton - it should be one for all contract that inherits SuAuthenticated
    IAccessControlUpgradeable public ACCESS_CONTROL_SINGLETON;

    error OnlyRoleError(bytes32 role, address msgSender);

    /// @dev should be passed in constructor
    function __SuAuthenticated_init(address _accessControlSingleton) internal onlyInitializing {
        ACCESS_CONTROL_SINGLETON = IAccessControlUpgradeable(_accessControlSingleton);
    }

    modifier onlyRole(bytes32 role) {
        if (!hasRole(role, msg.sender)) revert OnlyRoleError(role, msg.sender);
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControlUpgradeable).interfaceId;
    }

    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        return ACCESS_CONTROL_SINGLETON.hasRole(role, account);
    }

    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
        return ACCESS_CONTROL_SINGLETON.getRoleAdmin(role);
    }

    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        ACCESS_CONTROL_SINGLETON.grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        ACCESS_CONTROL_SINGLETON.revokeRole(role, account);
    }

    function renounceRole(bytes32 role, address account) public virtual override {
       ACCESS_CONTROL_SINGLETON.renounceRole(role, account);
    }

    //============================interfaces sugar============================
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

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
