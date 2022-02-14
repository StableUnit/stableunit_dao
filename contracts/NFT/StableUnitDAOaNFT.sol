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
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../utils/SuAccessControl.sol";

contract StableUnitDAOaNFT is ERC721, ERC721Enumerable, Pausable, SuAccessControl {
    using Counters for Counters.Counter;

    uint256 public constant BASE_LEVEL = 1000;
    uint256 public constant MAX_LEVEL = 10_000;

    Counters.Counter private _tokenIdCounter;
    mapping(address => bool) public pausedImmune;
    string baseURI;

    constructor() ERC721("StableUnitDAO aNFT", "aNFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        // make it possible to mint and burn tokens even when the contract is paused
        pausedImmune[address(0)] = true;
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

    /**
     * @notice Mints new NTF which id that contains the sequential number in the first bytes and level info from 128 bit
     */
    function mintWithLevel(address to, uint256 level) external onlyRole(MINTER_ROLE) {
        uint256 id = insertLevelToId(_tokenIdCounter.current(), level);
        _safeMint(to, id);
        _tokenIdCounter.increment();
    }

    /**
     * @notice Mint batch of NFTs with levels
     */
    function mintBatchWithLevel(address[] calldata users, uint256[] calldata levels) external onlyRole(MINTER_ROLE) {
        require(users.length > 0, "You need to provide at least one receiver");
        require(users.length == levels.length, "|users| != |levels|");
        for (uint i = 0; i < users.length; i++) {
            uint256 id = insertLevelToId(_tokenIdCounter.current(), levels[i]);
            _safeMint(users[i], id);
            _tokenIdCounter.increment();
        }
    }

    function mint(address to, uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _mint(to, tokenId);
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

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, AccessControl)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
