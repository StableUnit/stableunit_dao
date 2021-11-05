// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
import {BN_1E18} from "./utils/utils";
import {TokenMockInstance, VestingTokenInstance, VotingPowerInstance} from "../types/truffle-contracts";

chai.use(solidity);

const {increaseTime, chainTimestamp} = require('./utils/timeManipulation');

const TokenMock = artifacts.require("TokenMock");
const VestingToken = artifacts.require("VestingToken");
const VotingPower = artifacts.require("VotingPower");


describe("VotingPower", () => {
    let accounts: string[];
    let owner: string, patron: string, alice: string, bob: string, carl: string;


    const SUDAO_AMOUNT = BN_1E18.muln(100);
    const VESUDAO_AMOUNT = BN_1E18.muln(50);
    const CLIFF_SECONDS = 100;
    const VESTING_SECONDS = 500;

    let sudaoInstance: TokenMockInstance;
    let veSudaoInstance: VestingTokenInstance;
    let votingPowerInstance: VotingPowerInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;

        sudaoInstance = await TokenMock.new("SuDAO mock", "mSuDao", 18);
        veSudaoInstance = await VestingToken.new("Vested SuDAO mock", "mVeSuDao", sudaoInstance.address);

        await sudaoInstance.mint(owner, SUDAO_AMOUNT);

        await sudaoInstance.mint(owner, VESUDAO_AMOUNT);
        await sudaoInstance.approve(veSudaoInstance.address, VESUDAO_AMOUNT);
        await veSudaoInstance.lockUnderVesting(owner, VESUDAO_AMOUNT, VESTING_SECONDS, CLIFF_SECONDS);

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

        })

        it("should count vested erc20 tokens", async () => {

        })

        it("should count vested nft tokens", async () => {

        })

    });



});



