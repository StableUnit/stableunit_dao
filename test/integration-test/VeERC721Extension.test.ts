import {deployments, ethers, getNamedAccounts} from "hardhat";
import {ContractTransaction} from "ethers";
import {expect} from "chai";
import { run } from "hardhat";

import {ADDRESS_ZERO, BN_1E12, BN_1E18, BN_1E6} from "../utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {latest, waitNBlocks} from "../utils/time";
import {MockErc721, MockErc721Extended, VeERC20, VeERC721Extension} from "../../typechain";

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
            await expect(tx2).to.be.not.reverted;
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
            await expect(tx).to.be.not.reverted;

            tx = mockErc721Extended.connect(accounts.bob).transferFrom(accounts.bob.address, accounts.alice.address, tokenId);
            await expect(tx).to.not.reverted;
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
        // votings
        // check votes == balance
        // delegate vote and check new voteBalances
        // unclock and check vote balances
    })
});
