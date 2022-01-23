// @ts-ignore
import {assert, web3, artifacts} from "hardhat";
import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
import {StableUnitDAOaNFTInstance} from "../../types/truffle-contracts";

chai.use(solidity);

// @ts-ignore
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");

const BN_1E18 = web3.utils.toBN(1e18);


describe("StableUnitDAO aNFT", () => {
    let accounts: string[];
    let [owner, patron, alice, bob, carl]: string[] = [];
    let aNftInstance: StableUnitDAOaNFTInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;
        aNftInstance = await AdvisorNft.new();
    });

    describe("getLevel", async () => {
        it("insertLevel & decodeLevel", async () => {
            const id = await aNftInstance.insertLevelToId(0, 1234);
            assert.equal(Number((await aNftInstance.extractLevelFromId(id)).toString()), 1234);

            const id2 = await aNftInstance.insertLevelToId(0, 10_000);
            assert.equal(Number((await aNftInstance.extractLevelFromId(id2)).toString()), 10_000);
        })

        it("mint(alice, 1000)", async () => {
            await aNftInstance.mintWithLevel(alice, 1000);
            // console.log("alice[0] = ", (await aNftInstance.tokenOfOwnerByIndex(alice, 0)).toString());
            assert.equal(Number((await aNftInstance.getLevel(alice)).toString()), 1000);
        })

        it("mint(alice, 1234)", async () => {
            await aNftInstance.mintWithLevel(alice, 1234);
            assert.equal(Number((await aNftInstance.getLevel(alice)).toString()), 1234);
        })

        it("mint(alice, 12345 > base_level) should throw an error", async () => {
            await expect(
                aNftInstance.mintWithLevel(alice, 12345)
            ).to.be.revertedWith("invalid level");
        })

        it("mint(alice, 100 < base_level) should throw an error", async () => {
            await expect(
                aNftInstance.mintWithLevel(alice, 123)
            ).to.be.revertedWith("invalid level");
        })

    });

    describe("mintBatch", async () => {
        it("mint one", async () => {
            await aNftInstance.mintBatchWithLevel([alice], [1000]);
            assert.equal(Number((await aNftInstance.getLevel(alice)).toString()), 1000);
        })

        it("mint two", async () => {
            await aNftInstance.mintBatchWithLevel([alice, bob], [1000, 1234]);
            assert.equal(Number((await aNftInstance.getLevel(alice)).toString()), 1000);
            assert.equal(Number((await aNftInstance.getLevel(bob)).toString()), 1234);
        })

        it("mint 2 users 1 level", async () => {
            await expect(
                aNftInstance.mintBatchWithLevel([alice, bob], [1000])
            ).to.be.revertedWith("|users| != |levels|");
        })

        it("mint 1 user 2 levels", async () => {
            await expect(
                aNftInstance.mintBatchWithLevel([alice], [1000, 1234])
            ).to.be.revertedWith("|users| != |levels|");
        })

        it("mint with wrong level", async () => {
            await expect(
                aNftInstance.mintBatchWithLevel([alice, bob], [1000, 12345])
            ).to.be.revertedWith("invalid level");
        })
    });

    describe("pause", async () => {
        it("can't transfer when paused", async () => {
            await aNftInstance.mint(alice, 1);
            await aNftInstance.pause();
            await expect(
                aNftInstance.transferFrom(alice, bob, 1, {from: alice})
            ).to.be.revertedWith("Contract is paused");
        })

        it("immuned can transfer when paused", async () => {
            await aNftInstance.mint(alice, 1);
            await aNftInstance.pause();
            await aNftInstance.setPausedImmune(alice, true);
            await aNftInstance.transferFrom(alice, bob, 1, {from: alice});
            assert.equal(Number((await aNftInstance.balanceOf(alice)).toString()), 0);
            assert.equal(Number((await aNftInstance.balanceOf(bob)).toString()), 1);
        })
    });

    describe("burn", async () => {

        it("burn(alice, 1000) by owner", async () => {
            await aNftInstance.mintWithLevel(alice, 1000);
            const id = await aNftInstance.tokenOfOwnerByIndex(alice, 0);
            await aNftInstance.burn(id);
            await expect(
                aNftInstance.tokenOfOwnerByIndex(alice, 0)
            ).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");
        })

        it("burn(alice, 1000) by alice", async () => {
            await aNftInstance.mintWithLevel(alice, 1000);
            const id = await aNftInstance.tokenOfOwnerByIndex(alice, 0);
            await aNftInstance.burn(id, {from: alice});
            await expect(
                aNftInstance.tokenOfOwnerByIndex(alice, 0)
            ).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");
        })

        it("can't burn(alice, 1000) by bob", async () => {
            await aNftInstance.mintWithLevel(alice, 1000);
            const id = await aNftInstance.tokenOfOwnerByIndex(alice, 0);
            await expect(
                 aNftInstance.burn(id, {from: bob})
            ).to.be.revertedWith("ERC721Burnable: caller is not owner nor approved");
        })


    });

});



