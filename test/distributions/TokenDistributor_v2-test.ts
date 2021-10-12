import {
    NftMockInstance,
    TimelockVaultInstance,
    TokenDistributorV2Instance,
    TokenMockInstance
} from "../../types/truffle-contracts";

const truffleAssert = require('truffle-assertions');
// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

const {increaseTime, chainTimestamp} = require('../utils/timeManipulation');

// @ts-ignore
const Distributor = artifacts.require("TokenDistributor_v3");
// @ts-ignore
const SuDAO = artifacts.require("SuDAO");
// @ts-ignore
const TimelockVault = artifacts.require("TimelockVault");
// @ts-ignore
const Token = artifacts.require("TokenMock");
// @ts-ignore
const Nft = artifacts.require("NftMock");

const BN_1E18 = web3.utils.toBN(1e18);

const UINT256_0 = '0x0000000000000000000000000000000000000000';

describe("TokenDistributor_v2", () => {
    let accounts: string[];
    let patron: string;
    let owner: string;

    let daiTokenInstance: TokenMockInstance;
    let suDaoInstance: TokenMockInstance;
    let timelockVaultInstance: TimelockVaultInstance;
    let nftInstance: NftMockInstance;
    let distributorInstance: TokenDistributorV2Instance;


    const distributionId = 0;
    const maxRewardAllocation = BN_1E18.muln(100);
    const minRewardAllocation = BN_1E18.muln(10);
    const maxDonationAmount = BN_1E18.muln(10);
    const deadlineSeconds = 10;
    const vestingPeriodSeconds = 30;
    const cliffSeconds = 20;

    const suDAOTotalSupply = BN_1E18.muln(1000);
    const totalRewards = BN_1E18.muln(500);

    async function setDistribution(account = accounts[1], donationMethod = daiTokenInstance.address) {
        // assuming all instances already exist
        let result = await distributorInstance.setDistribution(
            distributionId,
            minRewardAllocation,
            maxRewardAllocation,
            maxDonationAmount,
            donationMethod,
            await chainTimestamp() + deadlineSeconds,
            vestingPeriodSeconds,
            cliffSeconds,
            nftInstance.address,
        );
        return result;
    }

    async function mintAndDonate(user = accounts[1], amount = maxDonationAmount) {
        await daiTokenInstance.mint(user, amount);
        await daiTokenInstance.approve(distributorInstance.address, amount, {from: user});
        await nftInstance.mint(user);

        await distributorInstance.participate(distributionId, amount, {from: user});
    }

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        owner = accounts[0];
        patron = accounts[1];

        daiTokenInstance = await Token.new('Test DAI Stablecoin', 'tDAI', '18');
        nftInstance = await Nft.new("Test NFT", "tNFT");
        suDaoInstance = await SuDAO.new(suDAOTotalSupply);
        timelockVaultInstance = await TimelockVault.new(suDaoInstance.address);
        distributorInstance = await Distributor.new(UINT256_0, suDaoInstance.address, timelockVaultInstance.address);
        await timelockVaultInstance.grantRole(UINT256_0, distributorInstance.address);
    });

    describe("setDistribution", function () {
        it("Should set successfully", async () => {
            const balanceBefore = await suDaoInstance.balanceOf(distributorInstance.address);
            const result = await setDistribution();
            const balanceAfter = await suDaoInstance.balanceOf(distributorInstance.address);
            // balance shouldn't change
            assert.equal(true, balanceBefore.eq(balanceAfter));
            // there is should be a value in the distributions mapping,
            // and fields of this struct should be as expected
            const distribution = await distributorInstance.distributions(distributionId) as any;
            assert.equal(distribution.maximumRewardAllocation.toString(), maxRewardAllocation.toString());
            assert.equal(distribution.donationMethod, daiTokenInstance.address);
            assert.equal(distribution.nftRequirement, nftInstance.address);
            // event should emit
            truffleAssert.eventEmitted(result, 'SetDistribution', (ev: any) => {
                return ev.id == distributionId;
            });
        });

        it("Should not be able to setDistribution due to caller is not the owner", async () => {
            await truffleAssert.reverts(
                distributorInstance.setDistribution(
                    distributionId,
                    minRewardAllocation,
                    maxRewardAllocation,
                    maxDonationAmount,
                    daiTokenInstance.address,
                    await chainTimestamp() + deadlineSeconds,
                    vestingPeriodSeconds,
                    cliffSeconds,
                    nftInstance.address,
                    {from: patron}),
                "Ownable: caller is not the owner"
            );
        });

        it("Should set twice after first time", async () => {
            await setDistribution();
            await setDistribution();
        });
    });

    describe("donate", function () {
        it("Should participate and send donation successfully", async () => {
            await setDistribution();
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation);
            //
            await daiTokenInstance.mint(patron, maxDonationAmount);
            await daiTokenInstance.approve(distributorInstance.address, maxDonationAmount, {from: patron});
            await nftInstance.mint(patron);
            //
            const daiBalanceBefore = await daiTokenInstance.balanceOf(patron);
            const result = await distributorInstance.participate(distributionId, maxDonationAmount, {from: patron});
            truffleAssert.eventEmitted(result, 'Participated', {
                msg_sender: patron,
                distributionId: web3.utils.toBN(distributionId),
                donationAmount: web3.utils.toBN(Number(maxDonationAmount)),
            });
            const daiBalanceAfter = await daiTokenInstance.balanceOf(patron);
            assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.add(maxDonationAmount)));
        });

        it("Should participate with eth successfully", async () => {
            await setDistribution(patron, UINT256_0);
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation);

            await nftInstance.mint(patron);
            const ethBalanceBefore = web3.utils.toBN(await web3.eth.getBalance(patron));
            const result = await distributorInstance.participate(distributionId, maxDonationAmount, {
                from: patron,
                value: maxDonationAmount
            });
            const feePayed = web3.utils.toBN(result.receipt.gasUsed * Number((await web3.eth.getTransaction(result.tx)).gasPrice));

            truffleAssert.eventEmitted(result, 'Participated', {
                msg_sender: patron,
                distributionId: web3.utils.toBN(distributionId),
                donationAmount: web3.utils.toBN(Number(maxDonationAmount)),
            });

            const ethBalanceAfter = web3.utils.toBN(await web3.eth.getBalance(patron));
            assert.equal(true, ethBalanceBefore.eq(ethBalanceAfter.add(maxDonationAmount).add(feePayed)));
        });

        it("Should participate successfully with 2 steps", async () => {
            await setDistribution();
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation);

            await nftInstance.mint(patron);
            await daiTokenInstance.mint(patron, maxDonationAmount);

            let daiBalanceBefore = await daiTokenInstance.balanceOf(patron);
            await daiTokenInstance.approve(distributorInstance.address, maxDonationAmount, {from: patron});
            let result = await distributorInstance.participate(distributionId, BN_1E18.muln(7), {from: patron});
            truffleAssert.eventEmitted(result, 'Participated', {
                msg_sender: patron,
                distributionId: web3.utils.toBN(distributionId),
                donationAmount: web3.utils.toBN(Number(maxDonationAmount) * 70 / 100),
            });
            let daiBalanceAfter = await daiTokenInstance.balanceOf(patron);
            assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.add(BN_1E18.muln(7))));

            daiBalanceBefore = await daiTokenInstance.balanceOf(patron);
            await daiTokenInstance.approve(distributorInstance.address, maxDonationAmount, {from: patron});
            result = await distributorInstance.participate(distributionId, BN_1E18.muln(3), {from: patron});
            truffleAssert.eventEmitted(result, 'Participated', {
                msg_sender: patron,
                distributionId: web3.utils.toBN(distributionId),
                donationAmount: web3.utils.toBN(Number(maxDonationAmount) * 30 / 100),
            });
            daiBalanceAfter = await daiTokenInstance.balanceOf(patron);
            assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.add(BN_1E18.muln(3))));
        });

        it("Should not be able to participate due to exceeded limit when 0 no SuDAO", async () => {
            await setDistribution();

            await truffleAssert.reverts(
                mintAndDonate(patron, maxDonationAmount.muln(2)),
                "exceeded participation limit"
            );
        });

        it("Should not be able to participate due to exceeded limit when half suDAO", async () => {
            await setDistribution();
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation.divn(2));

            await truffleAssert.reverts(
                mintAndDonate(patron, maxDonationAmount.muln(2)),
                "exceeded participation limit"
            );
        });

        it("Should not be able to participate due to minReward limit", async () => {
            await setDistribution();

            await truffleAssert.reverts(
                mintAndDonate(patron, maxDonationAmount.divn(20)),
                "insufficient minimal amount"
            );
        });

    });

    describe("adminWithdraw", function () {
        it("withdraw DAI", async () => {
            await suDaoInstance.mint(distributorInstance.address, totalRewards);
            await setDistribution();
            await daiTokenInstance.mint(patron, maxDonationAmount);
            await nftInstance.mint(patron);
            await daiTokenInstance.approve(distributorInstance.address, maxDonationAmount, {from: patron});
            await distributorInstance.participate(distributionId, maxDonationAmount, {from: patron});

            let daiBalanceBefore = await daiTokenInstance.balanceOf(owner);
            await distributorInstance.adminWithdraw(daiTokenInstance.address);
            let daiBalanceAfter = await daiTokenInstance.balanceOf(owner);
            assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.sub(maxDonationAmount)));
        })

        it("withdraw ether", async () => {
            const donationAmount = BN_1E18.muln(7);
            await suDaoInstance.mint(distributorInstance.address, totalRewards);
            await setDistribution(owner, UINT256_0);
            await nftInstance.mint(patron);
            await distributorInstance.participate(distributionId, donationAmount, {
                from: patron,
                value: donationAmount
            });

            let balanceBefore = web3.utils.toBN(await web3.eth.getBalance(owner));
            await distributorInstance.adminWithdraw(UINT256_0);
            let balanceAfter = web3.utils.toBN(await web3.eth.getBalance(owner));
            const _donationAmount = Number(donationAmount.toString());
            const _deltaBalance = Number(balanceAfter.sub(balanceBefore).toString());
            const gas = 1e9 * 100_000 * 20;
            assert.isAtLeast(_deltaBalance, _donationAmount - gas);
            assert.isAtMost(_deltaBalance, _donationAmount);
        })

    })

    describe("getMaximumDonationAmount", async () => {
        it("user has an nft", async () => {
            await setDistribution();
            await nftInstance.mint(patron);

            const maxDonation = Number(await distributorInstance.getMaximumDonationAmount(distributionId, patron));
            assert.equal(maxDonation, Number(maxRewardAllocation.toString()));
        });

        it("user doesn't have an nft", async () => {
            await setDistribution();

            const maxDonation = Number(await distributorInstance.getMaximumDonationAmount(distributionId, patron));
            assert.equal(maxDonation, 0);
        });

        it("user donated something", async () => {
            await suDaoInstance.mint(distributorInstance.address, maxRewardAllocation);
            await setDistribution();

            await nftInstance.mint(owner);
            await daiTokenInstance.mint(owner, maxDonationAmount);
            await daiTokenInstance.approve(distributorInstance.address, maxDonationAmount);
            await distributorInstance.participate(distributionId, maxDonationAmount.divn(2));

            const maxDonation = Number(await distributorInstance.getMaximumDonationAmount(distributionId, owner));
            assert.equal(maxDonation, Math.floor(Number(maxRewardAllocation) / 2));
        });

    })
});



