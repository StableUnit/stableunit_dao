// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721VotesUpgradeable.sol";
import "../3rd-party/layer-zero-labs/contracts-upgradable/token/onft/ERC721/ONFT721Upgradeable.sol";
import "../periphery/contracts/access-control/SuAuthenticated.sol";
import "./SignatureVerification.sol";

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

contract MockErc721CrossChainV2 is SuAuthenticated, ONFT721Upgradeable, ERC721VotesUpgradeable {
    mapping(address => bool) public hasMinted;
    string private baseURI;
    uint public nextMintId;
    uint public maxMintId;
    address private backendSigner; // The address corresponding to the private key used by your backend

    error UnavailableFunctionalityError();
    error AlreadyMinted();
    error MaxMintLimit();
    error InvalidSignature();

    function initialize(address _accessControlSingleton, address _layerZeroEndpoint, uint _startMintId, uint _endMintId) initializer public {
        __ONFT721Upgradeable_init("StableUnit MockErc721CrossChain", "MockErc721CrossChain", 1, _layerZeroEndpoint);
        __suAuthenticatedInit(_accessControlSingleton);

        baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
        backendSigner = msg.sender;
        nextMintId = _startMintId;
        maxMintId = _endMintId;
    }

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     * It's DEPRECATED. Only contracts with SYSTEM_ROLE can call delegateOnBehalf().
     * (like VotingPower that has complex logic to work with SuVoteToken-like tokens)
     */
    function delegate(address) public virtual override {
        revert UnavailableFunctionalityError();
    }

    /**
     * @dev Delegates votes from the account to `delegatee`.
     */
    function delegateOnBehalf(address account, address delegatee) public virtual onlyRole(SYSTEM_ROLE) {
        _delegate(account, delegatee);
    }

    function changeBackendSigner(address newBackendSigner) external onlyAdmin {
        backendSigner = newBackendSigner;
    }

    function mint(bytes calldata signature, uint256 timestamp) external payable {
        if (hasMinted[msg.sender]) revert AlreadyMinted();
        if (nextMintId > maxMintId) revert MaxMintLimit();

        address recoveredSigner = SignatureVerification.recoverSigner(msg.sender, timestamp, signature);
        if(recoveredSigner != backendSigner) revert InvalidSignature();

        uint newId = nextMintId;
        nextMintId++;

        _safeMint(msg.sender, newId);
        hasMinted[msg.sender] = true;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) public {
        baseURI = uri;
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
    internal
    override(ERC721Upgradeable, ERC721VotesUpgradeable) {
        ERC721VotesUpgradeable._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    override (ERC721Upgradeable, ONFT721Upgradeable, SuAuthenticated)
    virtual
    view
    returns (bool) {
        return interfaceId == type(IVotesUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
