// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

library SignatureVerification {
    error InvalidSignatureLength();
    error FutureSignature();
    error OldSignature();

    function recoverSigner(address _sender, uint256 _timestamp, bytes memory _signature) internal view returns (address) {
        if (block.timestamp > _timestamp + 10 minutes) revert OldSignature();
        if (block.timestamp < _timestamp) revert FutureSignature();

        bytes32 messageHash = keccak256(abi.encodePacked(_sender, _timestamp, block.chainid));
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("Signed by StableUnit", messageHash)
        );

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        if (sig.length != 65) revert InvalidSignatureLength();
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        return (r, s, v);
    }
}
