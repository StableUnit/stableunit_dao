import {deployments, ethers} from "hardhat";
import {expect} from "chai";
import {MockErc20, MockErc721, SuAccessControlSingleton, SuDAO, TokenDistributorV4} from "../../typechain";
import deployProxy from "../utils/deploy";
import {BN_1E12, BN_1E18, BN_1E6} from "../utils";
import {BigNumber} from "ethers";

describe("TokenDistributorV4", () => {
    let distributor: TokenDistributorV4;
    let mockUSDT: MockErc20;
    let mockNft: MockErc721;
    let suDAO: SuDAO;

    const beforeAllFunc = async () => {
        await deployments.fixture(["Deployer"]);
        distributor = await ethers.getContract("TokenDistributorV4") as TokenDistributorV4;
        mockNft = await ethers.getContract("MockErc721") as MockErc721;
        suDAO = await ethers.getContract("SuDAO") as SuDAO;
        const mockErc20Factory = await ethers.getContractFactory("MockErc20");
        mockUSDT = await mockErc20Factory.deploy("test tether", "USDT", 6) as MockErc20;

        const DISTRIBUTION_INFO = {
            lengthSeconds: 2 * 60 * 60,
            minGoal: 1_000_000,
            maxGoal: 2_000_000,
            minDonation: 1000,
            maxDonation: 100000,
            donationToken: mockUSDT.address,
            fullVestingSeconds: 2 * 24 * 60 * 60,
            cliffSeconds: 2 * 60 * 60,
            tgeUnlock: 0.05,
            vestingFrequencySeconds: 60 * 60
        }

        const nowTimestamp = Math.floor(Date.now() / 1000);
        let tx = await distributor.setDistributionInfo(
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
        // console.log("✅ setDistributionInfo done");

        tx = await distributor.setBondingCurve([
            BN_1E18.mul(9).div(10), // 1e18*0.9
            BN_1E18.mul(15).div(100).div(BN_1E6), // 1e18*0.15*1e-6
            BN_1E18.mul(15).div(100).div(BN_1E12), // 1e18*0.15*1e-12
        ]);
        await tx.wait();
        // console.log("✅ setBondingCurve done");

        tx = await distributor.setNftAccess(mockNft.address, true);
        // await tx.wait();
        console.log("✅ setNftAccess done");

        tx = await distributor.setBaseRewardRatio(BN_1E12);
        await tx.wait();
        console.log("✅ setBaseRewardRatio done");
    };

    describe("rewards are correct", function () {
        this.beforeAll(beforeAllFunc);
        it("bonding curve give right amount of rewards", async () => {
            await suDAO.mint(distributor.address, BN_1E18.mul(1_450_000));
            const tx = distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18);
            await expect(tx).not.be.reverted;
            let rewards = await tx;
            // 0.5 < rewards < 1
            console.log("rewards", rewards.toString());
            await expect(BigNumber.from(rewards.toString())).to.be.gt(BN_1E18.div(2)).lte(BN_1E18);

            rewards = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18.mul(1000));
            console.log("rewards", Number(rewards.toString())/1e18);
            await expect(BigNumber.from(rewards.toString())).to.be.gt(BN_1E18.mul(900)).lte(BN_1E18.mul(1200));

            rewards = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18.mul(1_000_000));
            console.log("rewards", Number(rewards.toString())/1e18);
            await expect(BigNumber.from(rewards.toString())).to.be.gt(BN_1E18.mul(900_000)).lte(BN_1E18.mul(1_200_000));
        })

    })
});
