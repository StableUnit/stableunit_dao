import { ethers, upgrades, deployments } from "hardhat";
import { DeployProxyOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";

export const deployProxy = async (contractName: string, args?: any[], options?: DeployProxyOptions, needLogs = true) => {
    const contractFactory = await ethers.getContractFactory(contractName);

    const proxyContract = await upgrades.deployProxy(contractFactory, args, options);
    await proxyContract.deployed();

    if (needLogs) {
        console.log(`Contract ${contractName} is deployed with proxy address ${proxyContract.address}`);
    }

    // save proxy address to the artifacts
    const artifact = await deployments.getExtendedArtifact(contractName);
    await deployments.save(contractName, {
        address: proxyContract.address,
        ...artifact,
    });

    return proxyContract;
};

// export const deploy = async (contractName: string, args?: any[], options?: DeployProxyOptions) => {
//     const contractFactory = await ethers.getContractFactory(contractName);
//     const contract = await contractFactory.deploy(args? ...args : undefined , options);
//
//     console.log(`Contract ${contractName} is deployed with address ${contract.address}`);
//
//     // save proxy address to the artifacts
//     const artifact = await deployments.getExtendedArtifact(contractName);
//     await deployments.save(contractName, {
//         address: contract.address,
//         ...artifact,
//     });
//
//     return contract;
// };

export default deployProxy;
