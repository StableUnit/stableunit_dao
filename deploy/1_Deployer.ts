/* eslint-disable max-len */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";
import { SuDAO } from "../typechain";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { save, getExtendedArtifact } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const deployOptions = {
    from: deployer,
    log: true,
    waitConfirmations: 1,
  };

  const deployProxy = async (
    contractName: string,
    args?: any[],
  ) => {
    const contractFactory = await ethers.getContractFactory(contractName);

    const proxyContract = await upgrades.deployProxy(contractFactory, args);
    await proxyContract.deployed();

    console.log(`Contract ${contractName} is deployed with proxy address ${proxyContract.address}`);

    // save proxy address to the artifacts
    const artifact = await getExtendedArtifact(contractName);
    await save(contractName, {
      address: proxyContract.address,
      ...artifact,
    });

    return proxyContract.address;
  };

  const bonusAddress = await deployProxy("Bonus");

  const suDAO = await hre.deployments.deploy("SuDAO", {...deployOptions, args: [10000]});

  const veERC20Address = await deployProxy("veERC20", [suDAO.address]);
  await deployProxy("TokenDistributor_v4", [suDAO.address, veERC20Address, bonusAddress]);
};
export default func;
func.tags = ["Deployer"];
