import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";
import {task} from "hardhat/config";

import {MockErc721, TokenDistributorV4} from "../typechain";


/**
 * launch with the  command:
 * npx hardhat setDistributor --verbose --network goerli
 */

task("setDistributor", "set all parameters from the script")
    .setAction(async (taskArgs, hre) => {
        let tx;
        const BN_1E18 = hre.ethers.BigNumber.from(10).pow(18);
        const BN_1E6 = hre.ethers.BigNumber.from(10).pow(6);
        const distributor = await hre.ethers.getContract("TokenDistributorV4") as TokenDistributorV4;
        const mockErc721 = await hre.ethers.getContract("MockErc721") as MockErc721;
        console.log(`TokenDistributorV4@${ (await hre.ethers.provider.getNetwork()).name } = `, distributor.address);
        console.log(`mockErc721@${ (await hre.ethers.provider.getNetwork()).name } = `, mockErc721.address);

        const DISTRIBUTION_INFO = {
            lengthSeconds: 2 * 60 * 60,
            minGoal: 1_000_000,
            maxGoal: 2_000_000,
            minDonation: 1000,
            maxDonation: 100000,
            donationToken: "0x33f3b4Ac5083b7bcA29397728A7aA56909F790cA",
            fullVestingSeconds: 2 * 24 * 60 * 60,
            cliffSeconds: 2 * 60 * 60,
            tgeUnlock: 0.05,
            vestingFrequencySeconds: 60 * 60
        }

        const nowTimestamp = Math.floor(Date.now() / 1000);

        tx = await distributor.setDistributionInfo(
            nowTimestamp + 10 * 60,
            nowTimestamp + +10 * 60 + DISTRIBUTION_INFO.lengthSeconds,
            BN_1E6.mul(DISTRIBUTION_INFO.minGoal),
            BN_1E6.mul(DISTRIBUTION_INFO.maxGoal),
            BN_1E6.mul(DISTRIBUTION_INFO.minDonation),
            BN_1E6.mul(DISTRIBUTION_INFO.maxDonation),
            DISTRIBUTION_INFO.donationToken,
            DISTRIBUTION_INFO.fullVestingSeconds,
            DISTRIBUTION_INFO.cliffSeconds,
            BN_1E18.mul(DISTRIBUTION_INFO.tgeUnlock * 1000).div(1000),
            DISTRIBUTION_INFO.vestingFrequencySeconds
        );
        await tx.wait();
        console.log("✅ setDistributionInfo done");

        tx = await distributor.setNftAccess(mockErc721.address, true);
        await tx.wait();
        console.log("✅ setNftAccess done");
    });

export default {};
