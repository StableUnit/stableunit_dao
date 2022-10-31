import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Bonus, SuDAO, TokenDistributorV4, VeERC20Upgradable } from "../typechain";
import deployProxy from "../test/utils/deploy";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const deployer  = (await hre.ethers.getSigners())[0];
  console.log("Deployer is running on ", (await hre.ethers.provider.getNetwork()).chainId);

  const deployOptions = {
    from: deployer.address,
    log: true,
    waitConfirmations: 1,
  };

  // upgradable
  // const mockErc721 = await deployProxy("MockErc721", ["Mock StableUnit NFT", "SuNFTPro"]);
  const accessControlSingletonUpgradable = await deployProxy("SuAccessControlSingletonUpgradable");
  const suDAOUpgradable = await deployProxy("SuDAOUpgradable", [accessControlSingletonUpgradable.address, 10000]) as SuDAO;
  // const bonusUpgradable = await deployProxy("Bonus", [accessControlSingletonUpgradable.address]) as Bonus;
  const veERC20Upgradable = await deployProxy("VeERC20Upgradable", [accessControlSingletonUpgradable.address, suDAOUpgradable.address]) as VeERC20Upgradable;
  // const tokenDistributor = await deployProxy(
  //   "TokenDistributorV4",
  //   [accessControlSingletonUpgradable.address, suDAOUpgradable.address, veERC20Upgradable.address, bonusUpgradable.address]
  // ) as TokenDistributorV4;

  // non upgradable
  const accessControlSingleton = await hre.deployments.deploy("SuAccessControlSingleton", {...deployOptions});
  const suDAO = await hre.deployments.deploy("SuDAO", {...deployOptions, args: [accessControlSingleton.address, 10000]});
  const veERC20 = await hre.deployments.deploy("VeERC20", {...deployOptions, args: [accessControlSingleton.address, suDAO.address]});

  // set right rights
  // await accessControlSingletonUpgradable.grantRole(await tokenDistributor.ADMIN_ROLE(), deployer.address);
  // await accessControlSingleton.grantRole(await tokenDistributor.ADMIN_ROLE(), deployer.address);
};
export default func;
func.tags = ["Deployer"];
