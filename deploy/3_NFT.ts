import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getNetworkNameById, NETWORK } from "../utils/network";
import { SuAccessControlSingleton } from "../typechain-types";
import { endpoint } from "../utils/endpoint";
import { deployProxy } from "../test/utils";
import { verify } from "../scripts/verifyEtherscan";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const STEP = 10_000;
export const generateRange = (i: number) => [(i - 1) * STEP, i * STEP - 1];

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    let accessControlSingleton = await ethers.getContractOrNull("SuAccessControlSingleton");
    if (!accessControlSingleton) {
        console.log("Deploying Access Control");

        const [deployer] = await hre.ethers.getSigners();
        accessControlSingleton = await deployProxy("SuAccessControlSingleton", [deployer.address]);
    }

    const TOKENS = {
        [NETWORK.mainnet]: { range: generateRange(1) }, // from 0 to 9999
        [NETWORK.optimisticEthereum]: { range: generateRange(2) }, // from 10_000 to 19_999
        [NETWORK.opera]: { range: generateRange(3) },
        [NETWORK.arbitrumOne]: { range: generateRange(4) },
        [NETWORK.avalanche]: { range: generateRange(5) },
        [NETWORK.arbitrumSepolia]: { range: generateRange(6) },
        [NETWORK.sepolia]: { range: generateRange(7) },
        [NETWORK.optimisticGoerli]: { range: generateRange(8) },
    };

    const network = await ethers.provider.getNetwork();
    const networkName = getNetworkNameById(network.chainId);
    console.log("Network", networkName);
    const token = TOKENS[networkName];
    const lzEndpoint = endpoint[networkName];

    const args = [accessControlSingleton.address, lzEndpoint, token.range[0], token.range[1]];
    console.log(args);
    const contract = await deployProxy("MockErc721CrossChainV2", args, { unsafeAllow: ["external-library-linking"] });

    console.log(
        `✅ NFT deployed on chain ${network.name} with range ${token.range[0]}-${token.range[1]} with address ${contract.address}`
    );

    await verify("MockErc721CrossChainV2");
    console.log("✅ NFT verified");
};
export default func;
func.tags = ["NFT"];
