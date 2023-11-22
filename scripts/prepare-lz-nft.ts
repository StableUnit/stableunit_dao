// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, getNamedAccounts } from "hardhat";

import { getIdByNetworkName, NETWORK } from "../utils/network";
import { MockErc721CrossChain } from "../typechain";
import CROSS_CHAIN_MUMBAI from "../submodule-artifacts/mumbai/MockErc721CrossChain.json";
import CROSS_CHAIN_GOERLI from "../submodule-artifacts/goerli/MockErc721CrossChain.json";
import { lzChainId } from "../utils/endpoint";

/** Here we have a script that make all preparations, set all needed data for transfer
 * MockErc721CrossChain between two chains and two users (transfer is in send-lz-nft.ts).
 * It should be called after deploying MockErc721CrossChain.
 * */
async function main() {
    let tx;
    const { deployer } = await getNamedAccounts();
    const deployerSigner = await ethers.getSigner(deployer);

    const network = await ethers.provider.getNetwork();
    console.log("Current network = ", network.name);

    const mockErc721CrossChain = (await ethers.getContract("MockErc721CrossChain")) as MockErc721CrossChain;
    tx = await mockErc721CrossChain.connect(deployerSigner).mint();
    await tx.wait();
    console.log("✅ Mint for deployer success");

    let dstChainId: number;
    let localContractAddress: string;
    let dstContractAddress: string;

    switch (network.chainId) {
        case getIdByNetworkName(NETWORK.goerli): {
            dstChainId = lzChainId[NETWORK.mumbai];
            localContractAddress = CROSS_CHAIN_GOERLI.address;
            dstContractAddress = CROSS_CHAIN_MUMBAI.address;
            break;
        }
        case getIdByNetworkName(NETWORK.mumbai): {
            dstChainId = lzChainId[NETWORK.goerli];
            localContractAddress = CROSS_CHAIN_MUMBAI.address;
            dstContractAddress = CROSS_CHAIN_GOERLI.address;
            break;
        }
        default: {
            dstChainId = 0;
            localContractAddress = "";
            dstContractAddress = "";
        }
    }

    const trustedRemote = ethers.utils.solidityPack(["address", "address"], [dstContractAddress, localContractAddress]);
    tx = await mockErc721CrossChain.setTrustedRemote(dstChainId, trustedRemote);
    await tx.wait();
    console.log("✅ setTrustedRemote success");

    tx = await mockErc721CrossChain.setTrustedRemoteAddress(dstChainId, dstContractAddress);
    await tx.wait();
    console.log("✅ setTrustedRemoteAddress success");

    tx = await mockErc721CrossChain.setUseCustomAdapterParams(true);
    await tx.wait();
    console.log("✅ setUseCustomAdapterParams success");

    tx = await mockErc721CrossChain.setMinDstGas(dstChainId, 1, 500000);
    await tx.wait();
    console.log("✅ setUseCustomAdapterParams success");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
