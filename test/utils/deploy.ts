import { ethers, upgrades, deployments } from "hardhat";
import { DeployProxyOptions } from "@openzeppelin/hardhat-upgrades/dist/utils";
import { getContractAddress } from "ethers/lib/utils";
import { Signer } from "ethers";

export const deployProxy = async (
    contractName: string,
    args?: any[],
    options?: DeployProxyOptions,
    needLogs = true,
    signer?: Signer
) => {
    const contractFactoryDefault = await ethers.getContractFactory(contractName);
    const contractFactoryWithSigner = await ethers.getContractFactory(contractName, signer);
    await upgrades.deployImplementation(contractFactoryDefault);
    // await upgrades.deployImplementation(
    //     contractFactoryDefault,
    //     needDelegateCall ? { unsafeAllow: ["delegatecall"] } : undefined
    // );
    // unsafeAllow because of https://github.com/OpenZeppelin/openzeppelin-upgrades/issues/455
    const proxyContract = await upgrades.deployProxy(contractFactoryWithSigner, args, {
        useDeployedImplementation: true,
        ...(options ?? {}),
    });
    await proxyContract.deployed();

    if (needLogs) {
        console.log(`${proxyContract.address} deployed proxy ${contractName}`);
    }

    // save proxy address to the artifacts
    const artifact = await deployments.getExtendedArtifact(contractName);
    await deployments.save(contractName, {
        address: proxyContract.address,
        ...artifact,
    });

    return proxyContract;
};

export const deploy = async (contractName: string, args?: any[], needLogs = true) => {
    const contractFactory = await ethers.getContractFactory(contractName);
    const contract = await contractFactory.deploy(...(args ?? []));

    if (needLogs) {
        console.log(`${contract.address} deployed ${contractName}`);
    }

    // save proxy address to the artifacts
    const artifact = await deployments.getExtendedArtifact(contractName);
    await deployments.save(contractName, {
        address: contract.address,
        ...artifact,
    });

    return contract;
};

export async function getDeploymentAddress(deployer: string, nonceOffset = 0) {
    const transactionCount = await ethers.provider.getTransactionCount(deployer);
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

export default deployProxy;
