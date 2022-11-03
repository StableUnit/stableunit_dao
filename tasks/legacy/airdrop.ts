import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";
import fs from "fs";

import { task } from "hardhat/config";

import ROLES from '../scripts/roles';

task("airdrop", "Assigns new owner and renounces role")
  .addParam("address", "The deployed StableUnit NFT contract address")
  .addParam("filename", "The path for airdrop.csv")
  .setAction(async (taskArgs, hre) => {

    // Get OgStableUnit contract, attach to the deployed address
    const ogStableUnit = await hre.ethers.getContractFactory("StableUnitDAOogNFT");
    const [ deployer ] = await hre.ethers.getSigners();
    
    const { address: deployedAddress, filename: airdropPath } = taskArgs;

    // output the address of the deployed contract and other arguments with labels
    console.log(`Deployed address: ${deployedAddress}`);

    const stableUnit = ogStableUnit.attach(deployedAddress);

    // read airdrop addresses from csv file at airdropPath
    const airdropAddresses = fs.readFileSync(airdropPath, "utf8").split("\n").filter(a => !!a);

    // check if has minter role
    // const hasMinterRole = await stableUnit.hasRole(ROLES.MINTER, deployer.address);

    // console.log(`Has minter role: ${hasMinterRole}`);

    // if (!hasMinterRole) {
    //   console.log(`${deployer.address} does not have minter role. Please run \n\n\thh grant-role --network ${hre.hardhatArguments.network} --address ${deployedAddress} --role MINTER --account ${deployer.address}`);
    //   return;
    // }

    // check if airdropAddresses is less than 30, otherwise print a message that it might fail
    if (airdropAddresses.length > 30) {
      console.error(`Airdrop addresses list is greater than 30. This will fail. Split the file in smaller chunks`);
      return
    }

    // run safeBatchMint to array of addresses
    const tx = await stableUnit.adminMintBatch(airdropAddresses);

    await tx.wait();
    // output the transaction hash
    console.log(`Transaction hash: ${tx.hash}`);

    console.log("Airdrop complete");

  });

export default {};
