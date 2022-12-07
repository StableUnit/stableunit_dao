import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";
import fs from "fs";

import { task } from "hardhat/config";

import ROLES from "../scripts/roles";

/**
 * launch with the  command:
 * npx hardhat ogDistribution --address 0xfffffffff615bee8d0c7d329ebe0d444ab46ee5a --filename ./misc/ogNftAirdrop.txt --network rinkeby --verbose
 */

task("ogDistribution", "Assigns new owner and renounces role")
    .addParam("address", "The deployed StableUnit NFT contract address")
    .addParam("filename", "The path for airdrop.csv")
    .setAction(async (taskArgs, hre) => {
        // Get OgStableUnit contract, attach to the deployed address
        const ogStableUnit = await hre.ethers.getContractFactory("StableUnitDAOogNFT");
        const [deployer] = await hre.ethers.getSigners();

        const { address: deployedAddress, filename: airdropPath } = taskArgs;

        const ogNftInstance = ogStableUnit.attach(deployedAddress);
        // read airdrop addresses from csv file at airdropPath
        const airdropAddresses = fs
            .readFileSync(airdropPath, "utf8")
            .split("\n")
            .filter((a) => !!a);

        // check if has minter role
        const hasMinterRole = await ogNftInstance.hasRole(ROLES.MINTER, deployer.address);
        console.log(`Has minter role: ${hasMinterRole}`);

        if (!hasMinterRole) {
            console.log(
                `${deployer.address} does not have minter role. Please run \n\n\thh grant-role --network ${hre.hardhatArguments.network} --address ${deployedAddress} --role MINTER --account ${deployer.address}`
            );
            return;
        }

        let waitList: string[] = [];
        const sendToWaitlistAndDelete = async () => {
            if (waitList.length > 0) {
                console.log(`Deploying to: `, waitList);
                // run safeBatchMint to array of addresses
                const tx = await ogNftInstance.adminMintBatch(waitList);
                await tx.wait();
                totalSent += waitList.length;
                // output the transaction hash
                console.log(`Transaction hash: ${tx.hash}`);
                waitList = [];
            }
        };

        function isAddress(address: string) {
            try {
                hre.ethers.utils.getAddress(address);
            } catch (e) {
                return false;
            }
            return true;
        }

        // console.log(`airdropAddresses= `, airdropAddresses);
        let totalSent = 0;
        for (let address of airdropAddresses) {
            // eslint-disable-next-line no-continue
            if (!isAddress(address)) continue;
            address = address.toLocaleLowerCase();
            const balance = Number((await ogNftInstance.balanceOf(address)).toString());
            console.log(`balanceOf(${address}) = ${balance}`);
            if (balance === 0 && waitList.indexOf(address) < 0) {
                waitList.push(address);
            }
            if (waitList.length >= 30) await sendToWaitlistAndDelete();
        }
        await sendToWaitlistAndDelete();

        console.log(`Airdrop complete. total sent ${totalSent}`);
    });

export default {};
