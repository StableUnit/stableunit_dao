// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
import {VestingTokenVotesWrapperV1Instance, TokenMockInstance} from "../types/truffle-contracts";

chai.use(solidity);

// @ts-ignore
const TokenMock = artifacts.require("TokenMock");
const VestingTokenVotesWrapperV1 = artifacts.require("VestingTokenVotesWrapperV1");

const BN_1E18 = web3.utils.toBN(1e18);

describe("VestingTokenVotesWrapperV1", () => {
    let accounts: string[];
    let owner: string, patron: string, alice: string, bob: string, carl: string;

    let vesuDaoInstance: TokenMockInstance;
    let vestWrapperV1Instance: VestingTokenVotesWrapperV1Instance;

    const oneHundred = BN_1E18.muln(100).toString();
    const twoHundred = BN_1E18.muln(200).toString();
    const threeHundred = BN_1E18.muln(300).toString();

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;

        vesuDaoInstance = await TokenMock.new("VeSuDAO mock", "mVeSuDao", 18);
        await vesuDaoInstance.mint(owner, oneHundred);
        await vesuDaoInstance.mint(alice, oneHundred);
        await vesuDaoInstance.mint(bob, oneHundred);
        vestWrapperV1Instance = await VestingTokenVotesWrapperV1.new(vesuDaoInstance.address);
    });

    describe("balance & total supply", async () => {

        it("should return correct balances", async () => {
            expect(
                await vestWrapperV1Instance.balanceOf(owner).toString()
            ).to.equal(
                await vesuDaoInstance.balanceOf(owner).toString()
            );

            expect(
                await vestWrapperV1Instance.balanceOf(alice).toString()
            ).to.equal(
                await vesuDaoInstance.balanceOf(alice).toString()
            );

            expect(
                await vestWrapperV1Instance.balanceOf(bob).toString()
            ).to.equal(
                await vesuDaoInstance.balanceOf(bob).toString()
            );
        })

        it("should return correct total supply", async () => {
            expect(
                await vestWrapperV1Instance.totalSupply().toString()
            ).to.equal(
                await vesuDaoInstance.totalSupply().toString()
            );
        })
    });

    describe("votes", async () => {

        it("should return 0 votes without delegation", async () => {

            let ownerVotes = await vestWrapperV1Instance.getVotes(owner);
            let aliceVotes = await vestWrapperV1Instance.getVotes(alice);
            let bobVotes = await vestWrapperV1Instance.getVotes(bob);

            expect(ownerVotes.toString()).to.equal("0");
            expect(aliceVotes.toString()).to.equal("0");
            expect(bobVotes.toString()).to.equal("0");
        })

        it("should delegate votes", async () => {
            await vestWrapperV1Instance.delegate(owner, {from: alice});
            let ownerVotes = await vestWrapperV1Instance.getVotes(owner);

            expect(await vestWrapperV1Instance.delegates(alice)).to.equal(owner);
            expect(ownerVotes.toString()).to.equal(oneHundred);
        })

        it("should maintain delegation after transfer", async () => {
            await vestWrapperV1Instance.delegate(owner, {from: alice});
            await vesuDaoInstance.transfer(alice, oneHundred, {from: bob});

            let ownerVotes = await vestWrapperV1Instance.getVotes(owner);

            expect(ownerVotes.toString()).to.equal(twoHundred);
        })

        it("should remove 1st delegation", async () => {
            await vestWrapperV1Instance.delegate(owner, {from: alice});
            await vestWrapperV1Instance.delegate(owner, {from: bob});
            await vestWrapperV1Instance.delegate(alice, {from: alice});

            let ownerVotes = await vestWrapperV1Instance.getVotes(owner);
            let aliceVotes = await vestWrapperV1Instance.getVotes(alice);
            let bobVotes = await vestWrapperV1Instance.getVotes(bob);

            expect(ownerVotes.toString()).to.equal(oneHundred);
            expect(aliceVotes.toString()).to.equal(oneHundred);
            expect(bobVotes.toString()).to.equal("0");
        })

        it("should remove 2nd delegation", async () => {
            await vestWrapperV1Instance.delegate(owner, {from: alice});
            await vestWrapperV1Instance.delegate(owner, {from: bob});
            await vestWrapperV1Instance.delegate(bob, {from: bob});

            let ownerVotes = await vestWrapperV1Instance.getVotes(owner);
            let aliceVotes = await vestWrapperV1Instance.getVotes(alice);
            let bobVotes = await vestWrapperV1Instance.getVotes(bob);

            expect(ownerVotes.toString()).to.equal(oneHundred);
            expect(aliceVotes.toString()).to.equal("0");
            expect(bobVotes.toString()).to.equal(oneHundred);
        })
    });
});
