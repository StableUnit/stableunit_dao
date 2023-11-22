import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";

import { task } from "hardhat/config";
import ROLES from "../scripts/roles";

task("renounce-role", "Grants role")
    .addParam("address", "Address of the deployed contract")
    .setAction(async (taskArgs, hre) => {
        // Get OgStableUnit contract, attach to the deployed address
        const ogStableUnit = await hre.ethers.getContractFactory("StableUnitDAOogNFT");
        const [deployer] = await hre.ethers.getSigners();

        const { address: deployedAddress } = taskArgs;

        const stableUnit = ogStableUnit.attach(deployedAddress);

        // renounce MINTER role from ROLES
        const tx1 = await stableUnit.renounceRole(ROLES.MINTER, deployer.address);
        await tx1.wait();
        console.log(`Renounced role ${ROLES.MINTER} from ${deployedAddress}: ${tx1.hash}`);

        // renounce PAUSER role from ROLES
        const tx2 = await stableUnit.renounceRole(ROLES.PAUSER, deployer.address);
        await tx2.wait();
        console.log(`Renounced role ${ROLES.PAUSER} from ${deployedAddress}: ${tx2.hash}`);

        // renounce ADMIN role
        const tx3 = await stableUnit.renounceRole(ROLES.ADMIN, deployer.address);
        await tx3.wait();
        console.log(`Renounced role ${ROLES.ADMIN} from ${deployedAddress}: ${tx3.hash}`);

        console.log(`Renounced all roles from ${deployedAddress} for account ${deployer.address}`);
    });

export default {};
