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
import {ethers, upgrades} from "hardhat";
import {ADDRESS_ZERO} from "../test/utils";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer, admin, vanity1] = await hre.ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    console.log("Deployer network:", network);
    console.log("Deployer:", deployer.address);

    const accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
    const suDAOOld = network.name === "unknown"
      ? await deployProxy("SuDAO", [accessControlSingleton.address]) as SuDAO
      : await ethers.getContract("SuDAO") as SuDAO;
    console.log('access', accessControlSingleton.address);
    console.log("deployer", deployer.address);
    console.log("vanity1", vanity1.address);
    const suDAONew = await deployProxy("SuDAOv2", [accessControlSingleton.address], undefined, true, vanity1) as SuDAOv2;
    console.log('suDAONew', suDAONew.address);
    await upgrades.admin.transferProxyAdminOwnership(deployer.address);
};
export default func;
func.tags = ["Deployer", "SuDAO"];
