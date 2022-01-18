// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../dependencies/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../dependencies/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../dependencies/openzeppelin-contracts/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "../dependencies/openzeppelin-contracts/contracts/utils/Counters.sol";

contract NftVotesMock is ERC721, ERC721Enumerable, ERC721Votes {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string baseURI = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks";

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) EIP712("NftVotesMock", "1") {
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) public {
        baseURI = uri;
    }

    function mint(address to) public {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
