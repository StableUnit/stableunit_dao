// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

/**
 * @dev External interface of AccessControl declared to support ERC165 detection.
 */
interface ISuAccessControl {
    function hasRole(bytes32 role, address account) external view returns (bool);
    function getRoleAdmin(bytes32 role) external view returns (bytes32);
    function grantRole(bytes32 role, address account) external;
    function revokeRole(bytes32 role, address account) external;
    function renounceRole(bytes32 role, address account) external;

    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    // TODO: remove legacy functionality
    function setVault(address _vault, bool _isVault) external;
    function setCdpManager(address _cdpManager, bool _isCdpManager) external;
    function setDAO(address _dao, bool _isDAO) external;
    function setManagerParameters(address _address, bool _permit) external;
    function transferOwnership(address newOwner) external;
}
