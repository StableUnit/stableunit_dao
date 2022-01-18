// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
chai.use(solidity);

import {BN_1E18} from "./utils/utils";
import {
    NftVotesMockInstance,
    TokenVotesMockInstance,
    VestingTokenV2Instance,
    VotingPowerInstance
} from "../types/truffle-contracts";


const {increaseTime, chainTimestamp} = require('./utils/timeManipulation');

const TokenVotesMock = artifacts.require("TokenVotesMock");
const NftVotesMock = artifacts.require("NftVotesMock");
const VestingTokenV2 = artifacts.require("VestingTokenV2");
const VotingPower = artifacts.require("VotingPower");

describe("VotingPower", () => {
    let accounts: string[];
    let owner: string, patron: string, alice: string, bob: string, carl: string;


    const SUDAO_AMOUNT = BN_1E18.muln(100);
    const VESUDAO_AMOUNT = BN_1E18.muln(50);
    const CLIFF_SECONDS = 100;
    const VESTING_SECONDS = 500;

    let sudaoInstance: TokenVotesMockInstance;
    let veSudaoInstance: VestingTokenV2Instance;
    let votingPowerInstance: VotingPowerInstance;
    let nftInstance: NftVotesMockInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;

        sudaoInstance = await TokenVotesMock.new("SuDAO mock", "mSuDao", 18);
        veSudaoInstance = await VestingTokenV2.new("Vested SuDAO mock", "mVeSuDao", sudaoInstance.address);
        nftInstance = await NftVotesMock.new("NFT mock", "mNFT");

        await sudaoInstance.mint(owner, SUDAO_AMOUNT);

        await sudaoInstance.mint(owner, VESUDAO_AMOUNT);
        await sudaoInstance.approve(veSudaoInstance.address, VESUDAO_AMOUNT);
        await veSudaoInstance.lockUnderVesting(owner, VESUDAO_AMOUNT, VESTING_SECONDS, CLIFF_SECONDS);

        await nftInstance.mint(owner);

        votingPowerInstance = await VotingPower.new("Voting Power SuDAO", "vpSuDao");
    });

    describe("add/edit/delete tokens&multipliers", async () => {

        it("add tokens", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
        })

        it("edit Token", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");

            await votingPowerInstance.setWeight(1, veSudaoInstance.address, 3);
        })

        it("fail to edit Token with wrong id", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");

            await expect(
                votingPowerInstance.setWeight(0, veSudaoInstance.address, 3)
            ).to.be.revertedWith("wrong token id");

            await expect(
                votingPowerInstance.setWeight(2, veSudaoInstance.address, 3)
            ).to.be.revertedWith("reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)");
        })

        it("fail to edit Token with wrong multiplier", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");

            await expect(
                votingPowerInstance.setWeight(1, veSudaoInstance.address, 10001)
            ).to.be.revertedWith("weight too high");
        })

        it("delete the last", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
            await votingPowerInstance.deleteToken(1, veSudaoInstance.address);

            await expect(await votingPowerInstance.isTokenAdded(veSudaoInstance.address)).to.equal(false);
        })

        it("delete not the last", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
            await votingPowerInstance.deleteToken(0, sudaoInstance.address);

            await expect(await votingPowerInstance.isTokenAdded(sudaoInstance.address)).to.equal(false);
        })

        it("delete all", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
            await votingPowerInstance.deleteToken(0, sudaoInstance.address);
            await votingPowerInstance.deleteToken(0, veSudaoInstance.address);

            await expect(await votingPowerInstance.isTokenAdded(veSudaoInstance.address)).to.equal(false);
            await expect(await votingPowerInstance.isTokenAdded(sudaoInstance.address)).to.equal(false);
        })
    });

    describe("balanceOf", async () => {

        it("should count plain erc20 tokens", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            expect(
                (await votingPowerInstance.balanceOf(owner)).toString()
            ).to.equal(
                SUDAO_AMOUNT.toString()
            );
        })

        it("should count vested erc20 tokens", async () => {
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
            expect(
                (await votingPowerInstance.balanceOf(owner)).toString()
            ).to.equal(
                VESUDAO_AMOUNT.muln(2).toString()
            );
        })

        it("should count vested nft tokens", async () => {
            await votingPowerInstance.addToken(nftInstance.address, "11");
            expect(
                (await votingPowerInstance.balanceOf(owner)).toString()
            ).to.equal(
                '11'
            );
        })

        it("should count token, vested token and nfts", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "3");
            await votingPowerInstance.addToken(nftInstance.address, "11");
            expect(
                (await votingPowerInstance.balanceOf(owner)).toString()
            ).to.equal(
                SUDAO_AMOUNT.add(VESUDAO_AMOUNT.muln(3)).addn(11).toString()
            );
        })

        it("should count token, vested token and nfts after delegation", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "3");
            await votingPowerInstance.addToken(nftInstance.address, "11");

            await sudaoInstance.delegate(patron);
            await veSudaoInstance.delegate(patron);
            await nftInstance.delegate(patron);

            expect(
                (await votingPowerInstance.balanceOf(owner)).toString()
            ).to.equal(
                web3.utils.toBN(0).toString()
            );

            expect(
                (await votingPowerInstance.balanceOf(patron)).toString()
            ).to.equal(
                SUDAO_AMOUNT.add(VESUDAO_AMOUNT.muln(3)).addn(11).toString()
            );
        })
    });
});
