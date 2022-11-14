// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/IBonus.sol";
import "../vested-escrow/VeERC721Extension.sol";

contract MockErc721Extended is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string baseURI;
    VeERC721Extension public veCNftExtension;

    error TransferError(address from, address to, uint256 tokenId);

    constructor(string memory _name, string memory _symbol, address _veCNftExtension)
    ERC721(_name, _symbol)
    {
        baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
        veCNftExtension = VeERC721Extension(_veCNftExtension);
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

    function mint(address to) external {
        _mint(to, _tokenIdCounter.current());
        veCNftExtension.lock(_tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override
    view
    {
        if (!veCNftExtension.isTransferPossible(from, to, tokenId)) {
            revert TransferError(from, to, tokenId);
        }
    }
}
