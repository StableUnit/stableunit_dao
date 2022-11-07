import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Bonus, SuDAO, TokenDistributorV4, VeERC20 } from "../typechain";
import deployProxy from "../test/utils/deploy";
import {upgrades} from "hardhat";

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

  const mockErc721 = await deployProxy("MockErc721", ["Mock StableUnit NFT", "SuNFTPro"]);
  const accessControlSingleton = await deployProxy("SuAccessControlSingleton", [defaultAdminRoleAddress, adminRoleAddress]);
  const suDAO = await deployProxy("SuDAO", [accessControlSingleton.address]) as SuDAO;
  const bonus = await deployProxy("Bonus", [accessControlSingleton.address, adminRoleAddress]) as Bonus;
  // Unix Timestamp	1685577600 = GMT+0 Thu Jun 01 2023 00:00:00 GMT+0000
  const veERC20 = await deployProxy("VeERC20", [accessControlSingleton.address, suDAO.address, 1685577600]) as VeERC20;
  const tokenDistributor = await deployProxy(
    "TokenDistributorV4",
    [accessControlSingleton.address, suDAO.address, veERC20.address, bonus.address]
  ) as TokenDistributorV4;

  if (proxyAdminAddress) {
    await upgrades.admin.transferProxyAdminOwnership(proxyAdminAddress);
  }

  if (dao) {
    // distributor should be able to call lockUnderVesting
    await accessControlSingleton.connect(dao).grantRole(await tokenDistributor.ADMIN_ROLE(), tokenDistributor.address);
  }
};
export default func;
func.tags = ["Deployer"];
