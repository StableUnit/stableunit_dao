// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/IBonus.sol";
import "../3rd-party/layer-zero-labs/token/onft/extension/UniversalONFT721.sol";
import "../3rd-party/buildship-dev/interfaces/IERC721CommunityBeforeTransferExtension.sol";

contract MockCNft is UniversalONFT721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string baseURI;
    IBonus bonus;

    error TransferError();

    constructor(string memory _name, string memory _symbol, IBonus _bonus, address _layerZeroEndpoint)
    UniversalONFT721(_name, _symbol, _layerZeroEndpoint, 0, 100500)
    public {
        baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
        bonus = _bonus;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(baseURI, tokenId));
    }

    function mint(address to) public {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override
    {
        if (!bonus.isTokenTransferable(address(this), from, to, tokenId)) {
            revert TransferError();
        }
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
