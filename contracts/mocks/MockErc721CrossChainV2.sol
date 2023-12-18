// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/governance/utils/VotesUpgradeable.sol";
import "../3rd-party/layer-zero-labs/contracts-upgradable/token/onft/ERC721/ONFT721Upgradeable.sol";
import "../periphery/contracts/access-control/SuAuthenticated.sol";

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

contract MockErc721CrossChainV2 is SuAuthenticated, ONFT721Upgradeable, VotesUpgradeable {
    string private baseURI;
    mapping(address => bool) public hasMinted;
    uint public nextMintId;
    uint public maxMintId;
    address private backendSigner; // The address corresponding to the private key used by your backend

    error UnavailableFunctionalityError();
    error AlreadyMinted();
    error MaxMintLimit();
    error FutureSignature();
    error OldSignature();
    error InvalidSignature();
    error InvalidSignatureLength();

    function initialize(address _layerZeroEndpoint, uint _startMintId, uint _endMintId) initializer public {
        __ONFT721Upgradeable_init("StableUnit MockErc721CrossChain", "MockErc721CrossChain", 1, _layerZeroEndpoint);
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
        if (block.timestamp > timestamp + 10 minutes) revert OldSignature();
        if (block.timestamp < timestamp) revert FutureSignature();

        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, timestamp, block.chainid));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("Signed by StableUnit", messageHash)
        );

        if(recoverSigner(ethSignedMessageHash, signature) != backendSigner) revert InvalidSignature();

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
        if (sig.length != 65) revert InvalidSignatureLength();

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

    /**
     * @notice Copied from ERC721VotesUpgradeable (not inherited to decrease contract code size)
     * @dev See {ERC721-_afterTokenTransfer}. Adjusts votes when tokens are transferred.
     *
     * Emits a {IVotes-DelegateVotesChanged} event.
     */
    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override {
        _transferVotingUnits(from, to, batchSize);
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Returns the balance of `account`.
     *
     * WARNING: Overriding this function will likely result in incorrect vote tracking.
     */
    function _getVotingUnits(address account) internal view virtual override returns (uint256) {
        return balanceOf(account);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    override (SuAuthenticated, ONFT721Upgradeable)
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
