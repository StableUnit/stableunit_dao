// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../interfaces/IBonus.sol";
import "../access-control/SuAccessControlAuthenticated.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC165Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./SuVoteToken.sol";
import "../interfaces/ISuVoteToken.sol";

/**
 * @dev vested escrow NFT contract, allow a beneficiary to extract NFT after a given lock schedule.
 *
 * Useful for simple vesting schedules like "whitelisted addresses get their NFT
 * after 1 year".
 */
// TODO: add interface and description
contract VeERC721Extension is SuVoteToken {
    ERC721 TOKEN;
    IBonus BONUS;
    mapping(uint256 => bool) public isUnlocked;
    mapping(address => bool) public whitelistedTransferableAddresses;

    error TransferError(address from, address to, uint256 tokenId);

    function initialize(address _accessControlSingleton, address _nftToken, address _bonus) public initializer
    {
        __SuVoteToken__init(_accessControlSingleton, string.concat("ve", ERC721(_nftToken).symbol()));
        TOKEN = ERC721(_nftToken);
        BONUS = IBonus(_bonus);
        whitelistedTransferableAddresses[address(0)] = true;
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
            //            _burn(tokenId);
            address account = TOKEN.ownerOf(tokenId);
            _transferVotingUnits(account, address(0), 1);
        }
    }

    function adminUnlock(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
        isUnlocked[tokenId] = true;
        address account = TOKEN.ownerOf(tokenId);
        // burn virtual votable balance
        //        _burn(tokenId);
        _transferVotingUnits(account, address(0), 1);
    }

    // Only contracts that have SYSTEM_ROLE can lock token (like MockErc721Extended).
    function lock(uint256 tokenId) external onlyRole(SYSTEM_ROLE) {
        isUnlocked[tokenId] = false;
        // mint virtual votable balance
        //        _mint(TOKEN.ownerOf(tokenId), tokenId);
        address account = TOKEN.ownerOf(tokenId);
        _transferVotingUnits(address(0), account, 1);
        if (delegates(account) == address(0)) {
            _delegate(account, account);
        }
    }

    /**
     * @dev Returns the balance of `account`.
     */
    function _getVotingUnits(address account) internal view virtual override returns (uint256) {
        return TOKEN.balanceOf(account);
    }

    function supportsInterface(bytes4 interfaceId) public override view returns (bool) {
        return interfaceId == type(ISuVoteToken).interfaceId || super.supportsInterface(interfaceId);
    }
}
