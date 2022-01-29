// @ts-ignore
import {assert, web3, artifacts} from "hardhat";
import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
import {NftMockInstance, StableUnitDAOaNFTVotesInstance} from "../../types/truffle-contracts";

chai.use(solidity);

// @ts-ignore
const MockNft = artifacts.require("NftMock");
const AdvisorNftVotes = artifacts.require("StableUnitDAOaNFTVotes");

const BN_1E18 = web3.utils.toBN(1e18);

describe("StableUnitDAO aNFTVotes", () => {
    let accounts: string[];
    let [owner, patron, alice, bob, carl]: string[] = [];
    let nftMockInstance: NftMockInstance;
    let aNftVotesInstance: StableUnitDAOaNFTVotesInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;
        nftMockInstance = await MockNft.new("NFT mock", "mNFT");
        aNftVotesInstance = await AdvisorNftVotes.new(nftMockInstance.address);

        await nftMockInstance.mint(alice);
        await nftMockInstance.setApprovalForAll(aNftVotesInstance.address, true, {from: alice});
        await aNftVotesInstance.mint({from: alice});
    });

    describe("getLevel", async () => {
        it("insertLevel & decodeLevel", async () => {
            const id = await aNftVotesInstance.insertLevelToId(0, 1234);
            assert.equal(Number((await aNftVotesInstance.extractLevelFromId(id)).toString()), 1234);

            const id2 = await aNftVotesInstance.insertLevelToId(0, 10_000);
            assert.equal(Number((await aNftVotesInstance.extractLevelFromId(id2)).toString()), 10_000);
        })
    });

    describe("mint", async () => {
        it("mint one", async () => {
            assert.equal(Number((await nftMockInstance.totalSupply()).toString()), 0);
            assert.equal(Number((await aNftVotesInstance.totalSupply()).toString()), 1);
        })
    });

    describe("pause", async () => {
        it("can't transfer when paused", async () => {
            await aNftVotesInstance.pause();
            await expect(
                aNftVotesInstance.transferFrom(alice, bob, 0, {from: alice})
            ).to.be.revertedWith("Contract is paused");
        })

        it("immuned can transfer when paused", async () => {
            await aNftVotesInstance.pause();
            await aNftVotesInstance.setPausedImmune(alice, true);
            await aNftVotesInstance.transferFrom(alice, bob, 0, {from: alice});
            assert.equal(Number((await aNftVotesInstance.balanceOf(alice)).toString()), 0);
            assert.equal(Number((await aNftVotesInstance.balanceOf(bob)).toString()), 1);
        })

        it("Should be able to mint NFTs when paused", async function () {
            await aNftVotesInstance.pause();

            await nftMockInstance.mint(alice);
            await aNftVotesInstance.mint({from: alice});

            assert.equal(Number((await aNftVotesInstance.totalSupply()).toString()), 2);
        });

        // it should be able to mint after you pause and unpause
        it("Should mint NFT when paused and unpaused", async function () {
            await aNftVotesInstance.pause();
            await aNftVotesInstance.unpause();
            await nftMockInstance.mint(alice);
            await aNftVotesInstance.mint({from: alice});

            assert.equal(Number((await aNftVotesInstance.totalSupply()).toString()), 2);
        });
    });

    describe("burn", async () => {

        it("burn(alice) by owner", async () => {
            const id = await aNftVotesInstance.tokenOfOwnerByIndex(alice, 0);
            await aNftVotesInstance.burn(id);
            await expect(
                aNftVotesInstance.tokenOfOwnerByIndex(alice, 0)
            ).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");
        })

        it("burn(alice) by alice", async () => {
            const id = await aNftVotesInstance.tokenOfOwnerByIndex(alice, 0);
            await aNftVotesInstance.burn(id, {from: alice});
            await expect(
                aNftVotesInstance.tokenOfOwnerByIndex(alice, 0)
            ).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");
        })

        it("can't burn(alice) by bob", async () => {
            const id = await aNftVotesInstance.tokenOfOwnerByIndex(alice, 0);
            await expect(
                 aNftVotesInstance.burn(id, {from: bob})
            ).to.be.revertedWith("ERC721Burnable: caller is not owner nor approved");
        })
    });

    describe("uri", async () => {
        // owner should be able to change baseURI using setBaseURI method, test that uri is changed
        it("Should be able to change uri", async function () {
            await aNftVotesInstance.setBaseURI("https://example.com/");

            const uri = await aNftVotesInstance.tokenURI(0);

            expect(uri).to.equal("https://example.com/0");
        });
    });
});
