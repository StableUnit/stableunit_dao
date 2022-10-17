// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IVestingNft {
    /**
     * @notice Info of each user (beneficiary of token after they are released)
     * `nft` ERC721 basic token smart contract
     * `tokenId` ERC721 basic token ID of contract being held
     * `releaseTime` Timestamp when token release is enabled. It is specified as a Unix timestamp (in seconds)
    **/
    struct UserInfo {
        IERC721 nft;
        uint256 tokenId;
        uint256 releaseTimestamp;
    }

    /**
     * @dev Returns the NFT that this Timelock Contract holds.
     */
    function nft(address user) external view returns (IERC721);

    /**
     * @dev Returns the token ID of the NFT being held.
     * Returns undefined if the contract is not holding an NFT.
     */
    function tokenId(address user) external view returns (uint256);

    /**
     * @dev Returns the time when the NFT are released in seconds since Unix epoch (i.e. Unix timestamp).
     */
    function releaseTimestamp(address user) external view returns (uint256);

    /**
     * @dev Returns all user info
     */
    function getUserInfo(address user) external view returns (UserInfo memory);

    /**
     * @dev Add a timelock instance that is able to hold the token specified, and will only release it to
     * `beneficiary` when {release} is invoked after `releaseTime`. The cliff period is specified as a Unix timestamp
     * (in seconds).
     * Also you should transfer nft to that contract to be able to transfer it in release().
     * `nft` ERC721 basic token smart contract
     * `tokenId` ERC721 basic token ID of contract being held
     * `beneficiary` Beneficiary of token after they are released
     * `releaseTime` Timestamp when token release is enabled
    **/
    function addNft(IERC721 nft, uint256 tokenId, address beneficiary, uint256 releaseTime) external;

    /**
     * @dev Transfers NFT held by the timelock to the beneficiary.
     * Will only succeed if invoked after the release time.
     * Reverts if transfer of NFT fails.
     */
    function release(address user) external;
}
