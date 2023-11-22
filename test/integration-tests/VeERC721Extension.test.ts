import { deployments, ethers } from "hardhat";
import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ADDRESS_ZERO } from "../utils";
import { MockErc721Extended, SuAccessControlSingleton, VeERC721Extension } from "../../typechain-types";

describe("VeERC721Extension", () => {
    let accounts: Record<string, SignerWithAddress>;
    let accessControlSingleton: SuAccessControlSingleton;
    let mockErc721Extended: MockErc721Extended;
    let veERC721Extension: VeERC721Extension;

    beforeEach(async () => {
        const [deployer, admin, dao, alice, bob, carl] = await ethers.getSigners();
        accounts = { deployer, admin, dao, alice, bob, carl };

        await deployments.fixture(["Deployer"]);
        accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;
        mockErc721Extended = (await ethers.getContract("MockErc721Extended")) as MockErc721Extended;
        veERC721Extension = (await ethers.getContract("VeERC721Extension")) as VeERC721Extension;

        await accessControlSingleton
            .connect(dao)
            .grantRole(await veERC721Extension.SYSTEM_ROLE(), mockErc721Extended.address);
    });

    describe("check base assumptions about setup", function () {
        it("mockErc721Extended is mint-able", async () => {
            expect((await mockErc721Extended.veCNftExtension()).toString()).to.be.equal(veERC721Extension.address);

            const whitelistedTransferableAddresses = await veERC721Extension.whitelistedTransferableAddresses(
                ADDRESS_ZERO
            );
            expect(whitelistedTransferableAddresses).to.be.true;

            const isTransferPossible = await veERC721Extension.isTransferPossible(
                ADDRESS_ZERO,
                accounts.alice.address,
                0
            );
            expect(isTransferPossible).to.be.true;

            await mockErc721Extended.mint(accounts.alice.address);
        });

        it("freshly minted mockErc721Extended shouldn't be transferable", async () => {
            const tx1 = await mockErc721Extended.mint(accounts.alice.address);
            const tx2 = mockErc721Extended
                .connect(accounts.alice)
                .transferFrom(accounts.alice.address, accounts.bob.address, 0);
            await expect(tx2).to.be.reverted;
        });
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
            const tx2 = mockErc721Extended
                .connect(accounts.alice)
                .transferFrom(accounts.alice.address, accounts.bob.address, tokenId);
            await expect(tx2).not.to.be.reverted;
        });

        it("mockErc721Extended after several adminUnlock/lock should work correctly", async () => {
            const txResponse = await mockErc721Extended.mint(accounts.alice.address);
            const txReceipt = await txResponse.wait();
            const [TransferEvent] = txReceipt.events ?? [];
            const tokenId = TransferEvent?.args?.tokenId;

            // TODO: create special contractMock account to make such operations, because only contract can have this role
            await accessControlSingleton
                .connect(accounts.dao)
                .grantRole(await veERC721Extension.SYSTEM_ROLE(), accounts.admin.address);

            await veERC721Extension.connect(accounts.admin).adminUnlock(tokenId);
            await veERC721Extension.connect(accounts.admin).lock(tokenId);
            let tx = mockErc721Extended
                .connect(accounts.alice)
                .transferFrom(accounts.alice.address, accounts.bob.address, tokenId);
            await expect(tx).to.be.reverted;

            await veERC721Extension.connect(accounts.admin).adminUnlock(tokenId);
            tx = mockErc721Extended
                .connect(accounts.alice)
                .transferFrom(accounts.alice.address, accounts.bob.address, tokenId);
            await expect(tx).not.to.be.reverted;

            tx = mockErc721Extended
                .connect(accounts.bob)
                .transferFrom(accounts.bob.address, accounts.alice.address, tokenId);
            await expect(tx).not.to.be.reverted;
        });
    });

    describe("tests on voting logic", function () {
        it("default mint has voting power", async () => {
            await mockErc721Extended.mint(accounts.alice.address);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(1);
        });

        it("several tokens adds voting power", async () => {
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.alice.address);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(2);
        });

        it("unlock tokens lose voting power", async () => {
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.alice.address);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(2);
            await veERC721Extension.connect(accounts.admin).adminUnlock(0);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(1);
            await veERC721Extension.connect(accounts.admin).adminUnlock(1);
            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(0);
        });

        it("transfer of unlocked tokens don't affect voting power", async () => {
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.bob.address);
            await mockErc721Extended.mint(accounts.carl.address);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(1);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(1);

            await veERC721Extension.connect(accounts.admin).adminUnlock(0);
            await mockErc721Extended
                .connect(accounts.alice)
                .transferFrom(accounts.alice.address, accounts.bob.address, 0);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(1);

            await mockErc721Extended.connect(accounts.bob).transferFrom(accounts.bob.address, accounts.carl.address, 0);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(1);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(1);
        });

        async function mintAndDelegate() {
            await mockErc721Extended.mint(accounts.alice.address);
            await mockErc721Extended.mint(accounts.bob.address);
            await mockErc721Extended.mint(accounts.carl.address);
            await accessControlSingleton
                .connect(accounts.dao)
                .grantRole(await veERC721Extension.SYSTEM_ROLE(), accounts.admin.address);

            await veERC721Extension
                .connect(accounts.admin)
                .delegateOnBehalf(accounts.alice.address, accounts.carl.address);
            await veERC721Extension
                .connect(accounts.admin)
                .delegateOnBehalf(accounts.bob.address, accounts.carl.address);
        }

        it("delegate vote and check vote balances", async () => {
            await mintAndDelegate();

            expect(await veERC721Extension.getVotes(accounts.alice.address)).to.be.equal(0);
            expect(await veERC721Extension.getVotes(accounts.bob.address)).to.be.equal(0);
            expect(await veERC721Extension.getVotes(accounts.carl.address)).to.be.equal(3);
        });

        it("delegate+adminUnlock gives no voting power, and lock+delegate gives it back", async () => {
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
        });
    });

    describe("getTotalSupply", function () {
        it("returns total amount of votes", async function () {
            await mockErc721Extended.connect(accounts.admin).mint(accounts.alice.address);
            await mockErc721Extended.connect(accounts.admin).mint(accounts.bob.address);
            const tx = await mockErc721Extended.connect(accounts.admin).mint(accounts.carl.address);

            await expect(veERC721Extension.getPastTotalSupply((tx.blockNumber ?? 0) + 1)).to.be.revertedWith(
                "Votes: block not yet mined"
            );

            const totalSupply = await veERC721Extension.getTotalSupply();
            expect(totalSupply).to.be.equal(3);
        });
    });

    describe("init", function () {
        it("starts with zero votes", async function () {
            expect(await veERC721Extension.getTotalSupply()).to.be.equal(0);
        });
    });

    describe("performs voting operations", function () {
        it("delegates", async function () {
            await accessControlSingleton
                .connect(accounts.dao)
                .grantRole(await veERC721Extension.SYSTEM_ROLE(), accounts.admin.address);
            await veERC721Extension
                .connect(accounts.admin)
                .delegateOnBehalf(accounts.carl.address, accounts.bob.address);

            expect(await veERC721Extension.delegates(accounts.carl.address)).to.be.equal(accounts.bob.address);
        });
    });
});
