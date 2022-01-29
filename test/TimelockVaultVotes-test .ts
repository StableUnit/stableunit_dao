// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
import {TimelockVaultVotesInstance, TokenMockInstance} from "../types/truffle-contracts";

chai.use(solidity);

const {increaseTime, chainTimestamp} = require('./utils/timeManipulation');

// @ts-ignore
const TokenMock = artifacts.require("TokenMock");
// @ts-ignore
const TimelockVaultVotes = artifacts.require("TimelockVaultVotes");

const BN_1E18 = web3.utils.toBN(1e18);
const UINT256_0 = '0x0000000000000000000000000000000000000000';


describe("TimelockVaultVotes", () => {
    let accounts: string[];
    let owner: string, patron: string, alice: string, bob: string, carl: string;

    let suDaoInstance: TokenMockInstance;
    let timelockVaultVotesInstance: TimelockVaultVotesInstance;

    const amountToLock = BN_1E18.muln(100);
    const cliffSeconds = 100;
    const vestingPeriodSeconds = 500;

    const mintAndLockTokens = async (_amountToLock = amountToLock, user = owner, toUser = patron) => {
        await suDaoInstance.mint(user, _amountToLock);
        await suDaoInstance.approve(timelockVaultVotesInstance.address, _amountToLock);
        let votesBefore = await timelockVaultVotesInstance.getVotes(toUser);
        const tx = await timelockVaultVotesInstance.lockUnderVesting(
            toUser,
            _amountToLock,
            vestingPeriodSeconds,
            cliffSeconds
        );
        let votesAfter = await timelockVaultVotesInstance.getVotes(toUser);
        assert.equal(true, votesAfter.sub(votesBefore).eq(_amountToLock));
    }

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;

        suDaoInstance = await TokenMock.new("SuDAO mock", "mSuDao", 18);
        await suDaoInstance.mint(owner, amountToLock);
        timelockVaultVotesInstance = await TimelockVaultVotes.new(suDaoInstance.address);
    });

    describe("lockUnderVesting", async () => {

        it("should pull coins from the caller", async () => {
            const balanceBefore = await suDaoInstance.balanceOf(owner);
            await suDaoInstance.approve(timelockVaultVotesInstance.address, amountToLock);
            await timelockVaultVotesInstance.lockUnderVesting(
                patron,
                amountToLock,
                vestingPeriodSeconds,
                cliffSeconds
            );
            const balanceAfter = await suDaoInstance.balanceOf(owner);
            assert.equal(true, balanceBefore.eq(balanceAfter.add(amountToLock)));
        })
    });

    describe("availableToClaim", async () => {
        it("should vest right amount of tokens", async () => {
            const amountToLock = BN_1E18.muln(123);
            await mintAndLockTokens(amountToLock);

            // should have 0 available to claim
            const availableToClaim = Number((await timelockVaultVotesInstance.availableToClaim(patron)).toString());
            assert.equal(availableToClaim, 0);

            // after cliff seconds should have something to claim
            increaseTime(web3, cliffSeconds);
            const availableToClaim2 = Number((await timelockVaultVotesInstance.availableToClaim(patron)).toString());
            assert.equal(availableToClaim2, 0);

            // after full vesting should have all tokens to claim
            const thirdVesting = Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3);
            increaseTime(web3, thirdVesting);
            const availableToClaim3 = Number((await timelockVaultVotesInstance.availableToClaim(patron)).toString());
            assert.isAtLeast(availableToClaim3, Number(amountToLock.divn(3).toString()));
            assert.isAtMost(availableToClaim3, Number(amountToLock.divn(3).add(BN_1E18).toString()));

            increaseTime(web3, thirdVesting);
            const availableToClaim4 = Number((await timelockVaultVotesInstance.availableToClaim(patron)).toString());
            assert.isAtLeast(availableToClaim4, Number(amountToLock.divn(3).muln(2).toString()));
            assert.isAtMost(availableToClaim4, Number(amountToLock.divn(3).muln(2).add(BN_1E18).toString()));
        });
    });


    describe("claim", async () => {

        it("can't claim 0 before cliff", async () => {
            const amountToLock = BN_1E18.muln(100);
            await mintAndLockTokens(amountToLock);

            // should have 0 available to claim
            await expect(
                timelockVaultVotesInstance.claim({from: patron})
            ).to.be.revertedWith("Can't claim 0 tokens");
        })

        it("claim all after vesting", async () => {
            const amountToLock = BN_1E18.muln(100);
            await mintAndLockTokens(amountToLock);

            increaseTime(web3, vestingPeriodSeconds);
            const balanceBefore = await suDaoInstance.balanceOf(patron);
            const votesBefore = await timelockVaultVotesInstance.getVotes(patron);
            await timelockVaultVotesInstance.claim({from: patron})
            const balanceAfter = await suDaoInstance.balanceOf(patron);
            const votesAfter = await timelockVaultVotesInstance.getVotes(patron);

            assert.equal(true, balanceAfter.sub(balanceBefore).eq(amountToLock));
            assert.equal(true, votesBefore.sub(votesAfter).eq(amountToLock));
        })

        it("claim partially during vesting", async () => {
            await mintAndLockTokens();

            increaseTime(web3, cliffSeconds + Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3));

            const balanceBefore = await suDaoInstance.balanceOf(patron);
            const votesBefore = await timelockVaultVotesInstance.getVotes(patron);
            await timelockVaultVotesInstance.claim({from: patron})
            const balanceAfter = await suDaoInstance.balanceOf(patron);
            const votesAfter = await timelockVaultVotesInstance.getVotes(patron);

            const claimed = Number(balanceAfter.sub(balanceBefore).toString());
            const claimedVotes = Number(votesBefore.sub(votesAfter).toString());

            assert.isAtLeast(claimed, Number(amountToLock.divn(3).toString()));
            assert.isAtMost(claimed, Number(amountToLock.divn(3).add(BN_1E18).toString()));

            assert.isAtLeast(claimedVotes, Number(amountToLock.divn(3).toString()));
            assert.isAtMost(claimedVotes, Number(amountToLock.divn(3).add(BN_1E18).toString()));
        })
    });

    describe("rescue", async () => {

        it("deposit ether and rescue", async () => {
            const rescueAmountBn = BN_1E18.muln(2);
            await mintAndLockTokens();
            await timelockVaultVotesInstance.sendTransaction({value: rescueAmountBn});

            const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(owner));
            await timelockVaultVotesInstance.rescue(UINT256_0);
            const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(owner));
            const rescuedAmount = Number(balanceAfter.sub(balanceBefore).toString());
            const rescueAmount = Number(rescueAmountBn.toString());
            const gas = 1e9 * 100_000 * 20;
            assert.isAtLeast(rescuedAmount, rescueAmount - gas);
            assert.isAtMost(rescuedAmount, rescueAmount);
        })

        it("deposit erc20 and rescue", async () => {
            const daiInstance = await TokenMock.new("test DAI", "tDAI", 18);
            const rescueAmountBn = BN_1E18.muln(7);
            await mintAndLockTokens();
            await daiInstance.mint(timelockVaultVotesInstance.address, rescueAmountBn);

            const balanceBefore = await daiInstance.balanceOf(owner);
            await timelockVaultVotesInstance.rescue(daiInstance.address);
            const balanceAfter = await daiInstance.balanceOf(owner);
            const rescuedAmount = Number(balanceAfter.sub(balanceBefore).toString());
            const rescueAmount = Number(rescueAmountBn.toString());
            assert.equal(rescuedAmount, rescueAmount);
        })

        it("donate token to admin", async () => {
            await mintAndLockTokens();

            const balanceBefore = await suDaoInstance.balanceOf(owner);
            const votesBefore = await timelockVaultVotesInstance.getVotes(patron);

            await timelockVaultVotesInstance.donateTokens(owner, {from: patron})

            const balanceAfter = await suDaoInstance.balanceOf(owner);
            const votesAfter = await timelockVaultVotesInstance.getVotes(patron);

            const donated = Number(balanceAfter.sub(balanceBefore).toString());
            const donatedVotes = Number(votesBefore.sub(votesAfter).toString());

            assert.isTrue(donated == Number(amountToLock.toString()));
            assert.isTrue(donatedVotes == Number(amountToLock.toString()));
        })

        it("donate token to invalid admin address should fail", async () => {
            await mintAndLockTokens();
            await expect(
                timelockVaultVotesInstance.donateTokens(alice, {from: patron})
            ).to.be.revertedWith("invalid admin address");

            await expect(
                timelockVaultVotesInstance.donateTokens(bob, {from: patron})
            ).to.be.revertedWith("invalid admin address");
        })

    });


});



