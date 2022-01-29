import { expect } from "chai";
import { ethers } from "hardhat";
import {NftMockInstance, StableUnitDAOvcNFTVotesInstance} from "../../types/truffle-contracts";

const MockNft = artifacts.require("NftMock");
const VCNftVotes = artifacts.require("StableUnitDAOvcNFTVotes");

describe("StableUnitDAO vcNFTVotes", () => {
    let accounts: string[];
    let [owner, patron, alice, bob, carl]: string[] = [];
    let nftMockInstance: NftMockInstance;
    let vcNftVotesInstance: StableUnitDAOvcNFTVotesInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;
        nftMockInstance = await MockNft.new("NFT mock", "mNFT");
        vcNftVotesInstance = await VCNftVotes.new(nftMockInstance.address);

        await nftMockInstance.mint(owner);
        await nftMockInstance.setApprovalForAll(vcNftVotesInstance.address, true);
    });

    it("should mint new NFT, burn old one", async () => {
        await vcNftVotesInstance.mint();

        assert.equal(Number((await nftMockInstance.totalSupply()).toString()), 0);
        assert.equal(Number((await vcNftVotesInstance.totalSupply()).toString()), 1);
    });

    it("Should be able to mint NFTs when paused", async function () {
        await vcNftVotesInstance.pause();
        await vcNftVotesInstance.mint();

        assert.equal(Number((await vcNftVotesInstance.totalSupply()).toString()), 1);
    });

    // it should be able to mint after you pause and unpause
    it("Should mint NFT when paused and unpaused", async function () {
        await vcNftVotesInstance.pause();
        await vcNftVotesInstance.unpause();
        await vcNftVotesInstance.mint();

        assert.equal(Number((await vcNftVotesInstance.totalSupply()).toString()), 1);
    });

    // it shouldn't be able to transfer when paused
    it("Should not transfer NFT when paused", async function () {
        await vcNftVotesInstance.mint();
        await vcNftVotesInstance.pause();

        await expect(
            vcNftVotesInstance.transferFrom(owner, patron, 0)
        ).to.be.revertedWith("Contract is paused");
    });

    // owner should be able to change baseURI using setBaseURI method, test that uri is changed
    it("Should be able to change uri", async function () {
        await vcNftVotesInstance.mint();
        await vcNftVotesInstance.setBaseURI("https://example.com/");

        const uri = await vcNftVotesInstance.tokenURI(0);

        expect(uri).to.equal("https://example.com/0");
    });
});
