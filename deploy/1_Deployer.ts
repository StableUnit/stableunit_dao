import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Bonus, SuDAO, TokenDistributorV4, VeERC20 } from "../typechain";
import deployProxy from "../test/utils/deploy";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const DAO_ADDRESS = "0xE2661235b116781a7b30D4a675898cF9E61298Df";
  const [deployer, dao, admin]  = await hre.ethers.getSigners();
  const {chainId} = await hre.ethers.provider.getNetwork()
  console.log("Deployer is running on ", chainId);

  // in localhost we don't need to call changeProxyAdmin (error "TransparentUpgradeableProxy: admin cannot fallback to proxy target")
  // but in goerli or mainnet we should call it
  const proxyAdminAddress = chainId === 31337 ? undefined : (dao?.address ?? DAO_ADDRESS);

  const mockErc721 = await deployProxy(proxyAdminAddress, "MockErc721", ["Mock StableUnit NFT", "SuNFTPro"]);
  const accessControlSingleton = await deployProxy(proxyAdminAddress, "SuAccessControlSingleton", [dao.address]);
  const suDAO = await deployProxy(proxyAdminAddress, "SuDAO", [accessControlSingleton.address]) as SuDAO;
  const bonus = await deployProxy(proxyAdminAddress, "Bonus", [accessControlSingleton.address]) as Bonus;
  const veERC20 = await deployProxy(proxyAdminAddress, "VeERC20", [accessControlSingleton.address, suDAO.address]) as VeERC20;
  const tokenDistributor = await deployProxy(
    proxyAdminAddress,
    "TokenDistributorV4",
    [accessControlSingleton.address, suDAO.address, veERC20.address, bonus.address]
  ) as TokenDistributorV4;

  if (dao) {
    // distributor should be able to call lockUnderVesting
    await accessControlSingleton.connect(dao).grantRole(await tokenDistributor.ADMIN_ROLE(), tokenDistributor.address);
    await accessControlSingleton.connect(dao).grantRole(await tokenDistributor.ADMIN_ROLE(), admin.address);
  }
};
export default func;
func.tags = ["Deployer"];
