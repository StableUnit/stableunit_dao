// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "../3rd-party/layer-zero-labs/contracts-upgradable/lzApp/NonblockingLzAppUpgradeable.sol";

/*
    @notice This contract is for bi-directional cross-chain between Mumbai and Goerli
    LayerZero Mumbai
      lzChainId: 10109
      lzEndpoint: 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8
    LayerZero Goerli
      lzChainId: 10121
      lzEndpoint: 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23
*/

abstract contract CrossChainToken is NonblockingLzAppUpgradeable, ERC20BurnableUpgradeable {
    uint16 public destChainId;

    /**
     * @dev To see testnet endpoints and chain ids:
     * https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses
     * And docs for mainnet:
     * https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids
    **/
    function __CrossChainToken_init(
        string memory name_,
        string memory symbol_,
        address _lzEndpoint
    ) internal onlyInitializing {
        // if Source is Mumbai then Destination Chain is Goerli
        if (_lzEndpoint == 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8) destChainId = 10121;
        // if Source is Goerli then Destination Chain is Mumbai
        if (_lzEndpoint == 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23) destChainId = 10109;
        __ERC20_init(name_, symbol_);
        __NonblockingLzAppUpgradeable_init(_lzEndpoint);
    }

    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal override {
        (address toAddress, uint amount) = abi.decode(_payload, (address,uint));
        _mint(toAddress, amount);
    }

    function bridge(uint _amount) public payable {
        _burn(msg.sender, _amount);
        bytes memory payload = abi.encode(msg.sender, _amount);
        _lzSend(destChainId, payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    function trustAddress(address _otherContract) public onlyOwner {
        trustedRemoteLookup[destChainId] = abi.encodePacked(_otherContract, address(this));
    }
}