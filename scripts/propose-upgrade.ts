import { defender, upgrades, ethers } from "hardhat";

const upgrade = async (contractName: string) => {
  const proxyContract = await ethers.getContract(contractName);
  const proxyAddress = proxyContract.address;
  console.log(`Creating proposal to upgrade proxy contract "${contractName}" with address "${proxyAddress}"`);

  const contractFactory = await ethers.getContractFactory(contractName);
  // In case of "deployment at 0x... address is not registered" error (to update goerli.json)
  // await upgrades.forceImport(proxyAddress, contractFactory);
  // console.log("forceImport success");
  const proposal = await defender.proposeUpgrade(proxyAddress, contractFactory);
  console.log("Upgrade proposal created at:", proposal.url);
};

async function main() {
  await upgrade("TokenDistributorV4");
  await upgrade("SuAccessControlSingleton");
  await upgrade("SuDAO");
  await upgrade("Bonus");
  await upgrade("VeERC20");
  await upgrade("MockErc721");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
