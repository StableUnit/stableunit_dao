// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../vested-escrow/SuVoteToken.sol";

contract MockSuVotes is SuVoteToken {
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _owners;

    constructor(address _accessControlSingleton, string memory _name) {
        __SuVoteToken__init(_accessControlSingleton, _name);
    }

    function mint(address account, uint256 voteId) external {
        _balances[account] += 1;
        _owners[voteId] = account;
        _transferVotingUnits(address(0), account, 1);
    }

    function burn(uint256 voteId) external {
        address owner = _owners[voteId];
        _balances[owner] -= 1;
        _transferVotingUnits(owner, address(0), 1);
    }

    // Only for testing purpose
    function delegate(address account, address newDelegation) public {
        return _delegate(account, newDelegation);
    }

    // Only for testing purpose
    function delegate(address delegatee) public virtual override {
        address account = _msgSender();
        _delegate(account, delegatee);
    }

    function _getVotingUnits(address account) internal view virtual override returns (uint256) {
        return _balances[account];
    }
}
