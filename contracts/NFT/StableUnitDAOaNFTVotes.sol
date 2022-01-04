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

contract StableUnitDAOaNFTVotes is ERC721, ERC721Enumerable, ERC721Votes, Pausable, SuAccessControl {
    uint256 public constant BASE_LEVEL = 1000;
    uint256 public constant MAX_LEVEL = 10_000;
    address public immutable stableUnitDAOaNFT;

    mapping(address => bool) public pausedImmune;
    string baseURI;

    constructor(address _stableUnitDAOaNFT) ERC721("StableUnitDAO aNFT Votes", "aNFTVotes") EIP712("StableUnitDAO aNFT Votes", "1"){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        // make it possible to mint and burn tokens even when the contract is paused
        pausedImmune[address(0)] = true;

        stableUnitDAOaNFT = _stableUnitDAOaNFT;
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

    /**
     * @notice Adds/removes address which would be immutable for the transfer pause
     * @dev Useful for bridges and certain farming contracts
     */
    function setPausedImmune(address _address, bool isImmune) external onlyRole(PAUSER_ROLE) {
        pausedImmune[_address] = isImmune;
    }

    function insertLevelToId(uint256 id, uint256 level) public pure returns (uint256) {
        require(BASE_LEVEL <= level && level <= MAX_LEVEL, "invalid level");
        return id | (level << 128);
    }

    function extractLevelFromId(uint256 id) public pure returns (uint256) {
        return uint256((id >> 128) & ((1 << 16) - 1));
    }

    function getLevel(address user) external view returns (uint256) {
        require(balanceOf(user) > 0, "no aNFT");
        require(balanceOf(user) == 1, " multiple aNFT found");
        uint256 id = tokenOfOwnerByIndex(user, 0);
        return extractLevelFromId(id);
    }

    function mint() external {
        uint256 tokenId = ERC721Enumerable(stableUnitDAOaNFT).tokenOfOwnerByIndex(msg.sender, 0);
        IERC721Burnable(stableUnitDAOaNFT).burn(tokenId);
        _mint(msg.sender, tokenId);
    }

    function burn(uint256 tokenId) external virtual {
        require(_isApprovedOrOwner(_msgSender(), tokenId) || hasRole(MINTER_ROLE, msg.sender),
            "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
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
