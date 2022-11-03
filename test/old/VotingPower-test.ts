// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
chai.use(solidity);

import {BN_1E18} from "./utils/utils";
import {
    NftMockInstance,
    TokenMockInstance,
    VestingTokenInstance,
    VotingPowerInstance
} from "../types/truffle-contracts";


const {increaseTime, chainTimestamp} = require('./utils/timeManipulation');

const TokenMock = artifacts.require("TokenMock");
const NftMock = artifacts.require("NftMock");
const VestingToken = artifacts.require("VestingToken");
const VotingPower = artifacts.require("VotingPower");


describe("VotingPower", () => {
    let accounts: string[];
    let owner: string, patron: string, alice: string, bob: string, carl: string;

    const SUDAO_AMOUNT = BN_1E18.muln(100);
    const VESUDAO_AMOUNT = BN_1E18.muln(50);
    const CLIFF_SECONDS = 100;
    const VESTING_SECONDS = 500;
    const DEFAULT_DECIMALS = 18;

    const VESUDAO_NAME = "Vested SuDAO mock";
    const VESUDAO_SYMBOL = "mVeSuDao";

    const VOTING_POWER_NAME = "Voting Power SuDAO";
    const VOTING_POWER_SYMBOL = "vpSuDao";

    let sudaoInstance: TokenMockInstance;
    let veSudaoInstance: VestingTokenInstance;
    let votingPowerInstance: VotingPowerInstance;
    let nftInstance: NftMockInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;

        sudaoInstance = await TokenMock.new("SuDAO mock", "mSuDao", 18);
        veSudaoInstance = await VestingToken.new(VESUDAO_NAME, VESUDAO_SYMBOL, sudaoInstance.address);
        nftInstance = await NftMock.new("NFT mock", "mNFT");

        await sudaoInstance.mint(owner, SUDAO_AMOUNT);

        await sudaoInstance.mint(owner, VESUDAO_AMOUNT);
        await sudaoInstance.approve(veSudaoInstance.address, VESUDAO_AMOUNT);
        await veSudaoInstance.lockUnderVesting(owner, VESUDAO_AMOUNT, VESTING_SECONDS, CLIFF_SECONDS);

        await nftInstance.mint(owner);

        votingPowerInstance = await VotingPower.new(VOTING_POWER_NAME, VOTING_POWER_SYMBOL);
    });

    describe("name/symbol/decimals", async () => {

        it("Vested SuDAO", async () => {
            const name = await veSudaoInstance.name();
            const symbol = await veSudaoInstance.symbol();
            const decimals = await veSudaoInstance.decimals();

            expect(name).to.equal(VESUDAO_NAME);
            expect(symbol).to.equal(VESUDAO_SYMBOL);
            expect(decimals.toNumber()).to.equal(DEFAULT_DECIMALS);
        })

        it("Voting Power", async () => {
            const symbol = await votingPowerInstance.symbol();
            const name = await votingPowerInstance.name();
            const decimals = await votingPowerInstance.decimals();

            expect(symbol).to.equal(VOTING_POWER_SYMBOL);
            expect(name).to.equal(VOTING_POWER_NAME);
            expect(decimals.toNumber()).to.equal(DEFAULT_DECIMALS);
        })
    });

    describe("add/edit/delete tokens&multipliers", async () => {

        it("add tokens", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
        })

        it("edit Token", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");

            await votingPowerInstance.editToken(1, veSudaoInstance.address, 3);
        })

        it("fail to edit Token with wrong id", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");

            await expect(
                votingPowerInstance.editToken(0, veSudaoInstance.address, 3)
            ).to.be.revertedWith("wrong token id");

            await expect(
                votingPowerInstance.editToken(2, veSudaoInstance.address, 3)
            ).to.be.revertedWith("reverted with panic code 0x32 (Array accessed at an out-of-bounds or negative index)");
        })

        it("delete the last", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
            await votingPowerInstance.deleteToken(1, veSudaoInstance.address);
        })

        it("delete not the last", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
            await votingPowerInstance.deleteToken(0, sudaoInstance.address);
        })

        it("delete all", async () => {
            await votingPowerInstance.addToken(sudaoInstance.address, "1");
            await votingPowerInstance.addToken(veSudaoInstance.address, "2");
            await votingPowerInstance.deleteToken(0, sudaoInstance.address);
            await votingPowerInstance.deleteToken(0, veSudaoInstance.address);
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
    });


});



