import {deployments, ethers} from "hardhat";
import {expect} from "chai";

import {ADDRESS_ZERO} from "../utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {MockErc721Extended, VeERC721Extension} from "../../typechain";

describe("VeERC721Extension", () => {
    let accounts: Record<string, SignerWithAddress>;
    let mockErc721Extended: MockErc721Extended;
    let veERC721Extension: VeERC721Extension;

    beforeEach(async () => {
        const [deployer, admin, alice, bob, carl] = await ethers.getSigners();
        accounts = {deployer, admin, alice, bob, carl};

        await deployments.fixture(["Deployer"]);
        mockErc721Extended = await ethers.getContract("MockErc721Extended") as MockErc721Extended;
        veERC721Extension = await ethers.getContract("VeERC721Extension") as VeERC721Extension;
    })

    describe("check base assumptions about setup", function () {
        it("mockErc721Extended is mint-able", async () => {
            expect((await mockErc721Extended.veCNftExtension()).toString()).to.be.equal(veERC721Extension.address);

            const whitelistedTransferableAddresses = await veERC721Extension.whitelistedTransferableAddresses(ADDRESS_ZERO);
            expect(whitelistedTransferableAddresses).to.be.true;

            const isTransferPossible = await veERC721Extension.isTransferPossible(ADDRESS_ZERO, accounts.alice.address, 0)
            expect(isTransferPossible).to.be.true;

            await mockErc721Extended.mint(accounts.alice.address);
        })

        it("freshly minted mockErc721Extended shouldn't be transferable", async () => {
            const tx1 = await mockErc721Extended.mint(accounts.alice.address);
            const tx2 = mockErc721Extended.connect(accounts.alice).transferFrom(accounts.alice.address, accounts.bob.address, 0);
            await expect(tx2).to.be.reverted;
        })
    });

    describe("test lock/unlock logic", function () {
        it("mockErc721Extended after adminUnlock should be transferable", async () => {
            const txResponse = await mockErc721Extended.mint(accounts.alice.address);
            const txReceipt = await txResponse.wait();
            const [TransferEvent] = txReceipt.events ?? [];
            // console.log("TransferEvent = ", TransferEvent);
            const tokenId = TransferEvent?.args?.tokenId;
            // console.log("tokenId = ", tokenId.toString());
            expect(await mockErc721Extended.ownerOf(tokenId)).to.be.equal(accounts.alice.address);

            await veERC721Extension.connect(accounts.admin).adminUnlock(tokenId);
            const tx2 = mockErc721Extended.connect(accounts.alice).transferFrom(accounts.alice.address, accounts.bob.address, tokenId);
            await expect(tx2).not.to.be.reverted;
        })

        it("mockErc721Extended after several adminUnlock/lock should work correctly", async () => {
            const txResponse = await mockErc721Extended.mint(accounts.alice.address);
            const txReceipt = await txResponse.wait();
            const [TransferEvent] = txReceipt.events ?? [];
            const tokenId = TransferEvent?.args?.tokenId;

            await veERC721Extension.connect(accounts.admin).adminUnlock(tokenId);
            await veERC721Extension.connect(accounts.admin).lock(tokenId);
            let tx = mockErc721Extended.connect(accounts.alice).transferFrom(accounts.alice.address, accounts.bob.address, tokenId);
            await expect(tx).to.be.reverted;

            await veERC721Extension.connect(accounts.admin).adminUnlock(tokenId);
            tx = mockErc721Extended.connect(accounts.alice).transferFrom(accounts.alice.address, accounts.bob.address, tokenId);
            await expect(tx).not.to.be.reverted;

            tx = mockErc721Extended.connect(accounts.bob).transferFrom(accounts.bob.address, accounts.alice.address, tokenId);
            await expect(tx).not.to.be.reverted;
        })
    })

    describe("tests on voting logic", function () {
        it("default mint has voting power", async () =>{
            await mockErc721Extended.mint(accounts.alice.address);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(1);
        })

        it("several tokens adds voting power", async () =>{
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.alice.address);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(2);
        })

        it ("unlock tokens lose voting power", async () => {
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.alice.address);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(2);
            await veERC721Extension.connect(accounts.admin).adminUnlock(0);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(1);
            await veERC721Extension.connect(accounts.admin).adminUnlock(1);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(0);
        })

        it ("transfer of unlocked tokens don't affect voting power", async () => {
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.bob.address);
            await mockErc721Extended.mint(accounts.carl.address);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(1);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(1);

            await veERC721Extension.connect(accounts.admin).adminUnlock(0);
            await mockErc721Extended.connect(accounts.alice).transferFrom(accounts.alice.address, accounts.bob.address, 0);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(1);

            await mockErc721Extended.connect(accounts.bob).transferFrom(accounts.bob.address, accounts.carl.address, 0);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(1);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(1);
        })

        async function mintAndDelegate() {
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.bob.address);
            await mockErc721Extended.mint(accounts.carl.address);
            await veERC721Extension.connect(accounts.alice).delegate(accounts.carl.address);
            await veERC721Extension.connect(accounts.bob).delegate(accounts.carl.address);
        }

        it("delegate vote and check vote balances", async () => {
            await mintAndDelegate();

            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(0);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(0);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(3);
        })

        it( "delegate+adminUnlock gives no voting power, and lock+delegate gives it back", async () => {
            await mintAndDelegate();

            await veERC721Extension.connect(accounts.admin).adminUnlock(0);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(2);

            await veERC721Extension.connect(accounts.admin).adminUnlock(1);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(1);

            await veERC721Extension.connect(accounts.admin).adminUnlock(2);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(0);

            await veERC721Extension.connect(accounts.admin).lock(2);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(1);

            await veERC721Extension.connect(accounts.admin).lock(1);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(2);

            await veERC721Extension.connect(accounts.admin).lock(0);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(3);
        })
    })
});
