import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import deployProxy from "../test/utils/deploy";
import { ADDRESS_ZERO } from "../contracts/periphery/test/test-utils";
import { SuAccessControlSingleton, SuDAO } from "../typechain-types";

const defaultOptions = {
    log: true,
    waitConfirmations: 1,
};

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer] = await hre.ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const suDAOOld =
        network.name === "unknown"
            ? ((await deployProxy("SuDAO", [accessControlSingleton.address, ADDRESS_ZERO])) as SuDAO)
            : ((await ethers.getContract("SuDAO")) as SuDAO);

    // await checkVanityAddress(web3, vanity1.address);
    // await fundDeployer(web3, deployer.address, vanity1.address);

    await hre.deployments.deploy("SuDAOv2", {
        ...defaultOptions,
        from: deployer.address, // vanity1.address,
        args: [accessControlSingleton.address],
    });
    // await withdrawEther(web3, vanity1.address, deployer.address);

    // await upgrades.admin.transferProxyAdminOwnership(deployer.address);
};
export default func;
func.tags = ["Deployer", "SuDAO"];
