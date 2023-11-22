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
    const [deployer, admin] = await hre.ethers.getSigners();
    console.log("Deployer network:", await ethers.provider.getNetwork());
    console.log("Deployer:", deployer.address);

    const accessControlSingleton = await deployProxy("SuAccessControlSingleton", [deployer.address, admin.address]) as SuAccessControlSingleton;
};
export default func;
func.tags = ["Deployer", "AccessControl"];
