// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract TokenVotesMock is ERC20Votes, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals
    )
    ERC20(name, symbol) ERC20Permit("TokenVotesMock") {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }
}
