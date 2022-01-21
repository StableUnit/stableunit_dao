import { expect } from "chai";
import { ethers } from "hardhat";
import {ADDR_DEAD} from "../utils/utils";
import {NftMockInstance, StableUnitDAOogNFTVotesInstance} from "../../types/truffle-contracts";

const MockNft = artifacts.require("NftMock");
const OGNftVotes = artifacts.require("StableUnitDAOogNFTVotes");

describe("StableUnitDAO ogNFTVotes", () => {
    let accounts: string[];
    let [owner, patron, alice, bob, carl]: string[] = [];
    let nftMockInstance: NftMockInstance;
    let ogNftVotesInstance: StableUnitDAOogNFTVotesInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;
        nftMockInstance = await MockNft.new("NFT mock", "mNFT");
        ogNftVotesInstance = await OGNftVotes.new(nftMockInstance.address);

        await nftMockInstance.mint(owner);
        await nftMockInstance.setApprovalForAll(ogNftVotesInstance.address, true);
    });

    it("should mint new NFT, send old to DEAD address", async () => {
        await ogNftVotesInstance.mint();

        assert.equal(Number((await nftMockInstance.balanceOf(ADDR_DEAD)).toString()), 1);
        assert.equal(Number((await ogNftVotesInstance.totalSupply()).toString()), 1);
    });

    it("Should be able to mint NFTs when paused", async function () {
        await ogNftVotesInstance.pause();
        await ogNftVotesInstance.mint();

        assert.equal(Number((await nftMockInstance.balanceOf(ADDR_DEAD)).toString()), 1);
        assert.equal(Number((await ogNftVotesInstance.totalSupply()).toString()), 1);
    });

    // it should be able to mint after you pause and unpause
    it("Should mint NFT when paused and unpaused", async function () {
        await ogNftVotesInstance.pause();
        await ogNftVotesInstance.unpause();
        await ogNftVotesInstance.mint();

        assert.equal(Number((await nftMockInstance.balanceOf(ADDR_DEAD)).toString()), 1);
        assert.equal(Number((await ogNftVotesInstance.totalSupply()).toString()), 1);
    });

    // it shouldn't be able to transfer when paused
    it("Should not transfer NFT when paused", async function () {
        await ogNftVotesInstance.mint();
        await ogNftVotesInstance.pause();

        await expect(
            ogNftVotesInstance.transferFrom(owner, patron, 0)
        ).to.be.revertedWith("Contract is paused");
    });

    // owner should be able to change baseURI using setBaseURI method, test that uri is changed
    it("Should be able to change uri", async function () {
        await ogNftVotesInstance.mint();
        await ogNftVotesInstance.setBaseURI("https://example.com/");

        const uri = await ogNftVotesInstance.tokenURI(0);

        expect(uri).to.equal("https://example.com/0");
    });
});
