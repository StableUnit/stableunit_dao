import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getNetworkNameById, NETWORK, NetworkType } from "../utils/network";
import { SuAccessControlSingleton, StableUnitPassport } from "../typechain-types";
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
    console.log("Deploying Access Control");

    // let accessControlSingleton = await ethers.getContract("SuAccessControlSingleton");
    const accessControlSingleton = await deployProxy("SuAccessControlSingleton", [
        "0xa33ac3F6c76ae645051550F56Aa74F902e1B3510",
    ]);

    const network = await ethers.provider.getNetwork();
    const networkName = getNetworkNameById(network.chainId);
    const networkNumber = getNetworkNumber(networkName);
    if (!networkNumber) {
        console.error("Bad network", network.chainId, networkName);
        return;
    }

    const args = [accessControlSingleton.address, endpoint[networkName], networkNumber];
    console.log(args);
    const suDaoNftContract = (await deployProxy("StableUnitPassport", args, {
        unsafeAllow: ["external-library-linking"],
    })) as StableUnitPassport;
    console.log(
        `✅ NFT deployed on chain ${network.name} with networkNumber ${networkNumber} with address ${suDaoNftContract.address}`
    );
    await suDaoNftContract.setBaseURI(
        "https://bafybeicuc4jc7gv4bkid2mu7kc2ymqngrioegumbjffiasencckjvdhlcy.ipfs.w3s.link/"
    );
    console.log("✅ setBaseURI done");
    await suDaoNftContract.changeBackendSigner("0x2b8DC2cc8D545Bc9E5a2015c8eCfC5dc74316477");
    console.log("✅ changeBackendSigner done");
    await verify("StableUnitPassport");
    console.log("✅ NFT verified");
};
export default func;
func.tags = ["NFT"];
