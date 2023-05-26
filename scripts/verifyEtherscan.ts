import { deployments, run } from "hardhat";

const verify = async (contractName: string, contractPath?: string) => {
  try {
    const Contract = await deployments.get(contractName);

    // hardhat documentation says that we need to use "verify:verify" subtask
    // but it doesn't work with proxy
    await run("verify:verify", {
      address: Contract.address,
      contract: contractPath,
    });

    console.log(`✅ ${contractName} verified`);
  } catch (e: any) {
    console.log(`❌ ${contractName}'s verification failed: ${e.message}`);
  }
};

async function main() {
  await verify("SuAccessControlSingleton");
  await verify("SuDAOv2");
  await verify("VeERC20v2");
  await verify("SuDAOUpgrader");
  // await verify("SuDAO");
  // await verify("Bonus");
  // await verify("VeERC20");
  // await verify("TokenDistributorV4");
  // await verify("MockErc721");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
