import { ethers, upgrades, deployments } from "hardhat";
import { DeployProxyOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";
import {getContractAddress} from "ethers/lib/utils";

export const deployProxy = async (contractName: string, args?: any[], options?: DeployProxyOptions, needLogs = true) => {
    const contractFactory = await ethers.getContractFactory(contractName);

    console.log("deployProxy(", contractName," ,", ...(args??[]), " )");
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

export async function getDeploymentAddress(deployer: string, nonceOffset = 0) {
    let transactionCount = await ethers.provider.getTransactionCount(deployer);
    return getContractAddress({
        from: deployer,
        nonce: transactionCount + nonceOffset,
    });
}

export const getDeploymentProxyAddressPredictor = async (deployer: string) => {
    let transactionCount = await ethers.provider.getTransactionCount(deployer);

    // at the first execution of upgrades.deployProxy() we deploy 3 contracts:
    // - implementation
    // - proxyAdmin
    // - proxy
    // so, we need to increment counter by +2 for getting proxy address(we start from implementation address)

    // afterwards, every execution of upgrades.deployProxy() we deploy 2 contracts:
    // - implementation
    // - proxy
    // we need to increment counter by +2 again every time when we want to get a proxy address

    return () => {
        transactionCount += 2;
        return getContractAddress({
            from: deployer,
            nonce: transactionCount,
        });
    };
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
