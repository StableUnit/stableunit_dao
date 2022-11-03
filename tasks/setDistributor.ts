import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-waffle";
import {task} from "hardhat/config";

import {MockErc721, SuDAO, TokenDistributorV4} from "../typechain";


/**
 * launch with the  command:
 * npx hardhat setDistributor --verbose --network goerli
 */

task("setDistributor", "set all parameters from the script")
    .setAction(async (taskArgs, hre) => {
        let tx;
        const [deployer, dao, admin]  = await hre.ethers.getSigners();
        const BN_1E18 = hre.ethers.BigNumber.from(10).pow(18);
        const BN_1E6 = hre.ethers.BigNumber.from(10).pow(6);
        const BN_1E12 = hre.ethers.BigNumber.from(10).pow(12);
        const distributor = await hre.ethers.getContract("TokenDistributorV4") as TokenDistributorV4;
        const mockErc721 = await hre.ethers.getContract("MockErc721") as MockErc721;
        const suDAO = await hre.ethers.getContract("SuDAO") as SuDAO;
        // const accessControlSingleton = await hre.ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
        // console.log(`setDistributor.TokenDistributorV4@${ (await hre.ethers.provider.getNetwork()).name } = `, distributor.address);
        // console.log(`setDistributor.mockErc721@${ (await hre.ethers.provider.getNetwork()).name } = `, mockErc721.address);

        const nowTimestamp = Math.floor(Date.now() / 1000);

        const DISTRIBUTION_INFO = {
          startTimestamp: taskArgs.startTimestamp ?? nowTimestamp,
          startLengthSeconds: taskArgs.startLengthSeconds ?? 0,
          lengthSeconds: taskArgs.lengthSeconds ?? 48 * 60 * 60,
          minGoal: taskArgs.minGoal ?? 1_000_000,
          maxGoal: taskArgs.maxGoal ?? 2_000_000,
          minDonation: taskArgs.minDonation ?? 1000,
          maxDonation: taskArgs.maxDonation ?? 100000,
          donationToken: taskArgs.donationToken ?? "0x33f3b4Ac5083b7bcA29397728A7aA56909F790cA", // tUSDT
          fullVestingSeconds: taskArgs.fullVestingSeconds ?? 2 * 24 * 60 * 60,
          cliffSeconds: taskArgs.cliffSeconds ?? 2 * 60 * 60,
          tgeUnlock: taskArgs.tgeUnlock ?? 0.05,
          vestingFrequencySeconds: taskArgs.vestingFrequencySeconds ?? 60 * 60
        }

        // tx = await accessControlSingleton.grantRole(await distributor.ADMIN_ROLE(), distributor.address);
        // await tx.wait();

        tx = await distributor.connect(admin).setDistributionInfo(
          DISTRIBUTION_INFO.startTimestamp + DISTRIBUTION_INFO.startLengthSeconds,
          DISTRIBUTION_INFO.startTimestamp +  DISTRIBUTION_INFO.startLengthSeconds + DISTRIBUTION_INFO.lengthSeconds,
            BN_1E6.mul(DISTRIBUTION_INFO.minGoal),
            BN_1E6.mul(DISTRIBUTION_INFO.maxGoal),
            BN_1E6.mul(DISTRIBUTION_INFO.minDonation),
            BN_1E6.mul(DISTRIBUTION_INFO.maxDonation),
            DISTRIBUTION_INFO.donationToken,
            BN_1E12,
        );
        await tx.wait();
        if (!taskArgs.removeLogs) {
            console.log("✅ setDistributionInfo done");
        }

        tx = await distributor.connect(admin).setDistributionVesting(
            DISTRIBUTION_INFO.fullVestingSeconds,
            DISTRIBUTION_INFO.cliffSeconds,
            BN_1E18.mul(DISTRIBUTION_INFO.tgeUnlock * 1000).div(1000),
            DISTRIBUTION_INFO.vestingFrequencySeconds
        );
        await tx.wait();
        if (!taskArgs.removeLogs) {
          console.log("✅ setDistributionVesting done");
        }

        tx = await distributor.connect(admin).setBondingCurve([
          BN_1E18.mul(11).div(10), // 1.1 * 1e18
          -BN_1E12.mul(3).div(10), // -3 * 1e11
        ]);
        await tx.wait();
        if (!taskArgs.removeLogs) {
          console.log("✅ setBondingCurve done");
        }

        // tx = await mockErc721.mint(deployer.address);
        // await tx.wait();
        // if (!taskArgs.removeLogs) {
        //   console.log("✅ mockErc721 mint done");
        // }

        tx = await distributor.connect(admin).setNftAccess(mockErc721.address, true);
        await tx.wait();
        if (!taskArgs.removeLogs) {
          console.log("✅ setNftAccess done");
        }

        // TODO: remove in mainnet!!!
        // tx = await suDAO.mint(distributor.address, BN_1E18.mul(1_450_000));
        // await tx.wait();
        // if (!taskArgs.removeLogs) {
        //   console.log("✅ suDAO mint done");
        // }
    });

export default {};
