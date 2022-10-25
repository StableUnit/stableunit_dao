// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

/**
 * @dev External interface of oz AccessControl and ERC165 detection, need to help to resolve circle dependency.
 */
interface ISuAccessControl {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
