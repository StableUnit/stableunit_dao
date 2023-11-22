// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/governance/utils/VotesUpgradeable.sol";
import "../interfaces/ISuVoteToken.sol";
import "../periphery/contracts/access-control/SuAuthenticated.sol";

abstract contract SuVoteToken is SuAuthenticated, VotesUpgradeable, ISuVoteToken {
    function __SuVoteToken__init(address _accessControlSingleton, string memory _name) public initializer
    {
        __SuAuthenticated_init(_accessControlSingleton);
        __EIP712_init(_name, "1");
    }

    function getTotalSupply() public view returns (uint256) {
        return _getTotalSupply();
    }

    error UnavailableFunctionalityError();

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     * It's DEPRECATED. Only contracts with SYSTEM_ROLE can call delegateOnBehalf().
     * (like VotingPower that has complex logic to work with SuVoteToken-like tokens)
     */
    function delegate(address) public virtual override(IVotesUpgradeable, VotesUpgradeable) {
        revert UnavailableFunctionalityError();
    }

    /**
     * @dev Delegates votes from the account to `delegatee`.
     */
    function delegateOnBehalf(address account, address delegatee) public virtual override onlyRole(SYSTEM_ROLE) {
        _delegate(account, delegatee);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    override (SuAccessControlAuthenticated, IERC165Upgradeable)
    virtual
    view
    returns (bool) {
        return interfaceId == type(IVotesUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }
}
