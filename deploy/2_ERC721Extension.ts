import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, getNamedAccounts, run } from "hardhat";
import { expect } from "chai";
import { getNetworkNameById, NETWORK } from "../utils/network";
import { deploy, getDeploymentAddress } from "../test/utils";
import deployProxy from "../test/utils/deploy";
import { Bonus, MockErc721Extended, SuAccessControlSingleton, VeERC721Extension } from "../typechain-types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer] = await hre.ethers.getSigners();

    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
    const bonus = (await ethers.getContract("Bonus")) as Bonus;

    const veErc721ExtensionAddress = await getDeploymentAddress(deployer.address, 2);
    const mockErc721Extended = (await deploy("MockErc721Extended", [
        "mock cNFT",
        "t_cNFT",
        veErc721ExtensionAddress,
    ])) as MockErc721Extended;
    const veErc721Extension = (await deployProxy("VeERC721Extension", [
        accessControlSingleton.address,
        mockErc721Extended.address,
        bonus.address,
    ])) as VeERC721Extension;
    expect(veErc721ExtensionAddress).to.be.equal(veErc721Extension.address);
    await accessControlSingleton.grantRole(await accessControlSingleton.ADMIN_ROLE(), mockErc721Extended.address);
    console.log("✅ ERC721Extension done");
};
export default func;
func.tags = ["ERC721Extension"];
