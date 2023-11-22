import { DeployFunction } from "hardhat-deploy/types";
import { ethers, getNamedAccounts, upgrades } from "hardhat";
import { SuAccessControlSingleton } from "../typechain-types";

const func: DeployFunction = async () => {
    const { deployer, dao, admin } = await getNamedAccounts();

    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;

    const DAO_ROLE = await accessControlSingleton.DAO_ROLE();
    const ADMIN_ROLE = await accessControlSingleton.ADMIN_ROLE();

    await accessControlSingleton.grantRole(DAO_ROLE, dao);
    await accessControlSingleton.grantRole(ADMIN_ROLE, admin);
    console.log("Role granted");

    await accessControlSingleton.revokeRole(ADMIN_ROLE, deployer);
    await accessControlSingleton.revokeRole(DAO_ROLE, deployer);
    console.log("Role revoked");
    await upgrades.admin.transferProxyAdminOwnership(dao);
};
export default func;
func.tags = ["TransferOwnership"];
