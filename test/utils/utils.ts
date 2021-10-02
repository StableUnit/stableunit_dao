import { assert, web3, artifacts } from "hardhat";

const RLP = require('rlp');

export const predictAddress = async (deployerAddress, nonceAdded = 0) => {
    let ownerNonce = (await web3.eth.getTransactionCount(deployerAddress)) + nonceAdded;
    let governorAddress = "0x" + web3.utils.sha3(RLP.encode([deployerAddress, ownerNonce])).slice(12).substring(14)
    return governorAddress;
}

export const UINT256_0 = '0x0000000000000000000000000000000000000000';
export const BN_1E18 = web3.utils.toBN(1e18);
export const EPS = 1e-5;
export const BN_EPS = web3.utils.toBN(1e18 * EPS);


