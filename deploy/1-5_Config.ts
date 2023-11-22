import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { SuAccessControlSingleton, SuDAO, SuDAOUpgrader, SuDAOv2, VeERC20v2 } from "../typechain-types";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const suDAOOld = (await ethers.getContract("SuDAO")) as SuDAO;
    const suDAONew = (await ethers.getContract("SuDAOv2")) as SuDAOv2;
    const veERC20 = (await ethers.getContract("VeERC20v2")) as VeERC20v2;
    const suDAOUpgrader = (await ethers.getContract("SuDAOUpgrader")) as SuDAOUpgrader;

    await accessControlSingleton.grantRole(await suDAOUpgrader.ADMIN_ROLE(), suDAOUpgrader.address);
    const suDAOOldSupply = await suDAOOld.totalSupply();
    await suDAONew.mint(suDAOUpgrader.address, suDAOOldSupply.mul(100 * 16).div(21));
    console.log("Config success");
};
export default func;
func.tags = ["Deployer", "Config"];
