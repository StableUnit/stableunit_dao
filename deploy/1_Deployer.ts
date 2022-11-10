import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {upgrades} from "hardhat";
import {Bonus, MockErc721Extended, SuDAO, TokenDistributorV4, VeERC20, VeERC721Extension} from "../typechain";
import deployProxy, {deploy, getDeploymentAddress, getDeploymentProxyAddressPredictor} from "../test/utils/deploy";
import {expect} from "chai";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const DAO_MULTISIG_ADDRESS = "0xdf92E30b3E8Ad232577087E036c1fDc6138bB2e9";
  const ADMIN_ADDRESS = "0xE2661235b116781a7b30D4a675898cF9E61298Df";
  const [deployer, admin, dao]  = await hre.ethers.getSigners();
  const {chainId} = await hre.ethers.provider.getNetwork()
  console.log("Deployer is running on ", chainId);

  // in localhost we don't need to call changeProxyAdmin (error "TransparentUpgradeableProxy: admin cannot fallback to proxy target")
  // but in goerli or mainnet we should call it
    let proxyAdminAddress, defaultAdminRoleAddress, adminRoleAddress;
    if (chainId === 31337) {
        defaultAdminRoleAddress = dao.address;
        adminRoleAddress = admin.address;
    } else {
        proxyAdminAddress = DAO_MULTISIG_ADDRESS;
        defaultAdminRoleAddress = DAO_MULTISIG_ADDRESS;
        adminRoleAddress = ADMIN_ADDRESS;
    }

    const mockErc721 = await deployProxy("MockErc721", ["Mock StableUnit NFT", "t_NFT"]);
    const accessControlSingleton = await deployProxy("SuAccessControlSingleton", [defaultAdminRoleAddress, adminRoleAddress]);
    const suDAO = await deployProxy("SuDAO", [accessControlSingleton.address]) as SuDAO;
    const bonus = await deployProxy("Bonus", [accessControlSingleton.address, adminRoleAddress]) as Bonus;
    // Unix Timestamp	1685577600 = GMT+0 Thu Jun 01 2023 00:00:00 GMT+0000
    const tgeTimestamp = 1685577600;
    const veERC20 = await deployProxy("VeERC20", [accessControlSingleton.address, suDAO.address, tgeTimestamp]) as VeERC20;
    const tokenDistributor = await deployProxy(
        "TokenDistributorV4",
        [accessControlSingleton.address, suDAO.address, veERC20.address, bonus.address]
    ) as TokenDistributorV4;

    const veErc721ExtensionAddress = await getDeploymentAddress(deployer.address,2);
    const mockErc721Extended = await deploy("MockErc721Extended", ["mock cNFT", "t_cNFT", veErc721ExtensionAddress]) as MockErc721Extended;
    const veErc721Extension = await deployProxy("VeERC721Extension", [accessControlSingleton.address, mockErc721Extended.address, bonus.address]) as VeERC721Extension;
    expect(veErc721ExtensionAddress).to.be.equal(veErc721Extension.address);

    if (proxyAdminAddress) {
        await upgrades.admin.transferProxyAdminOwnership(proxyAdminAddress);
    }
};
export default func;
func.tags = ["Deployer"];
