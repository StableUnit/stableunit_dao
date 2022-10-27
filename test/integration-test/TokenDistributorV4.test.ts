import {deployments, ethers} from "hardhat";
import {BigNumber} from "ethers";
import {expect} from "chai";
import { run } from "hardhat";

import {MockErc20, MockErc721, SuDAO, TokenDistributorV4} from "../../typechain";
import {BN_1E18} from "../utils";

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

        await run("setDistributor", {
            lengthSeconds: 2 * 60 * 60,
            minGoal: 1_000_000,
            maxGoal: 2_000_000,
            minDonation: 1000,
            maxDonation: 100000,
            donationToken: mockUSDT.address,
            fullVestingSeconds: 2 * 24 * 60 * 60,
            cliffSeconds: 2 * 60 * 60,
            tgeUnlock: 0.05,
            vestingFrequencySeconds: 60 * 60,
            removeLogs: true,
        });
    };

    describe("rewards are correct", function () {
        this.beforeAll(beforeAllFunc);
        it("bonding curve give right amount of rewards", async () => {
            await suDAO.mint(distributor.address, BN_1E18.mul(1_450_000));
            const tx = distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18);
            await expect(tx).not.be.reverted;
            let rewards = await tx;
            // 0.5 < rewards < 1
            await expect(BigNumber.from(rewards.toString())).to.be.gt(BN_1E18.div(2)).lte(BN_1E18);

            rewards = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18.mul(1000));
            await expect(BigNumber.from(rewards.toString())).to.be.gt(BN_1E18.mul(900)).lte(BN_1E18.mul(1200));

            rewards = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18.mul(1_000_000));
            await expect(BigNumber.from(rewards.toString())).to.be.gt(BN_1E18.mul(900_000)).lte(BN_1E18.mul(1_200_000));
        })

    })
});
