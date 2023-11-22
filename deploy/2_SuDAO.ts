import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {SuAccessControlSingleton, SuDAO, SuDAOv2} from "../typechain";
import deployProxy from "../test/utils/deploy";
import {ethers, upgrades, web3} from "hardhat";
import {checkVanityAddress, fundDeployer, withdrawEther} from "../scripts/utils";

const defaultOptions = {
    log: true,
    waitConfirmations: 1,
    gasLimit: 7_000_000,
    estimatedGasLimit: 7_000_000,
}

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer, admin, vanity1] = await hre.ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    console.log("Deployer network:", network);
    console.log("Deployer:", deployer.address);
    console.log("Vanity1:", vanity1.address);

    const accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
    const suDAOOld = network.name === "unknown"
      ? await deployProxy("SuDAO", [accessControlSingleton.address]) as SuDAO
      : await ethers.getContract("SuDAO") as SuDAO;

    await checkVanityAddress(web3, vanity1.address);
    await fundDeployer(web3, deployer.address, vanity1.address);

    await hre.deployments.deploy("SuDAOv2", {
        ...defaultOptions,
        from: vanity1.address,
        args: [accessControlSingleton.address]
    });
    await withdrawEther(web3, vanity1.address, deployer.address);

    await upgrades.admin.transferProxyAdminOwnership(deployer.address);
};
export default func;
func.tags = ["Deployer", "SuDAO"];
