import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, web3 } from "hardhat";

import deployProxy from "../test/utils/deploy";
import { SuAccessControlSingleton, SuDAO, SuDAOUpgrader, SuDAOv2, VeERC20v2 } from "../typechain-types";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const suDAOOld = (await ethers.getContract("SuDAO")) as SuDAO;
    const suDAONew = (await ethers.getContract("SuDAOv2")) as SuDAOv2;
    const veERC20 = (await ethers.getContract("VeERC20v2")) as VeERC20v2;

    // await checkVanityAddress(web3, vanity3.address);
    // await fundDeployer(web3, deployer.address, vanity3.address);
    const suDAOUpgrader = (await deployProxy("SuDAOUpgrader", [
        accessControlSingleton.address,
        suDAOOld.address,
        suDAONew.address,
        veERC20.address,
    ])) as SuDAOUpgrader;
    // await withdrawEther(web3, vanity3.address, deployer.address);

    // await upgrades.admin.transferProxyAdminOwnership(deployer.address);
};
export default func;
func.tags = ["Deployer", "SuDAOUpgrader"];
