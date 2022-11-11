import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {deployments, ethers, upgrades} from "hardhat";
import { SuAccessControlSingleton } from "../typechain";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer, admin, dao]  = await hre.ethers.getSigners();
    const {chainId} = await hre.ethers.provider.getNetwork()

    const accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;

    await accessControlSingleton.grantRole(await accessControlSingleton.DEFAULT_ADMIN_ROLE(), dao.address);
    await accessControlSingleton.revokeRole(await accessControlSingleton.DEFAULT_ADMIN_ROLE(), deployer.address);
    await upgrades.admin.transferProxyAdminOwnership(dao.address);
};
export default func;
func.tags = ["Deployer"];
