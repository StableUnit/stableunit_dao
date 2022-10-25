import { ethers, upgrades, deployments } from "hardhat";
import { DeployProxyOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";

export const deployProxy = async (contractName: string, args?: any[], options?: DeployProxyOptions) => {
    const contractFactory = await ethers.getContractFactory(contractName);

    const proxyContract = await upgrades.deployProxy(contractFactory, args, options);
    await proxyContract.deployed();

    console.log(`Contract ${contractName} is deployed with proxy address ${proxyContract.address}`);

    // save proxy address to the artifacts
    const artifact = await deployments.getExtendedArtifact(contractName);
    await deployments.save(contractName, {
        address: proxyContract.address,
        ...artifact,
    });

    return proxyContract;
};

export default deployProxy;
