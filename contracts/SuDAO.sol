// SPDX-License-Identifier: MIT
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
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Governance token for StableUnit Decentralized Autonomous Organisation
 */
contract SuDAO is ERC20, Ownable, ERC20Burnable {
    using SafeERC20 for IERC20;
    uint256 constant MAX_SUPPLY = 21_000_000 * 1e18;

    constructor(uint256 _initMint) ERC20("StableUnit DAO", "SuDAO") {
        _mint(msg.sender, _initMint);
    }

    /// @dev Gas cheaper way to implement subset of oz' AccessControl
    mapping(address => bool) public isMinter;

    modifier onlyMinter() {
        require(isMinter[msg.sender] || (msg.sender == owner()), "caller is not a minter");
        _;
    }

    function setMinter(address _minterAddress, bool _isMinter) public onlyOwner {
        isMinter[_minterAddress] = _isMinter;
    }

    /// @notice Creates `_amount` token to `_to`.
    function mint(address _to, uint256 _amount) public onlyMinter {
        _mint(_to, _amount);
        require(totalSupply() <= MAX_SUPPLY, "max supply is exceeded");
    }

    /**
     * @notice The owner of the contact can take away tokens accidentally sent to the contract.
     */
    function rescueTokens(IERC20 _token, address payable _to, uint256 _balance) external onlyOwner {
        require(_to != address(0), "suDAO: can not send to zero address");

        if (_token == IERC20(address(0))) {
            // for Ether
            uint256 totalBalance = address(this).balance;
            uint256 balance = _balance == 0 ? totalBalance : _balance <= totalBalance ? _balance : totalBalance;
            _to.transfer(balance);
        } else {
            // any other erc20
            uint256 totalBalance = _token.balanceOf(address(this));
            uint256 balance = _balance == 0 ? totalBalance : _balance <= totalBalance ? _balance : totalBalance;
            require(balance > 0, "suDAO: trying to send 0 balance");
            _token.safeTransfer(_to, balance);
        }
    }

    receive() external payable {}
}
