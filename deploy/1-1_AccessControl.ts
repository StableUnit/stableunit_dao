import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import deployProxy from "../test/utils/deploy";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    console.log("Deployer");
    const [deployer, admin] = await hre.ethers.getSigners();
    console.log("Deployer network:", await ethers.provider.getNetwork());
    console.log("Deployer:", deployer.address);

    await deployProxy("SuAccessControlSingleton", [deployer.address]);
};
export default func;
func.tags = ["Deployer", "AccessControl"];
