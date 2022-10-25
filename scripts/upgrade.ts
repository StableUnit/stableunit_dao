import {
  ethers,
  upgrades,
} from "hardhat";

const upgrade = async (contractName: string) => {
  const proxyContract = await ethers.getContract(contractName);
  const proxyAddress = proxyContract.address;
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log(`Upgrade proxy contract "${contractName}" with address "${proxyAddress}"`);

  // TODO: check changes in contract

  const contractFactory = await ethers.getContractFactory(contractName);
  const upgraded = await upgrades.upgradeProxy(proxyAddress, contractFactory);
  await upgraded.deployed();

  if (upgraded.address !== proxyAddress) {
    console.error(`Upgraded instance has different address "${upgraded.address}"`);
    return;
  }

  // new implementation deployed only if the contract was changed;
  const newImplementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  if (implementationAddress === newImplementationAddress) {
    console.log(`Implementation address wasn't changed: "${implementationAddress}"`);
  } else {
    console.log(`${contractName} upgraded. ${newImplementationAddress} new implementation address`);
  }
};

async function main() {
  await upgrade("SuAccessControlSingleton");
  await upgrade("SuDAO");
  await upgrade("Bonus");
  await upgrade("VeERC20");
  await upgrade("TokenDistributorV4");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
