import {deployments, ethers, getNamedAccounts} from "hardhat";
import {ContractTransaction} from "ethers";
import {expect} from "chai";
import { run } from "hardhat";

import {MockErc20, MockErc721, SuAccessControlSingleton, SuDAO, TokenDistributorV4, VeERC20} from "../../typechain";
import {BN_1E12, BN_1E18, BN_1E6} from "../utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {latest, waitNBlocks} from "../utils/time";

type DataType = {
    startTimestamp: number;
    startLengthSeconds: number,
    lengthSeconds: number,
    minGoal: number,
    maxGoal: number,
    minDonation: number,
    maxDonation: number,
    donationToken: string,
    fullVestingSeconds: number,
    cliffSeconds: number,
    tgeUnlock: number,
    vestingFrequencySeconds: number,
    removeLogs: boolean,
}

describe("TokenDistributorV4", () => {
    let tx: ContractTransaction | Promise<ContractTransaction>;

    let distributor: TokenDistributorV4;
    let mockUSDT: MockErc20;
    let mockNft: MockErc721;
    let suDAO: SuDAO;
    let veERC20: VeERC20;
    let accessControlSingleton: SuAccessControlSingleton;
    let data: DataType = {
        startTimestamp: 0,
        startLengthSeconds: 0,
        lengthSeconds: 2 * 60,
        minGoal: 1_000_000,
        maxGoal: 2_000_000,
        minDonation: 1_000,
        maxDonation: 500_000,
        donationToken: "",
        fullVestingSeconds: 2 * 24 * 60 * 60,
        cliffSeconds: 2 * 60 * 60,
        tgeUnlock: 0.05,
        vestingFrequencySeconds: 60 * 60,
        removeLogs: true,
    };

    let deployerSigner: SignerWithAddress;
    let daoSigner: SignerWithAddress;
    let adminSigner: SignerWithAddress;
    let randomSigner: SignerWithAddress;
    let userSigner: SignerWithAddress;
    let aliceSigner: SignerWithAddress;

    const initialize = async () => {
        const {
            deployer, dao, admin, randomAccount, userAccount, alice
        } = await getNamedAccounts();

        deployerSigner = await ethers.getSigner(deployer);
        daoSigner = await ethers.getSigner(dao); // TODO: owner? DAO is a contract, not EOA
        adminSigner = await ethers.getSigner(admin);
        userSigner = await ethers.getSigner(userAccount);
        aliceSigner = await ethers.getSigner(alice);
        randomSigner = await ethers.getSigner(randomAccount);

        await deployments.fixture(["Deployer"]);
        accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
        distributor = await ethers.getContract("TokenDistributorV4") as TokenDistributorV4;
        mockNft = await ethers.getContract("MockErc721") as MockErc721;
        suDAO = await ethers.getContract("SuDAO") as SuDAO;
        veERC20 = await ethers.getContract("VeERC20") as VeERC20;
        const mockErc20Factory = await ethers.getContractFactory("MockErc20");
        mockUSDT = await mockErc20Factory.deploy("test tether", "USDT", 6) as MockErc20;

        // distributor should be able to call lockUnderVesting
        await accessControlSingleton.connect(daoSigner).grantRole(await distributor.ADMIN_ROLE(), distributor.address);
    }

    const beforeAllFuncNoSuDAOMint = async (distributeData: DataType) => {
        await initialize();
        distributeData.startTimestamp = data.startTimestamp || await latest();
        distributeData.donationToken = mockUSDT.address;
        await run("setDistributor", distributeData);
    }

    const beforeAllFunc = async () => {
        await beforeAllFuncNoSuDAOMint(data);
        await suDAO.connect(daoSigner).mint(distributor.address, BN_1E18.mul(1_450_000));
    };

    describe("initial tests", function () {
        it("nothing is set", async () => {
            await initialize();

            // no distribution
            tx = distributor.connect(aliceSigner).participate(BN_1E6.mul(10000), mockNft.address);
            await expect(tx).to.be.reverted;
        });
        it("after setDistributor and grantRole", async () => {
            await beforeAllFuncNoSuDAOMint({ ...data, startTimestamp: await latest() + 60});

            // distribution don't started
            await expect(distributor.connect(userSigner).participate(BN_1E6.mul(10000), mockNft.address)).to.be.reverted;

            await waitNBlocks(100);

            // distributor don't have suDAO to distribute
            await mockNft.mint(userSigner.address);
            tx = distributor.connect(userSigner).participate(BN_1E6.mul(10000), mockNft.address);
            await expect(tx).to.be.reverted;
        });
        it("deployer can't call anything", async () => {
            await beforeAllFunc();

            await expect(distributor.connect(deployerSigner).setDistributionVesting(
              data.fullVestingSeconds,
              data.cliffSeconds,
              BN_1E18.mul(data.tgeUnlock * 1000).div(1000),
              data.vestingFrequencySeconds
            )).to.be.reverted;

            await expect(distributor.connect(deployerSigner).setDistributionInfo(
              data.startTimestamp + data.startLengthSeconds,
              data.startTimestamp +  data.startLengthSeconds + data.lengthSeconds,
              BN_1E6.mul(data.minGoal),
              BN_1E6.mul(data.maxGoal),
              BN_1E6.mul(data.minDonation),
              BN_1E6.mul(data.maxDonation),
              data.donationToken,
              BN_1E12,
            )).to.be.reverted;

            await expect(
              distributor.connect(deployerSigner).setNftAccess(mockNft.address, false)
            ).to.be.reverted;
            await expect(
              distributor.connect(deployerSigner).setNftAccess(mockNft.address, true)
            ).to.be.reverted;

            await expect(distributor.connect(deployerSigner).setBondingCurve([
                BN_1E18.mul(11).div(10), // 1.1 * 1e18
                BN_1E12.mul(10).div(10), // 10 * 1e11
            ])).to.be.reverted;
        });
    });

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

        const initialUSDTBalance = BN_1E6.mul(500_000);
        const mintNftAndUSDT = async (signer: SignerWithAddress) => {
            await mockUSDT.mint(signer.address, initialUSDTBalance);
            await mockUSDT.connect(signer).approve(distributor.address, BN_1E6.mul(2_000_000));
            await mockNft.mint(signer.address);
        }

        it("setDistributionInfo is correct", async () => {
            const contractData = await distributor.getDistributorStaticData();
            expect(contractData.startTimestamp_).to.be.equal(data.startTimestamp);
            expect(contractData.deadlineTimestamp_).to.be.equal(data.startTimestamp + data.startLengthSeconds + data.lengthSeconds);
            expect(contractData.minimumDonation_).to.be.equal(BN_1E6.mul(data.minDonation));
            expect(contractData.maximumDonation_).to.be.equal(BN_1E6.mul(data.maxDonation));
            expect(contractData.donationGoalMin_).to.be.equal(BN_1E6.mul(data.minGoal));
            expect(contractData.donationGoalMax_).to.be.equal(BN_1E6.mul(data.maxGoal));
            expect(contractData.donationToken_).to.be.equal(data.donationToken);
            expect(contractData.fullVestingSeconds_).to.be.equal(data.fullVestingSeconds);
            expect(contractData.cliffSeconds_).to.be.equal(data.cliffSeconds);
            expect(contractData.tgeUnlockRatio1e18_).to.be.equal(BN_1E18.mul(data.tgeUnlock * 1000).div(1000));
            expect(contractData.vestingFrequencySeconds_).to.be.equal(data.vestingFrequencySeconds);
        });

        it("Admin can remove accessNFT", async () => {
            let accessNFTS = await distributor.getAccessNfts();
            let accessNFTSUser = await distributor.getAccessNftsForUser(userSigner.address);
            expect(accessNFTS.length).to.be.equal(1);
            expect(accessNFTS[0]).not.to.be.equal('0x0000000000000000000000000000000000000000');
            expect(accessNFTSUser.length).to.be.equal(1);
            expect(accessNFTSUser[0]).to.be.equal('0x0000000000000000000000000000000000000000');

            await mockNft.mint(userSigner.address);
            accessNFTS = await distributor.getAccessNftsForUser(userSigner.address);
            expect(accessNFTS[0]).to.be.equal(mockNft.address);

            await distributor.connect(adminSigner).setNftAccess(mockNft.address, false);
            accessNFTS = await distributor.getAccessNfts();
            accessNFTSUser = await distributor.getAccessNftsForUser(userSigner.address);
            expect(accessNFTS.length).to.be.equal(0);
            expect(accessNFTSUser.length).to.be.equal(0);

            tx = distributor.connect(userSigner).participate(BN_1E6.mul(10000), mockNft.address);
            await expect(tx).to.be.reverted;
        });

        it("user have access token", async () => {
            let accessNFTS = await distributor.getAccessNftsForUser(userSigner.address);
            expect(accessNFTS[0]).to.be.equal('0x0000000000000000000000000000000000000000');

            const maxDonation = await distributor.getMaximumDonationAmount(userSigner.address, mockNft.address);
            expect(maxDonation).to.be.equal(0);

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

        it("user can take donations back when distribution fails",  async () => {
            const donation1 = BN_1E6.mul(100_000);
            const donation2 = BN_1E6.mul(50_000);
            const initialUSDTBalance = BN_1E6.mul(500_000);

            await mintNftAndUSDT(userSigner);

            const expectedRewards = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E12.mul(donation1));
            await distributor.connect(userSigner).participate(donation1, mockNft.address);

            let totalDonations = await distributor.totalDonations();
            let veSuDAOBalance = await veERC20.balanceOf(userSigner.address);
            let mockUSDTBalance = await mockUSDT.balanceOf(userSigner.address);

            expect(totalDonations).to.be.equal(donation1);
            expect(veSuDAOBalance).to.be.equal(expectedRewards);
            expect(mockUSDTBalance).to.be.equal(initialUSDTBalance.sub(donation1));
            // console.log("donation1 is successful");

            await expect(distributor.connect(userSigner).takeDonationBack()).to.be.reverted;
            // console.log("can't take donations back when time not is over");

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
            // console.log("donation2 is successful");

            // time not is over
            await expect(distributor.connect(userSigner).takeDonationBack()).to.be.reverted;
            // console.log("can't take donations back when time not is over");

            // wait until distribution ends
            await waitNBlocks(150);

            // can't participate more
            await expect(distributor.connect(userSigner).participate(donation2, mockNft.address)).to.be.reverted;

            // should donate all received tokens
            await expect(distributor.connect(userSigner).takeDonationBack()).to.be.reverted;
            // console.log("donations back shouldn't work when didn't return tokens first");

            await veERC20.connect(userSigner).burnAll();

            veSuDAOBalance = await veERC20.balanceOf(userSigner.address);
            expect(veSuDAOBalance).to.be.equal(0);

            await expect(distributor.connect(userSigner).takeDonationBack()).not.to.be.reverted;
            // console.log("donations back should not work");

            veSuDAOBalance = await veERC20.balanceOf(userSigner.address);
            totalDonations = await distributor.totalDonations();
            mockUSDTBalance = await mockUSDT.balanceOf(userSigner.address);
            expect(totalDonations).to.be.equal(0);
            expect(veSuDAOBalance).to.be.equal(0);
            expect(mockUSDTBalance).to.be.equal(initialUSDTBalance);

            // dao can't withdraw if distribution didn't reach minGoal
            await expect(distributor.connect(daoSigner).daoWithdraw(mockUSDT.address, daoSigner.address, totalDonations)).to.be.reverted;
        });

        it("DAO can take donations back when distribution success", async () => {
            const donation1 = BN_1E6.mul(500_000); // for userSigner
            const donation2 = BN_1E6.mul(300_000); // for aliceSigner
            const donation3 = BN_1E6.mul(400_000); // for randomSigner

            await mintNftAndUSDT(userSigner);
            await mintNftAndUSDT(aliceSigner);
            await mintNftAndUSDT(randomSigner);

            const expectedRewards1 = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E12.mul(donation1));
            await distributor.connect(userSigner).participate(donation1, mockNft.address);

            const expectedRewards2 = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E12.mul(donation2));
            await distributor.connect(aliceSigner).participate(donation2, mockNft.address);

            const expectedRewards3 = await distributor.getBondingCurveRewardAmountFromDonationUSD(BN_1E12.mul(donation3));
            await distributor.connect(randomSigner).participate(donation3, mockNft.address);

            let veSuDAOBalance1 = await veERC20.balanceOf(userSigner.address);
            let veSuDAOBalance2 = await veERC20.balanceOf(aliceSigner.address);
            let veSuDAOBalance3 = await veERC20.balanceOf(randomSigner.address);
            expect(veSuDAOBalance1).to.be.equal(expectedRewards1);
            expect(veSuDAOBalance2).to.be.equal(expectedRewards2);
            expect(veSuDAOBalance3).to.be.equal(expectedRewards3);

            let mockUSDTBalance1 = await mockUSDT.balanceOf(userSigner.address);
            let mockUSDTBalance2 = await mockUSDT.balanceOf(aliceSigner.address);
            let mockUSDTBalance3 = await mockUSDT.balanceOf(randomSigner.address);
            expect(mockUSDTBalance1).to.be.equal(initialUSDTBalance.sub(donation1));
            expect(mockUSDTBalance2).to.be.equal(initialUSDTBalance.sub(donation2));
            expect(mockUSDTBalance3).to.be.equal(initialUSDTBalance.sub(donation3));

            let totalDonations = await distributor.totalDonations();
            expect(totalDonations).to.be.equal(donation1.add(donation2).add(donation3));

            // dao can't withdraw if distribution not ended
            await expect(distributor.daoWithdraw(mockUSDT.address, daoSigner.address, totalDonations)).to.be.reverted;

            await waitNBlocks(100);

            // distribution reached minGoal
            await expect(distributor.connect(userSigner).takeDonationBack()).to.be.reverted;
            await expect(distributor.connect(aliceSigner).takeDonationBack()).to.be.reverted;
            await expect(distributor.connect(randomSigner).takeDonationBack()).to.be.reverted;

            // check id DAO will receive all donations after daoWithdraw()
            const daoBalanceBefore = await mockUSDT.balanceOf(daoSigner.address);
            await distributor.connect(daoSigner).daoWithdraw(mockUSDT.address, daoSigner.address, totalDonations);
            const daoBalanceAfter = await mockUSDT.balanceOf(daoSigner.address);
            expect(daoBalanceAfter).to.be.equal(daoBalanceBefore.add(totalDonations));
        });
    })
});
