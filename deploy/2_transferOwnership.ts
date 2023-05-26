import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {ethers, getNamedAccounts, upgrades} from "hardhat";
import {SuAccessControlSingleton} from "../typechain";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployer, dao } = await getNamedAccounts();

    const accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;

    await accessControlSingleton.grantRole(await accessControlSingleton.DEFAULT_ADMIN_ROLE(), dao);
    await accessControlSingleton.revokeRole(await accessControlSingleton.DEFAULT_ADMIN_ROLE(), deployer);
    await upgrades.admin.transferProxyAdminOwnership(dao);
};
export default func;
func.tags = ["Deployer", "TransferOwnership"];
