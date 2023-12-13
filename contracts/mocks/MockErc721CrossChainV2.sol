// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../3rd-party/layer-zero-labs/token/onft/extension/UniversalONFT721.sol";

/**
    Ethereum
    chainId: 101
    endpoint: 0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675

    BNB Chain
    chainId: 102
    endpoint: 0x3c2269811836af69497E5F486A85D7316753cf62

    Polygon
    chainId: 109
    endpoint: 0x3c2269811836af69497E5F486A85D7316753cf62

    Goerli (Ethereum Testnet)
    chainId: 10121
    endpoint: 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23

    BNB Chain (Testnet)
    chainId: 10102
    endpoint: 0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1

    Mumbai (Polygon Testnet)
    chainId: 10109
    endpoint: 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8
*/

contract MockErc721CrossChain is UniversalONFT721 {
    string baseURI;

    constructor(address _layerZeroEndpoint, uint _startMintId, uint _endMintId)
    UniversalONFT721("StableUnit MockErc721CrossChain", "MockErc721CrossChain", 1, _layerZeroEndpoint, _startMintId, _endMintId) {
        baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) public {
        baseURI = uri;
    }
}
