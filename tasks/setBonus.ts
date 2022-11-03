import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";

import {Bonus, MockErc721, SuDAO} from "../typechain";
import {BigNumber} from "ethers";


/**
 * launch with the  command:
 * npx hardhat setBonus --verbose --network goerli
 */

task("setBonus", "set all parameters from the script")
    .setAction(async (taskArgs, hre) => {
        let tx;
        const user = "0xb79EbAa162f92A3E5B8E0CE3446e8b4a4E5C0A4B";
        const deployer  = (await hre.ethers.getSigners())[0];

        const bonus = await hre.ethers.getContract("Bonus") as Bonus;
        const mockErc721 = await hre.ethers.getContract("MockErc721") as MockErc721;
        const suDAO = await hre.ethers.getContract("SuDAO") as SuDAO;

        console.log(`bonus@${ (await hre.ethers.provider.getNetwork()).name } = `, bonus.address);
        console.log(`mockErc721@${ (await hre.ethers.provider.getNetwork()).name } = `, mockErc721.address);

        tx = await bonus.setAdmin(deployer.address, true);
        await tx.wait();
        console.log("✅ setAdmin done");

        tx = await bonus.setCommunityAdmin(deployer.address, 1e6, 100);
        await tx.wait();
        console.log("✅ setCommunityAdmin done");

        // for mockErc721 we set allocation = 500 000 tUSDT, discount = 10%
        tx = await bonus.setNftInfo(mockErc721.address, BigNumber.from(500_000).mul(1e6), BigNumber.from(10).pow(17));
        await tx.wait();
        console.log("✅ setNftInfo done");

        // const xp = 85100;
        // tx = await bonus.distribute(user, xp);
        // console.log(`tx = `, tx.hash);
        // await tx.wait();
        // console.log("✅ distribute done");

        tx = await mockErc721.mint(user);
        await tx.wait();
        console.log("✅ mockErc721 mint done");
    });

export default {};
