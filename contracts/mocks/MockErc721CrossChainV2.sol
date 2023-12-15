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

contract MockErc721CrossChainV2 is UniversalONFT721 {
    string baseURI;
    mapping(address => bool) public hasMinted;
    uint256 private TIME_LIMIT;
    address private backendSigner; // The address corresponding to the private key used by your backend

    constructor(address _layerZeroEndpoint, uint _startMintId, uint _endMintId)
    UniversalONFT721("StableUnit MockErc721CrossChain", "MockErc721CrossChain", 1, _layerZeroEndpoint, _startMintId, _endMintId) {
        baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
        TIME_LIMIT = 10 minutes;
        backendSigner = msg.sender;
    }

    function changeBackendSigner(address newBackendSigner) external onlyOwner {
        backendSigner = newBackendSigner;
    }

    function mint(bytes calldata signature, uint256 timestamp) external payable {
        require(!hasMinted[msg.sender], "You have already minted an NFT on this chain.");
        require(nextMintId <= maxMintId, "UniversalONFT721: max mint limit reached");
        require(block.timestamp <= timestamp + TIME_LIMIT, "Signature is too old.");
        require(block.timestamp >= timestamp, "Signature is from the future.");

        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, timestamp, block.chainid));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("Signed by StableUnit", messageHash)
        );
        require(recoverSigner(ethSignedMessageHash, signature) == backendSigner, "Invalid signature");

        uint newId = nextMintId;
        nextMintId++;

        _safeMint(msg.sender, newId);
        hasMinted[msg.sender] = true;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            // signature is always 65 bytes
            // r = first 32 bytes of signature
            // s = second 32 bytes of signature
            // v = final byte (first byte of the third 32 bytes)
            // add(sig, 32) is pointer to r
            // mload(p) loads next 32 bytes starting at the memory address p into memory
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (r, s, v);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) public {
        baseURI = uri;
    }
}
