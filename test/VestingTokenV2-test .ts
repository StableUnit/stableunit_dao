// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
import {VestingTokenV2Instance, TokenMockInstance} from "../types/truffle-contracts";

chai.use(solidity);

const {increaseTime, chainTimestamp} = require('./utils/timeManipulation');
const {ADDR_ZERO} = require('./utils/utils');

// @ts-ignore
const TokenMock = artifacts.require("TokenMock");
// @ts-ignore
const VestingTokenV2 = artifacts.require("VestingTokenV2");

const BN_1E18 = web3.utils.toBN(1e18);
const UINT256_0 = '0x0000000000000000000000000000000000000000';


describe("VestingTokenV2", () => {
    let accounts: string[];
    let owner: string, patron: string, alice: string, bob: string, carl: string;

    let suDaoInstance: TokenMockInstance;
    let vestingTokenV2Instance: VestingTokenV2Instance;

    const amountToLock = BN_1E18.muln(100);
    const cliffSeconds = 100;
    const vestingPeriodSeconds = 500;

    const mintAndLockTokens = async (_amountToLock = amountToLock, user = owner, toUser = patron) => {
        await suDaoInstance.mint(user, _amountToLock);
        await suDaoInstance.approve(vestingTokenV2Instance.address, _amountToLock);
        
        let voter = await vestingTokenV2Instance.delegates(toUser);
        if(voter == UINT256_0) {
            voter = toUser;
        }
        let votesBefore = await vestingTokenV2Instance.getVotes(voter);
        const tx = await vestingTokenV2Instance.lockUnderVesting(
            toUser,
            _amountToLock,
            vestingPeriodSeconds,
            cliffSeconds
        );
        let votesAfter = await vestingTokenV2Instance.getVotes(voter);
        assert.equal(true, votesAfter.sub(votesBefore).eq(_amountToLock));
    }

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;

        suDaoInstance = await TokenMock.new("SuDAO mock", "mSuDao", 18);
        await suDaoInstance.mint(owner, amountToLock);
        vestingTokenV2Instance = await VestingTokenV2.new("VestingTokenV2", "VeTo", suDaoInstance.address);
    });

    describe("lockUnderVesting", async () => {

        it("should have no votes before locking", async () => {
            
            const votesBefore = await vestingTokenV2Instance.getVotes(patron);
            assert.equal(BN_1E18.muln(0).toString(), votesBefore.toString());
        })

        it("should pull coins from the caller", async () => {
            const balanceBefore = await suDaoInstance.balanceOf(owner);
            await suDaoInstance.approve(vestingTokenV2Instance.address, amountToLock);
            await vestingTokenV2Instance.lockUnderVesting(
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
            const availableToClaim = Number((await vestingTokenV2Instance.availableToClaim(patron)).toString());
            assert.equal(availableToClaim, 0);

            // after cliff seconds should have something to claim
            increaseTime(web3, cliffSeconds);
            const availableToClaim2 = Number((await vestingTokenV2Instance.availableToClaim(patron)).toString());
            assert.equal(availableToClaim2, 0);

            // after full vesting should have all tokens to claim
            const thirdVesting = Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3);
            increaseTime(web3, thirdVesting);
            const availableToClaim3 = Number((await vestingTokenV2Instance.availableToClaim(patron)).toString());
            assert.isAtLeast(availableToClaim3, Number(amountToLock.divn(3).toString()));
            assert.isAtMost(availableToClaim3, Number(amountToLock.divn(3).add(BN_1E18).toString()));

            increaseTime(web3, thirdVesting);
            const availableToClaim4 = Number((await vestingTokenV2Instance.availableToClaim(patron)).toString());
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
                vestingTokenV2Instance.claim({from: patron})
            ).to.be.revertedWith("Can't claim 0 tokens");
        })

        it("claim all after vesting", async () => {
            const amountToLock = BN_1E18.muln(100);
            await mintAndLockTokens(amountToLock);

            increaseTime(web3, vestingPeriodSeconds);

            const suBalanceBefore = await suDaoInstance.balanceOf(patron);
            const votesBefore = await vestingTokenV2Instance.getVotes(patron);

            await vestingTokenV2Instance.claim({from: patron})
            const balanceAfter = await suDaoInstance.balanceOf(patron);
            const votesAfter = await vestingTokenV2Instance.getVotes(patron);

            const amountClaimed = balanceAfter.sub(suBalanceBefore);
            const votesReduced = votesBefore.sub(votesAfter);

            assert.equal(true, amountClaimed.eq(amountToLock));
            assert.equal(true, votesReduced.eq(amountToLock));
        })

        it("claim partially during vesting", async () => {
            await mintAndLockTokens();

            increaseTime(web3, cliffSeconds + Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3));

            const balanceBefore = await suDaoInstance.balanceOf(patron);
            const votesBefore = await vestingTokenV2Instance.getVotes(patron);
            await vestingTokenV2Instance.claim({from: patron})
            const balanceAfter = await suDaoInstance.balanceOf(patron);
            const votesAfter = await vestingTokenV2Instance.getVotes(patron);

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
            await vestingTokenV2Instance.sendTransaction({value: rescueAmountBn});

            const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(owner));
            await vestingTokenV2Instance.rescue(UINT256_0);
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
            await daiInstance.mint(vestingTokenV2Instance.address, rescueAmountBn);

            const balanceBefore = await daiInstance.balanceOf(owner);
            await vestingTokenV2Instance.rescue(daiInstance.address);
            const balanceAfter = await daiInstance.balanceOf(owner);
            const rescuedAmount = Number(balanceAfter.sub(balanceBefore).toString());
            const rescueAmount = Number(rescueAmountBn.toString());
            assert.equal(rescuedAmount, rescueAmount);
        })

        it("donate token to admin", async () => {
            await mintAndLockTokens();

            const balanceBefore = await suDaoInstance.balanceOf(owner);
            const votesBefore = await vestingTokenV2Instance.getVotes(patron);

            await vestingTokenV2Instance.donateTokens(owner, {from: patron})

            const balanceAfter = await suDaoInstance.balanceOf(owner);
            const votesAfter = await vestingTokenV2Instance.getVotes(patron);

            const donated = Number(balanceAfter.sub(balanceBefore).toString());
            const donatedVotes = Number(votesBefore.sub(votesAfter).toString());

            assert.isTrue(donated == Number(amountToLock.toString()));
            assert.isTrue(donatedVotes == Number(amountToLock.toString()));
        })

        it("donate token to invalid admin address should fail", async () => {
            await mintAndLockTokens();
            await expect(
                vestingTokenV2Instance.donateTokens(alice, {from: patron})
            ).to.be.revertedWith("invalid admin address");

            await expect(
                vestingTokenV2Instance.donateTokens(bob, {from: patron})
            ).to.be.revertedWith("invalid admin address");
        })
    });

    describe("delegatiom", async () => {

        it("correctly delegates votes", async () => {
            const amountToLock = BN_1E18.muln(100);
            await mintAndLockTokens(amountToLock);
            
            const votesPatronBefore = await vestingTokenV2Instance.getVotes(patron);
            const votesBobBefore = await vestingTokenV2Instance.getVotes(bob);
            
            await vestingTokenV2Instance.delegate(bob, {from: patron});
            
            const votesPatronAfter = await vestingTokenV2Instance.getVotes(patron);
            const votesBobAfter = await vestingTokenV2Instance.getVotes(bob);

            assert.equal(BN_1E18.muln(0).toString(), votesBobBefore.toString());
            assert.equal(BN_1E18.muln(0).toString(), votesPatronAfter.toString());

            assert.equal(true, votesPatronBefore.eq(amountToLock));
            assert.equal(true, votesBobAfter.eq(amountToLock));

        })

        it("should reduce delegated votes after withdrawal", async () => {
            await vestingTokenV2Instance.delegate(bob, {from: patron});
            await mintAndLockTokens();

            increaseTime(web3, cliffSeconds + Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3));
            await vestingTokenV2Instance.claim({from: patron})
            
            const votesBobAfter = await vestingTokenV2Instance.getVotes(bob);
            const votesPatronAfter = await vestingTokenV2Instance.getVotes(patron);
            const vestedBalancePatronAfter = await vestingTokenV2Instance.balanceOf(patron);

            assert.equal(BN_1E18.muln(0).toString(), votesPatronAfter.toString());
            assert.equal(true, votesBobAfter.eq(vestedBalancePatronAfter));
        })

        it("correctly delegate votes after withdrawal", async () => {
            await mintAndLockTokens();

            increaseTime(web3, cliffSeconds + Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3));
            await vestingTokenV2Instance.claim({from: patron})
            await vestingTokenV2Instance.delegate(bob, {from: patron});
            
            const votesBobAfter = await vestingTokenV2Instance.getVotes(bob);
            const votesPatronAfter = await vestingTokenV2Instance.getVotes(patron);
            const vestedBalancePatronAfter = await vestingTokenV2Instance.balanceOf(patron);

            assert.equal(BN_1E18.muln(0).toString(), votesPatronAfter.toString());
            assert.equal(true, votesBobAfter.eq(vestedBalancePatronAfter));
        })
    });

});
