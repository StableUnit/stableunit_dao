import { deployments, run } from "hardhat";

const verify = async (contractName: string, contractPath?: string) => {
  try {
    const Contract = await deployments.get(contractName);

    // hardhat documentation says that we need to use "verify:verify" subtask
    // but it doesn't work with proxy
    await run("verify", {
      address: Contract.address,
      contract: contractPath,
    });

    console.log(`✅ ${contractName} verified`);
  } catch (e: any) {
    console.log(`❌ ${contractName}'s verification failed: ${e.message}`);
  }
};

async function main() {
  await verify("SuDAO");
  await verify("Bonus");
  await verify("veERC20");
  await verify("TokenDistributor_v4");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
