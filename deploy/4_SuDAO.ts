import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getIdByNetworkName, SUPPORTED_NETWORKS } from "../utils/network";
import deployProxy from "../test/utils/deploy";
import { endpoint } from "../utils/endpoint";
import { verify } from "../scripts/verifyEtherscan";
import { SuAccessControlSingleton, SuDAO } from "../typechain-types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer, admin] = await hre.ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log(`deployer: ${deployer.address}, chain: ${network.name}`);

    let accessControlSingleton = (await ethers.getContractOrNull(
        "SuAccessControlSingleton"
    )) as SuAccessControlSingleton;
    if (!accessControlSingleton) {
        console.log("SuAccessControlSingleton not found, deploying...");
        accessControlSingleton = (await deployProxy("SuAccessControlSingleton", [
            deployer.address,
        ])) as SuAccessControlSingleton;
    }

    let lzEndpoint;
    SUPPORTED_NETWORKS.forEach((supportedNetwork) => {
        if (network.chainId === getIdByNetworkName(supportedNetwork)) {
            lzEndpoint = endpoint[supportedNetwork];
        }
    });
    if (!lzEndpoint) {
        console.error("Bad network for lzEndpoint");
    }
    console.log(`lzEndpoint: ${lzEndpoint}`);
    const args = [accessControlSingleton.address, lzEndpoint];
    const suDAO = (await deployProxy("SomeTokenDAO", args)) as SuDAO;
    console.log(`✅ SuDAO deployed on chain ${network.name} with address ${suDAO.address}`);

    await verify("SomeTokenDAO");
};
export default func;
func.tags = ["SuDAO"];
