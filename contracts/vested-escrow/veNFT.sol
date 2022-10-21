// SPDX-License-Identifier: MIT
// In base of OpenZeppelin Contract: token/ERC20/utils/TokenTimelock.sol

pragma solidity ^0.8.9;

import "../interfaces/IVestingNft.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev vested escrow NFT contract, allow a beneficiary to extract NFT after a given lock schdule.
 *
 * Useful for simple vesting schedules like "whitelisted addresses get their NFT
 * after 1 year".
 */
 // TODO: make contract look like ERC721 token but without ability to tranfer tokens etc
 // TODO: delegate on behalf
contract veNFT is IVestingNft, IERC721 {
    constructor() {

    }
    // TODO: rename type to Erc721Info
    mapping(address => UserInfo[]) public userInfo;

    // TODO: implement IERC721 interface, see oz.ERC721 implementation
    // function balanceOf(address owner) external view returns (uint256 balance);
    // function ownerOf(uint256 tokenId) external view returns (address owner);

    function lockNFT(
        IERC721 _nft,
        uint256 _tokenId,
        address _beneficiary,
        uint256 _releaseTimestamp
    ) public override {
        require(
            _releaseTimestamp > block.timestamp,
            "VestingNft: releaseTimestamp has to be in the future"
        );
        require(
            userInfo[_beneficiary].releaseTimestamp == 0,
            "VestingNft: user already have nft"
        );

        userInfo[_beneficiary].nft = _nft;
        userInfo[_beneficiary].tokenId = _tokenId;
        userInfo[_beneficiary].releaseTimestamp = _releaseTimestamp;
    }

    function nft(address user) public view virtual override returns (IERC721) {
        return userInfo[user].nft;
    }

    function tokenId(address user) public view virtual override returns (uint256) {
        return userInfo[user].tokenId;
    }

    function releaseTimestamp(address user) public view virtual override returns (uint256) {
        return userInfo[user].releaseTimestamp;
    }

    function getUserInfo(address user) public view virtual override returns (UserInfo memory) {
        return userInfo[user];
    }

    function release(address user) public virtual override {
        IERC721 _nft = userInfo[user].nft;
        uint256 _tokenId = userInfo[user].tokenId;
        uint256 _releaseTimestamp = userInfo[user].releaseTimestamp;

        // Check if current time is after release time
        require(
            block.timestamp >= _releaseTimestamp,
            "VestingNft: current time is before release time"
        );

        // Check if contract have the NFT to release
        require(
            _nft.ownerOf(_tokenId) == address(this),
            "VestingNft: no NFT to release"
        );

        // Transfer NFT to beneficiary
        _nft.safeTransferFrom(address(this), user, _tokenId);

        // Check if beneficiary has received NFT, if not, revert
        require(
            _nft.ownerOf(_tokenId) != address(this),
            "VestingNft: NFT still owned by this contract"
        );

        // Remove nft for user to be able to add another nft for him
        delete userInfo[user];
    }
    ///===================erc721-like interfacee=======================
}
