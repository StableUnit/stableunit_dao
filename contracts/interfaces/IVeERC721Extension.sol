// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./ISuVoteToken.sol";

interface IVeERC721Extension is ISuVoteToken {

    /* ===================== ERRORS ===================== */

    error TransferError(address from, address to, uint256 tokenId);

    /* ====================== VARS ====================== */

    function isUnlocked (uint256 tokenId) external view returns (bool _isUnlocked);

    function whitelistedTransferableAddresses (address user) external view returns (bool isInWhitelist);

    /* ==================== MUTABLE METHODS ==================== */

    // Unlock transferable token
    function unlock(uint256 tokenId) external;

    // Unlock without check BONUS.isTokenTransferable()
    function adminUnlock(uint256 tokenId) external;

    // Only contracts that have SYSTEM_ROLE can lock token (like MockErc721Extended).
    function lock(uint256 tokenId) external;

    /* ===================== VIEW METHODS ===================== */
    function isTransferPossible(address from, address to, uint256 tokenId) external view returns (bool);
}
