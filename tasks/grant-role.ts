import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";

import { task } from "hardhat/config";
import ROLES from '../scripts/roles';


task("grant-role", "Grants role")
  .addParam("address", "Address of the deployed contract")
  .addParam("role", "Can be one of 'MINTER', 'PAUSER', 'ADMIN'")
  .addParam("account", "The role receiver")
  .setAction(async (taskArgs, hre) => {

    // Get OgStableUnit contract, attach to the deployed address
    const ogStableUnit = await hre.ethers.getContractFactory("StableUnitDAOogNFT");

    const { address: deployedAddress, role, account } = taskArgs;

    // const roleString: Role = role.toString();

    const roleHash = ROLES[role];

    const stableUnit = ogStableUnit.attach(deployedAddress);

    const tx1 = await stableUnit.grantRole(roleHash, account);

    await tx1.wait();

    console.log(`Transaction hash: ${tx1.hash}`);

});

export default {};
