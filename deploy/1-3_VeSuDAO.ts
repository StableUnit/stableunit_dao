import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import deployProxy from "../test/utils/deploy";
import { SuAccessControlSingleton, SuDAOv2, VeERC20v2 } from "../typechain-types";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer, admin, vanity1, vanity2] = await hre.ethers.getSigners();

    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const suDAONew = (await ethers.getContract("SuDAOv2")) as SuDAOv2;
    await deployProxy("Bonus", [accessControlSingleton.address, admin.address]);
    // Unix Timestamp	1704056400 = GMT+0 Thu Jan 01 2024 00:00:00 GMT+0000
    const tgeTimestamp = 1704056400;

    // await checkVanityAddress(web3, vanity2.address);
    // await fundDeployer(web3, deployer.address, vanity2.address);
    const veERC20 = (await deployProxy(
        "VeERC20v2",
        [accessControlSingleton.address, suDAONew.address, tgeTimestamp],
        undefined,
        true,
        vanity2
    )) as VeERC20v2;
    // await withdrawEther(web3, vanity2.address, deployer.address);

    // await upgrades.admin.transferProxyAdminOwnership(deployer.address);
};
export default func;
func.tags = ["Deployer", "VeSuDAO"];
