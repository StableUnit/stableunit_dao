import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getNetworkNameById, NETWORK, NetworkType } from "../utils/network";
import { SuAccessControlSingleton, DAONFT } from "../typechain-types";
import { endpoint } from "../utils/endpoint";
import { deployProxy } from "../test/utils";
import { verify } from "../scripts/verifyEtherscan";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const getNetworkNumber = (network: NetworkType) => {
    switch (network) {
        case NETWORK.mainnet:
            return 0;
        case NETWORK.optimisticEthereum:
            return 1;
        case NETWORK.opera:
            return 2;
        case NETWORK.arbitrumOne:
            return 3;
        case NETWORK.avalanche:
            return 4;
        case NETWORK.scroll:
            return 5;
        case NETWORK.arbitrumSepolia:
            return 6;
        case NETWORK.sepolia:
            return 7;
        case NETWORK.optimisticGoerli:
            return 8;
        default:
            return undefined;
    }
};

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    let accessControlSingleton = await ethers.getContractOrNull("SuAccessControlSingleton");
    if (!accessControlSingleton) {
        console.log("Deploying Access Control");

        const [deployer] = await hre.ethers.getSigners();
        accessControlSingleton = await deployProxy("SuAccessControlSingleton", [deployer.address]);
    }

    const network = await ethers.provider.getNetwork();
    const networkName = getNetworkNameById(network.chainId);
    const networkNumber = getNetworkNumber(networkName);
    if (!networkNumber) {
        console.error("Bad network", network.chainId, networkName);
        return;
    }

    const args = [accessControlSingleton.address, endpoint[networkName], networkNumber];
    console.log(args);
    const suDaoNftContract = (await deployProxy("DAONFT", args, {
        unsafeAllow: ["external-library-linking"],
    })) as DAONFT;
    console.log(
        `✅ NFT deployed on chain ${network.name} with networkNumber ${networkNumber} with address ${suDaoNftContract.address}`
    );
    await suDaoNftContract.setBaseURI(
        "https://bafybeiat5zgl7wk2nq52do3pkypemzhxzduiqe36qh77fts6w44ppy3aeu.ipfs.w3s.link/"
    );
    await verify("DAONFT");
    console.log("✅ NFT verified");
};
export default func;
func.tags = ["NFT"];
