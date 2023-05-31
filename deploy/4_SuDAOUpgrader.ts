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
import {ethers, upgrades, web3} from "hardhat";
import {ADDRESS_ZERO} from "../test/utils";
import {checkVanityAddress, fundDeployer, withdrawEther} from "../scripts/utils";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer, admin, vanity1, vanity2, vanity3] = await hre.ethers.getSigners();
    console.log("Deployer network:", await ethers.provider.getNetwork());
    console.log("Deployer:", deployer.address);
    console.log("Vanity3:", vanity3.address);

    const accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
    const suDAOOld = await ethers.getContract("SuDAO") as SuDAO;
    const suDAONew = await ethers.getContract("SuDAOv2") as SuDAOv2;
    const veERC20 = await ethers.getContract("VeERC20v2") as VeERC20v2;

    await checkVanityAddress(web3, vanity3.address);
    await fundDeployer(web3, deployer.address, vanity3.address);
    const suDAOUpgrader = await deployProxy(
        "SuDAOUpgrader",
        [accessControlSingleton.address, suDAOOld.address, suDAONew.address, veERC20.address],
      undefined,
      true,
      vanity3
    ) as SuDAOUpgrader;
    await withdrawEther(web3, vanity3.address, deployer.address);

    await upgrades.admin.transferProxyAdminOwnership(deployer.address);
};
export default func;
func.tags = ["Deployer", "SuDAOUpgrader"];