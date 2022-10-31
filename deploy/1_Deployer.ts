import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Bonus, SuDAO, TokenDistributorV4, VeERC20 } from "../typechain";
import deployProxy from "../test/utils/deploy";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const deployer  = (await hre.ethers.getSigners())[0];
  console.log("Deployer is running on ", (await hre.ethers.provider.getNetwork()).chainId);

  const mockErc721 = await deployProxy("MockErc721", ["Mock StableUnit NFT", "SuNFTPro"]);
  const accessControlSingleton = await deployProxy("SuAccessControlSingleton");
  const suDAO = await deployProxy("SuDAO", [accessControlSingleton.address, 10000]) as SuDAO;
  const bonus = await deployProxy("Bonus", [accessControlSingleton.address]) as Bonus;
  const veERC20 = await deployProxy("VeERC20", [accessControlSingleton.address, suDAO.address]) as VeERC20;
  const tokenDistributor = await deployProxy(
    "TokenDistributorV4",
    [accessControlSingleton.address, suDAO.address, veERC20.address, bonus.address]
  ) as TokenDistributorV4;

  // set right rights
  await accessControlSingleton.grantRole(await tokenDistributor.ADMIN_ROLE(), deployer.address);
  await accessControlSingleton.grantRole(await tokenDistributor.ADMIN_ROLE(), tokenDistributor.address);
};
export default func;
func.tags = ["Deployer"];
