import { deployments, run } from "hardhat";

export const verify = async (contractName: string, contractPath?: string, constructorArguments?: any[]) => {
    try {
        const Contract = await deployments.get(contractName);

        // hardhat documentation says that we need to use "verify:verify" subtask
        // but it doesn't work with proxy
        // Also, upgradeable contracts don't need any constructorArguments
        await run("verify:verify", {
            address: Contract.address,
            contract: contractPath,
            constructorArguments,
        });

        console.log(`✅ ${contractName} verified`);
    } catch (e: any) {
        console.log(`❌ ${contractName}'s verification failed: ${e.message}`);
    }
};

async function main() {
    // const suAccessControlSingleton = await ethers.getContract("SuAccessControlSingleton");

    // await verify("SuDAOv2", undefined, [suAccessControlSingleton.address]);
    // await verify("VeERC20v2");
    // await verify("SuDAOUpgrader");
    // await verify("SuAccessControlSingleton");
    // await verify("SuDAO");
    // await verify("Bonus");
    // await verify("VeERC20");
    // await verify("TokenDistributorV4");
    // await verify("MockErc721");
    await verify("MockErc721CrossChainV2");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
