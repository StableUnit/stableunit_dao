import {deployments, ethers, getNamedAccounts} from "hardhat";
import {ContractTransaction} from "ethers";
import {expect} from "chai";
import { run } from "hardhat";

import {MockErc20, MockErc721, SuAccessControlSingleton, SuDAO, TokenDistributorV4, VeERC20} from "../../typechain";
import {BN_1E12, BN_1E18, BN_1E6} from "../utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {latest, waitNBlocks} from "../utils/time";

describe("TokenDistributorV4", () => {
    let tx: ContractTransaction | Promise<ContractTransaction>;

    let distributor: TokenDistributorV4;
    let mockUSDT: MockErc20;
    let mockNft: MockErc721;
    let suDAO: SuDAO;
    let veERC20: VeERC20;
    let accessControlSingleton: SuAccessControlSingleton;

    let deployerSigner: SignerWithAddress;
    let ownerSigner: SignerWithAddress;
    let userSigner: SignerWithAddress;
    let randomSigner: SignerWithAddress;

    const beforeAllFunc = async () => {
        const {
            deployer, owner, userAccount, randomAccount,
        } = await getNamedAccounts();

        ownerSigner = await ethers.getSigner(owner);
        deployerSigner = await ethers.getSigner(deployer);
        userSigner = await ethers.getSigner(userAccount);
        randomSigner = await ethers.getSigner(randomAccount);

        await deployments.fixture(["Deployer"]);
        accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
        distributor = await ethers.getContract("TokenDistributorV4") as TokenDistributorV4;
        mockNft = await ethers.getContract("MockErc721") as MockErc721;
        suDAO = await ethers.getContract("SuDAO") as SuDAO;
        veERC20 = await ethers.getContract("VeERC20") as VeERC20;
        const mockErc20Factory = await ethers.getContractFactory("MockErc20");
        mockUSDT = await mockErc20Factory.deploy("test tether", "USDT", 6) as MockErc20;

        const blockTimestamp = await latest();
        await run("setDistributor", {
            startTimestamp: blockTimestamp,
            startLengthSeconds: 0,
            lengthSeconds: 2 * 60,
            minGoal: 1_000_000,
            maxGoal: 2_000_000,
            minDonation: 1_000,
            maxDonation: 500_000,
            donationToken: mockUSDT.address,
            fullVestingSeconds: 2 * 24 * 60 * 60,
            cliffSeconds: 2 * 60 * 60,
            tgeUnlock: 0.05,
            vestingFrequencySeconds: 60 * 60,
            removeLogs: true,
        });

        await accessControlSingleton.grantRole(await veERC20.ADMIN_ROLE(), distributor.address);
        await suDAO.mint(distributor.address, BN_1E18.mul(1_450_000));
    };

    describe("rewards are correct", function () {
        this.beforeEach(beforeAllFunc);
        it("bonding curve give right amount of rewards", async () => {
            const tx = distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18);
            await expect(tx).not.be.reverted;
            const rewards = await tx;
            // 1 < rewards < 1.1
            await expect(rewards).to.be.gt(BN_1E18).lt(BN_1E18.mul(11).div(10));

            const rewards2 = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18.mul(1000));
            await expect(rewards2).to.be.gt(BN_1E18.mul(1000)).lte(BN_1E18.mul(1100));

            const rewards3 = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E18.mul(1_000_000));
            await expect(rewards3).to.be.gt(BN_1E18.mul(900_000)).lte(BN_1E18.mul(1_000_000));

            const rewardStart = await distributor.bondingCurvePolynomial1e18At(0);
            expect(rewardStart).to.be.equal(BN_1E18.mul(11).div(10)); // 1.1 * 1e18

            const rewardEnd = await distributor.bondingCurvePolynomial1e18At(BN_1E18.mul(1_000_000));
            expect(rewardEnd).to.be.equal(BN_1E18.mul(8).div(10)); // 0.8 * 1e18
        });
    });

    describe("Main flow is correct", function () {
        this.beforeEach(beforeAllFunc);

        it("user have access token", async () => {
            let accessNFTS = await distributor.getAccessNftsForUser(userSigner.address);
            expect(accessNFTS[0]).to.be.equal('0x0000000000000000000000000000000000000000');

            await mockNft.mint(userSigner.address);
            accessNFTS = await distributor.getAccessNftsForUser(userSigner.address);
            expect(accessNFTS[0]).to.be.equal(mockNft.address);
        });

        it("user can't participate with no NFT or smallAmount", async () => {
            await mockUSDT.mint(userSigner.address, BN_1E6.mul(500_000));
            await mockUSDT.connect(userSigner).approve(distributor.address, BN_1E6.mul(1_000_000));
            // don't have NFT
            tx = distributor.connect(userSigner).participate(BN_1E6.mul(10), mockNft.address);
            await expect(tx).to.be.reverted;

            await mockNft.mint(userSigner.address);

            // amount < minAmount
            tx = distributor.connect(userSigner).participate(BN_1E6.mul(10), mockNft.address);
            await expect(tx).to.be.reverted;
        });

        it("user can take donations back when distribution fail", async () => {
            const donation1 = BN_1E6.mul(100_000);
            const donation2 = BN_1E6.mul(50_000);
            const initialUSDTBalance = BN_1E6.mul(500_000);

            await mockUSDT.mint(userSigner.address, initialUSDTBalance);
            await mockUSDT.connect(userSigner).approve(distributor.address, BN_1E6.mul(1_000_000));
            await mockNft.mint(userSigner.address);

            const expectedRewards = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E12.mul(donation1));
            await distributor.connect(userSigner).participate(donation1, mockNft.address);

            let totalDonations = await distributor.totalDonations();
            let veSuDAOBalance = await veERC20.balanceOf(userSigner.address);
            let mockUSDTBalance = await mockUSDT.balanceOf(userSigner.address);
            expect(totalDonations).to.be.equal(donation1);
            expect(veSuDAOBalance).to.be.equal(expectedRewards);
            expect(mockUSDTBalance).to.be.equal(initialUSDTBalance.sub(donation1));

            // time not is over
            await expect(distributor.connect(userSigner).takeDonationBack()).to.be.reverted;

            const maxDonation = await distributor.getMaximumDonationAmount(userSigner.address, mockNft.address);
            expect(maxDonation).to.be.gt(0);

            // check balance after 2 donations
            const expectedReward2 = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E12.mul(donation2));
            await distributor.connect(userSigner).participate(donation2, mockNft.address);

            totalDonations = await distributor.totalDonations();
            veSuDAOBalance = await veERC20.balanceOf(userSigner.address);
            mockUSDTBalance = await mockUSDT.balanceOf(userSigner.address);
            expect(totalDonations).to.be.equal(donation1.add(donation2));
            expect(veSuDAOBalance).to.be.equal(expectedRewards.add(expectedReward2));
            expect(mockUSDTBalance).to.be.equal(initialUSDTBalance.sub(donation1).sub(donation2));

            // time not is over
            await expect(distributor.connect(userSigner).takeDonationBack()).to.be.reverted;

            // wait until distribution ends
            await waitNBlocks(150);

            // should donate all received tokens
            await expect(distributor.connect(userSigner).takeDonationBack()).to.be.reverted;

            await veERC20.connect(userSigner).burnAll();

            veSuDAOBalance = await veERC20.balanceOf(userSigner.address);
            expect(veSuDAOBalance).to.be.equal(0);

            await expect(distributor.connect(userSigner).takeDonationBack()).not.to.be.reverted;

            veSuDAOBalance = await veERC20.balanceOf(userSigner.address);
            totalDonations = await distributor.totalDonations();
            mockUSDTBalance = await mockUSDT.balanceOf(userSigner.address);
            expect(totalDonations).to.be.equal(0);
            expect(veSuDAOBalance).to.be.equal(0);
            expect(mockUSDTBalance).to.be.equal(initialUSDTBalance);
        });
    })
});
