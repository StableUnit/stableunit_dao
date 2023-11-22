import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {
    Bonus,
    MockErc721Extended,
    SuAccessControlSingleton,
    SuDAO,
    SuDAOv2,
    SuDAOUpgrader,
    VeERC20v2,
    VeERC721Extension, VotingPower
} from "../typechain";
import deployProxy, {deploy, getDeploymentAddress} from "../test/utils/deploy";
import {expect} from "chai";
import {ethers} from "hardhat";
import {ADDRESS_ZERO} from "../test/utils";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer network:", await ethers.provider.getNetwork());
    console.log("Deployer:", deployer.address);

    const accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
    const suDAOOld = await ethers.getContract("SuDAO") as SuDAO;
    const suDAONew = await ethers.getContract("SuDAOv2") as SuDAOv2;
    const veERC20 = await ethers.getContract("VeERC20v2") as VeERC20v2;
    const suDAOUpgrader = await ethers.getContract("SuDAOUpgrader") as SuDAOUpgrader;

    await accessControlSingleton.grantRole(await suDAOUpgrader.ADMIN_ROLE(), suDAOUpgrader.address);
    const suDAOOldSupply = await suDAOOld.totalSupply();
    await suDAONew.mint(suDAOUpgrader.address, suDAOOldSupply.mul(100 * 16).div(21));
    console.log('Config success');
};
export default func;
func.tags = ["Deployer", "Config"];
