// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
/*
      /$$$$$$            /$$$$$$$   /$$$$$$   /$$$$$$
     /$$__  $$          | $$__  $$ /$$__  $$ /$$__  $$
    | $$  \__/ /$$   /$$| $$  \ $$| $$  \ $$| $$  \ $$
    |  $$$$$$ | $$  | $$| $$  | $$| $$$$$$$$| $$  | $$
     \____  $$| $$  | $$| $$  | $$| $$__  $$| $$  | $$
     /$$  \ $$| $$  | $$| $$  | $$| $$  | $$| $$  | $$
    |  $$$$$$/|  $$$$$$/| $$$$$$$/| $$  | $$|  $$$$$$/
     \______/  \______/ |_______/ |__/  |__/ \______/

*/

import "../dependencies/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../dependencies/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../dependencies/openzeppelin-contracts/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "../dependencies/openzeppelin-contracts/contracts/security/Pausable.sol";
import "../utils/SuAccessControl.sol";

interface IERC721Burnable {
    function burn(uint256 tokenId) external;
}

contract StableUnitDAOvcNFTVotes is ERC721, ERC721Enumerable, ERC721Votes, Pausable, SuAccessControl {

    address public immutable stableUnitDAOvcNFT;

    mapping(address => bool) public pausedImmune;

    string baseURI;

    constructor(address _stableUnitDAOvcNFT) ERC721("StableUnitDAO vcNFT Votes", "vcNFTVotes") EIP712("StableUnitDAO vcNFT Votes", "1"){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        // make it possible to mint and burn tokens even when the contract is paused
        pausedImmune[address(0)] = true;

        stableUnitDAOvcNFT = _stableUnitDAOvcNFT;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = uri;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function setPausedImmune(address _address, bool isImmune) external onlyRole(PAUSER_ROLE) {
        pausedImmune[_address] = isImmune;
    }

    function mint() external {
        uint256 tokenId = ERC721Enumerable(stableUnitDAOvcNFT).tokenOfOwnerByIndex(msg.sender, 0);
        IERC721Burnable(stableUnitDAOvcNFT).burn(tokenId);
        _mint(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        require(!paused() || pausedImmune[from] || pausedImmune[to], "Contract is paused");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
