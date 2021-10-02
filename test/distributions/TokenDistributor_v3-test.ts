const truffleAssert = require('truffle-assertions');
// @ts-ignore
import {assert, web3, artifacts} from "hardhat";
import {BN_1E18, BN_EPS, EPS, UINT256_0} from "../utils/utils";

const {increaseTime, chainTimestamp} = require('../utils/timeManipulation');

// @ts-ignore
const Distributor = artifacts.require("TokenDistributor_v3");
// @ts-ignore
const SuDAO = artifacts.require("SuDAO");
// @ts-ignore
const TimelockVault = artifacts.require("TimelockVault");
// @ts-ignore
const TokenMock = artifacts.require("TokenMock");
// @ts-ignore
const OgNft = artifacts.require("NftMock");
// @ts-ignore
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");


describe("TokenDistributor_v3", () => {
    let accounts: string[];
    let owner;
    let patron;

    let daiTokenInstance;
    let suDaoInstance;
    let timelockVaultInstance;
    let ogNftInstance;
    let aNftInstance;
    let distributorInstance;


    const distributionId = 0;
    const maxRewardAllocation = BN_1E18.muln(100);
    const minRewardAllocation = BN_1E18.muln(10);
    const maxDonationAmount = BN_1E18.muln(10);
    const deadlineSeconds = 20;
    const vestingPeriodSeconds = 40;
    const cliffSeconds = 30;

    const totalRewards = BN_1E18.muln(500);

    async function setDistribution(account = accounts[1], donationMethod = daiTokenInstance.address) {
        // assuming all instances already exist
        return await distributorInstance.setDistribution(
            distributionId,
            minRewardAllocation,
            maxRewardAllocation,
            maxDonationAmount,
            donationMethod,
            await chainTimestamp() + deadlineSeconds,
            vestingPeriodSeconds,
            cliffSeconds,
            ogNftInstance.address,
        );
    }

    async function mintToParticipate(user = accounts[1], amount = maxDonationAmount, bonus = 1.5) {
        await daiTokenInstance.mint(user, amount);
        await daiTokenInstance.approve(distributorInstance.address, amount, {from: user});
        await ogNftInstance.mint(user);
        const bonusBase = await aNftInstance.BASE_LEVEL();
        await aNftInstance.mintWithLevel(user, Math.round(bonus * bonusBase));
    }

    async function mintAndParticipate(user = accounts[1], amount = maxDonationAmount, bonus = 1.5) {
        await mintToParticipate(user, amount, bonus);
        return await distributorInstance.participateWithBonus(distributionId, amount, {from: user});
    }

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        owner = accounts[0];
        patron = accounts[1];

        daiTokenInstance = await TokenMock.new('Test DAI Stablecoin', 'tDAI', '18');
        ogNftInstance = await OgNft.new("Test NFT", "tNFT");
        aNftInstance = await AdvisorNft.new();
        suDaoInstance = await SuDAO.new(0);
        timelockVaultInstance = await TimelockVault.new(suDaoInstance.address);
        distributorInstance = await Distributor.new(
            aNftInstance.address,
            suDaoInstance.address,
            timelockVaultInstance.address
        );
        await timelockVaultInstance.grantRole(UINT256_0, distributorInstance.address);
    });

    describe("participateWithBonus when have aNFT", function () {
        it("Should not be able to participate due to exceeded limit when 0 no SuDAO", async () => {
            await setDistribution();

            await truffleAssert.reverts(
                mintAndParticipate(patron, maxDonationAmount.muln(2)),
                "exceeded participation limit"
            );
        });

        it("Should not be able to participate due to exceeded limit when half suDAO", async () => {
            await setDistribution();
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation.divn(2));

            await truffleAssert.reverts(
                mintAndParticipate(patron, maxDonationAmount.muln(2)),
                "exceeded participation limit"
            );
        });

        it("Should not be able to participate due to exceeded limit when 1:1 suDAO", async () => {
            await setDistribution();
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation);

            await truffleAssert.reverts(
                mintAndParticipate(patron, maxDonationAmount.muln(2)),
                "exceeded participation limit"
            );
        });

        it("Should not be able to participate due to exceeded limit when 1:1.4 suDAO", async () => {
            await setDistribution();
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation.muln(1.5));

            await truffleAssert.reverts(
                mintAndParticipate(patron, maxDonationAmount.muln(2)),
                "exceeded participation limit"
            );
        });

        it("should be able to participate with 1:1.5 suDAO for bonus", async () => {
            const expectedReward = await maxRewardAllocation.muln(1.5);
            await suDaoInstance.mint(distributorInstance.address, expectedReward);
            await setDistribution();
            const tx = await mintAndParticipate();
            truffleAssert.eventEmitted(tx, 'Participated', {
                msg_sender: patron,
                distributionId: web3.utils.toBN(distributionId),
                donationAmount: web3.utils.toBN(Number(maxDonationAmount)),
            });
            const lockedReward = await timelockVaultInstance.totalDeposited(patron);
            assert.equal(lockedReward.toString(), expectedReward.toString());
        });

        it("should be able to participate with 1:3 suDAO for bonus", async () => {
            const bonus = 3
            const expectedReward = await maxRewardAllocation.muln(bonus);
            await suDaoInstance.mint(distributorInstance.address, expectedReward);
            await setDistribution();
            const tx = await mintAndParticipate(patron, maxDonationAmount, bonus);
            truffleAssert.eventEmitted(tx, 'Participated', {
                msg_sender: patron,
                distributionId: web3.utils.toBN(distributionId),
                donationAmount: web3.utils.toBN(Number(maxDonationAmount)),
            });
            const lockedReward = await timelockVaultInstance.totalDeposited(patron);
            assert.equal(lockedReward.toString(), expectedReward.toString());
        });

        it("should be able to participate 2 times for 90/10 with 1:2 suDAO for bonus", async () => {
            const bonus = 2;
            const expectedReward = await maxRewardAllocation.muln(bonus);
            await suDaoInstance.mint(distributorInstance.address, expectedReward);
            await setDistribution();
            await mintToParticipate(patron, maxDonationAmount, bonus);
            await distributorInstance.participateWithBonus(distributionId, maxDonationAmount.muln(0.7), {from: patron});
            await distributorInstance.participateWithBonus(distributionId, maxDonationAmount.muln(0.3), {from: patron});
            const lockedReward = await timelockVaultInstance.totalDeposited(patron);
            assert.isAtLeast(
                Number(lockedReward.toString()),
                Number(expectedReward.sub(BN_EPS).toString())
            );
            assert.isAtMost(
                Number(lockedReward.toString()),
                Number(expectedReward.add(BN_EPS).toString())
            );
        });


    });
});



