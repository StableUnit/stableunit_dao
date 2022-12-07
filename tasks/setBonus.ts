import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";
import { task } from "hardhat/config";

import { BigNumber } from "ethers";
import { Bonus, MockErc721, SuDAO } from "../typechain";

/**
 * launch with the  command:
 * npx hardhat setBonus --verbose --network goerli
 */

task("setBonus", "set all parameters from the script").setAction(async (taskArgs, hre) => {
    // let tx;
    const [deployer, admin] = await hre.ethers.getSigners();

    const bonus = (await hre.ethers.getContract("Bonus")) as Bonus;
    const mockErc721 = (await hre.ethers.getContract("MockErc721")) as MockErc721;
    const suDAO = (await hre.ethers.getContract("SuDAO")) as SuDAO;

    console.log(`bonus@${(await hre.ethers.provider.getNetwork()).name} = `, bonus.address);
    console.log(`mockErc721@${(await hre.ethers.provider.getNetwork()).name} = `, mockErc721.address);

    // tx = await bonus.connect(dao).setAdmin(admin.address, true);
    // await tx.wait();
    // console.log("✅ setAdmin done");
    //
    // tx = await bonus.setCommunityAdmin(deployer.address, 1e6, 100);
    // await tx.wait();
    // console.log("✅ setCommunityAdmin done");

    // for mockErc721 we set allocation = 500 000 tUSDT, discount = 10%
    const tx = await bonus
        .connect(admin)
        .setNftInfo(mockErc721.address, BigNumber.from(500_000).mul(1e6), BigNumber.from(10).pow(17));
    await tx.wait();
    console.log("✅ setNftInfo done");

    // const xp = 85100;
    // tx = await bonus.distribute(user, xp);
    // console.log(`tx = `, tx.hash);
    // await tx.wait();
    // console.log("✅ distribute done");
});

export default {};
