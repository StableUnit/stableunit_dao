import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";

import { task } from "hardhat/config";


task("transfer-owner", "Assigns new owner and renounces role")
  .addParam("address", "The deployed StableUnit NFT contract address")
  .addParam("owner", "The new owner address")
  .setAction(async (taskArgs, hre) => {

    // Get OgStableUnit contract, attach to the deployed address
    const ogStableUnit = await hre.ethers.getContractFactory("StableUnitDAOogNFT");

    // take deployedAddress and newOwner from taskArgs
    const { address: deployedAddress, owner: newOwner } = taskArgs;

    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    const PAUSE_ROLE= "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";

    const stableUnit = ogStableUnit.attach(deployedAddress);

    const tx1 = await stableUnit.grantRole(DEFAULT_ADMIN_ROLE, newOwner);
    await tx1.wait();
    console.log(`Transaction hash: ${tx1.hash}`);

    const tx2 = await stableUnit.grantRole(MINTER_ROLE, newOwner);
    await tx2.wait();
    console.log(`Transaction hash: ${tx2.hash}`);

    const tx3 = await stableUnit.grantRole(PAUSE_ROLE, newOwner);
    await tx3.wait();
    console.log(`Transaction hash: ${tx3.hash}`);

    console.log("WARNING: You need to renounce role manually, or uncomment following lines vvv");

    // renounce owner role
    // const tx2 = await stableUnit.renounceRole(DEFAULT_ADMIN_ROLE);

    // await tx2.wait();

});

export default {};
