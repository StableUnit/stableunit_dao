// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../interfaces/IBonus.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @dev vested escrow NFT contract, allow a beneficiary to extract NFT after a given lock schdule.
 *
 * Useful for simple vesting schedules like "whitelisted addresses get their NFT
 * after 1 year".
 */

contract VeERC721Extension is ERC721Votes {
    ERC721 immutable TOKEN;
    IBonus immutable BONUS;
    mapping(uint256 => bool) isUnlocked;
    mapping(address => bool) whitelistedTransferableAddresses;

    error TransferError();

    constructor(ERC721 _nftToken, IBonus _bonus)
    ERC721(string.concat("vested escrow ", _nftToken.name()), string.concat("ve", _nftToken.symbol()))
    EIP712(string.concat("vested escrow ", _nftToken.name()), "1")
    public {
        TOKEN = ERC721(_nftToken);
        BONUS = IBonus(_bonus);
    }

    function isTransferPossible(address from, address to, uint256 tokenId) external view returns (bool) {
        if (isUnlocked[tokenId] || whitelistedTransferableAddresses[from] || whitelistedTransferableAddresses[to]) {
            return true;
        }
        return false;
    }

    function unlock(uint256 tokenId) external {
        if (BONUS.isTokenTransferable(address(this), tokenId)) {
            isUnlocked[tokenId] = true;
            // burn virtual votable balance
            _burn(tokenId);
        }
    }

    function lock(uint256 tokenId) external {
        // mint virtual votable balance
        _mint(TOKEN.ownerOf(tokenId), tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        revert TransferError();
    }
}
