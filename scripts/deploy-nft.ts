// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";

import ROLES from './roles';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // deploy OgStableUnit contract
  const OgStableUnit = await hre.ethers.getContractFactory("StableUnitDAOogNFT");

  const ogStableUnit = await OgStableUnit.deploy();

  console.log("Deployment success!\nOgStableUnit address:", ogStableUnit.address);

  if (!hre.hardhatArguments.network) { return }

  console.log("Waiting for etherscan to catch up for 3 confirmations")

  // wait for the contract to be mined with 3 confirmations
  await ogStableUnit.deployTransaction.wait(3); // confirmations

  await hre.run("verify:verify", {
    address: ogStableUnit.address,
    constructorArguments: [],
  });

  // output message that verification is successful
  console.log("Verification successful!");

  // pause the contract, to prevent transfers
  console.log("Pausing contract to prevent transfers...")
  const tx3 = await ogStableUnit.pause();

  await tx3.wait();

  console.log("Contract paused")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
