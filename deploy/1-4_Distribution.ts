import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import deployProxy from "../test/utils/deploy";
import { Bonus, SuAccessControlSingleton, SuDAOv2, TokenDistributorV4, VeERC20 } from "../typechain-types";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const suDAONew = (await ethers.getContract("SuDAOv2")) as SuDAOv2;
    const veERC20 = (await ethers.getContract("VeERC20")) as VeERC20;
    const bonus = (await ethers.getContract("Bonus")) as Bonus;

    const tokenDistributor = (await deployProxy("TokenDistributorV4", [
        accessControlSingleton.address,
        suDAONew.address,
        veERC20.address,
        bonus.address,
    ])) as TokenDistributorV4;
};
export default func;
func.tags = ["Deployer", "TokenDistributor"];
