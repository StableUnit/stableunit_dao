// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./INFTExtension.sol";

interface IERC721CommunityBeforeTransferExtension is INFTExtension {
    function beforeTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
