// @ts-ignore
import {assert, web3, artifacts} from "hardhat";
import chai, {expect} from 'chai'
import {solidity} from "ethereum-waffle";
import {StableUnitDAOvcNFTInstance} from "../../types/truffle-contracts";

chai.use(solidity);

// @ts-ignore
const VCNft = artifacts.require("StableUnitDAOvcNFT");
const BN_1E18 = web3.utils.toBN(1e18);

describe("StableUnitDAO vcNFT", () => {
    let accounts: string[];
    let [owner, patron, alice, bob, carl]: string[] = [];
    let vcNftInstance: StableUnitDAOvcNFTInstance;

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        [owner, patron, alice, bob, carl] = accounts;
        vcNftInstance = await VCNft.new();
    });

    describe("mint", async () => {
        it("mint one", async () => {
            await vcNftInstance.mint(alice);
            assert.equal(Number((await vcNftInstance.balanceOf(alice)).toString()), 1);
        })

        it("mint two", async () => {
            await vcNftInstance.mint(alice);
            await vcNftInstance.mint(bob);
            assert.equal(Number((await vcNftInstance.balanceOf(alice)).toString()), 1);
            assert.equal(Number((await vcNftInstance.balanceOf(bob)).toString()), 1);
        })

        it("mint with id 1 user", async () => {
            await vcNftInstance.mintWithId(alice, 1000);
            assert.equal(Number((await vcNftInstance.tokenOfOwnerByIndex(alice, 0)).toString()), 1000);
        })

        it("mint with id 2 users", async () => {
            await vcNftInstance.mintWithId(alice, 1000);
            await vcNftInstance.mintWithId(bob, 2000);
            assert.equal(Number((await vcNftInstance.tokenOfOwnerByIndex(alice, 0)).toString()), 1000);
            assert.equal(Number((await vcNftInstance.tokenOfOwnerByIndex(bob, 0)).toString()), 2000);
        })

        it("should mint when paused", async () => {
            await vcNftInstance.pause();
            await vcNftInstance.mint(alice);
            assert.equal(Number((await vcNftInstance.balanceOf(alice)).toString()), 1);
        })

        it("should mint when paused and unpaused", async () => {
            await vcNftInstance.pause();
            await vcNftInstance.unpause();
            await vcNftInstance.mint(alice);
            assert.equal(Number((await vcNftInstance.balanceOf(alice)).toString()), 1);
        })
    });

    describe("pause", async () => {
        it("can't transfer when paused", async () => {
            await vcNftInstance.mint(alice);
            await vcNftInstance.pause();
            await expect(
                vcNftInstance.transferFrom(alice, bob, 0, {from: alice})
            ).to.be.revertedWith("Contract is paused");
        })

        it("immuned can transfer when paused", async () => {
            await vcNftInstance.mint(alice);
            await vcNftInstance.pause();
            await vcNftInstance.setPausedImmune(alice, true);
            await vcNftInstance.transferFrom(alice, bob, 0, {from: alice});
            assert.equal(Number((await vcNftInstance.balanceOf(alice)).toString()), 0);
            assert.equal(Number((await vcNftInstance.balanceOf(bob)).toString()), 1);
        })
    });

    describe("burn", async () => {

        it("burn(alice) by owner", async () => {
            await vcNftInstance.mint(alice);
            const id = await vcNftInstance.tokenOfOwnerByIndex(alice, 0);
            await vcNftInstance.burn(id);
            await expect(
                vcNftInstance.tokenOfOwnerByIndex(alice, 0)
            ).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");
        })

        it("burn(alice) by alice", async () => {
            await vcNftInstance.mint(alice);
            const id = await vcNftInstance.tokenOfOwnerByIndex(alice, 0);
            await vcNftInstance.burn(id, {from: alice});
            await expect(
                vcNftInstance.tokenOfOwnerByIndex(alice, 0)
            ).to.be.revertedWith("ERC721Enumerable: owner index out of bounds");
        })

        it("can't burn(alice) by bob", async () => {
            await vcNftInstance.mint(alice);
            const id = await vcNftInstance.tokenOfOwnerByIndex(alice, 0);
            await expect(
                 vcNftInstance.burn(id, {from: bob})
            ).to.be.revertedWith("ERC721Burnable: caller is not owner nor approved");
        })
    });
});
