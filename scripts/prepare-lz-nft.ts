// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

import { getNetworkNameById, NetworkType, SUPPORTED_NETWORKS } from "../utils/network";
import CROSS_CHAIN_OPTIMISTIC from "../submodule-artifacts/optimisticEthereum/DAONFT.json";
import CROSS_CHAIN_OPERA from "../submodule-artifacts/opera/DAONFT.json";
import CROSS_CHAIN_ARBITRUM_ONE from "../submodule-artifacts/arbitrumOne/DAONFT.json";
import CROSS_CHAIN_AVALANCHE from "../submodule-artifacts/avalanche/DAONFT.json";
import CROSS_CHAIN_SCROLL from "../submodule-artifacts/scroll/DAONFT.json";

import CROSS_CHAIN_SEPOLIA from "../submodule-artifacts/sepolia/SuDAONFT.json";
import CROSS_CHAIN_OPTIMISTIC_GOERLI from "../submodule-artifacts/optimisticGoerli/SuDAONFT.json";
import CROSS_CHAIN_ARBITRUM_SEPOLIA from "../submodule-artifacts/arbitrumSepolia/SuDAONFT.json";
import { lzChainId } from "../utils/endpoint";
import { SuDAONFT } from "../typechain-types";

const getNFTContractAddress = (networkName: NetworkType) => {
    switch (networkName) {
        case "avalanche":
            return CROSS_CHAIN_AVALANCHE.address;
        case "opera":
            return CROSS_CHAIN_OPERA.address;
        case "optimisticEthereum":
            return CROSS_CHAIN_OPTIMISTIC.address;
        case "arbitrumOne":
            return CROSS_CHAIN_ARBITRUM_ONE.address;
        case "scroll":
            return CROSS_CHAIN_SCROLL.address;

        case "sepolia":
            return CROSS_CHAIN_SEPOLIA.address;
        case "optimisticGoerli":
            return CROSS_CHAIN_OPTIMISTIC_GOERLI.address;
        case "arbitrumSepolia":
            return CROSS_CHAIN_ARBITRUM_SEPOLIA.address;
        default:
            return CROSS_CHAIN_SEPOLIA.address;
    }
};

/** Here we have a script that make all preparations, set all needed data for transfer
 * MockErc721CrossChain between two chains and two users (transfer is in send-lz-nft.ts).
 * It should be called after deploying MockErc721CrossChain.
 * */
async function main() {
    let tx;

    const network = await ethers.provider.getNetwork();
    console.log("Current network = ", network.name, network.chainId);

    const mockErc721CrossChain = (await ethers.getContract("DAONFT")) as SuDAONFT;

    for (let networkToProceed of SUPPORTED_NETWORKS) {
        if (networkToProceed !== getNetworkNameById(network.chainId)) {
            console.log("PROCESSING", networkToProceed);
            const dstChainId = lzChainId[networkToProceed];
            const localContractAddress = mockErc721CrossChain.address;
            const dstContractAddress = getNFTContractAddress(networkToProceed);

            console.log("dstChainId", dstChainId);
            console.log("localContractAddress", localContractAddress);
            console.log("dstContractAddress", dstContractAddress);
            const trustedRemote = ethers.utils.solidityPack(
                ["address", "address"],
                [dstContractAddress, localContractAddress]
            );
            tx = await mockErc721CrossChain.setTrustedRemote(dstChainId, trustedRemote);
            await tx.wait();
            console.log("✅ setTrustedRemote success");

            tx = await mockErc721CrossChain.setTrustedRemoteAddress(dstChainId, dstContractAddress);
            await tx.wait();
            console.log("✅ setTrustedRemoteAddress success");

            tx = await mockErc721CrossChain.setMinDstGas(dstChainId, 1, 500000);
            await tx.wait();
            console.log("✅ setMinDstGas success");
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
