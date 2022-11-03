import { expect } from "chai";
import { ethers } from "hardhat";

describe("StableUnitDAO ogNFT", function () {
    it("Should mint 3 NFT for three different accounts when called from owner account", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const user1 = accounts[1];
        const user2 = accounts[2];
        const user3 = accounts[3];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        const tokenId = await stableUnit.totalSupply();
        await expect(stableUnit.tokenURI(tokenId)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");

        await stableUnit.adminMint(user1.address);
        await stableUnit.adminMint(user2.address);
        await stableUnit.adminMint(user3.address);

        await expect(await stableUnit.totalSupply()).to.equal(3);
    });

    it("Should not mint NFT when called from non-owner account", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        const tokenId = await stableUnit.totalSupply();
        await expect(stableUnit.tokenURI(tokenId)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");

        await expect(
            stableUnit.connect(nonOwner).adminMint(nonOwner.address)
        ).to.be.reverted;
    });

    // should be able to pause transfers, check that transfer reverts when paused
    it("Should not mint NFT when paused", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        await stableUnit.pause();

        await stableUnit.connect(owner).adminMint(owner.address)

        // except total supply to be 1
        expect(await stableUnit.totalSupply()).to.equal(1);

    });

    // it should be able to mint after you pause and unpause
    it("Should mint NFT when paused and unpaused", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        await stableUnit.pause();

        // await stableUnit.adminMint(owner.address);

        await stableUnit.unpause();

        await stableUnit.adminMint(owner.address);

    });

    // it shouldn't be able to transfer when paused
    it("Should not transfer NFT when paused", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        await stableUnit.adminMint(owner.address);

        await stableUnit.pause();

        await expect(
            stableUnit.transferFrom(owner.address, nonOwner.address, 0)
        ).to.be.revertedWith("Contract is paused");

    });

    // NFT owner should be able to invite someone else
    xit("Should be able to invite someone else", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        await stableUnit.adminMint(owner.address);

        await stableUnit.invite(nonOwner.address);

        // check that nonOwner has NFT now
        const balance = await stableUnit.balanceOf(nonOwner.address);

        expect(balance).to.equal(1);
    })

    // test that when owner invites somebody, they can invite someone else
    xit("invite nonOwner, and test that he is able to invite someone else", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];
        const nonOwner2 = accounts[2];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        await stableUnit.adminMint(owner.address);

        await stableUnit.invite(nonOwner.address);

        await stableUnit.connect(nonOwner).invite(nonOwner2.address);

        // check that nonOwner has NFT now
        const balance = await stableUnit.balanceOf(nonOwner.address);

        expect(balance).to.equal(1);

        // check that nonOwner2 has NFT now
        const balance2 = await stableUnit.balanceOf(nonOwner2.address);

        expect(balance2).to.equal(1);
    });

    // owner should be able to change baseURI using setBaseURI method, test that uri is changed
    it("Should be able to change uri", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        await stableUnit.adminMint(owner.address);

        await stableUnit.setBaseURI("https://example.com/");

        const uri = await stableUnit.tokenURI(0);

        expect(uri).to.equal("https://example.com/0");
    });

    // it should mint successfully using adminMintBatch given array of 10 different addresses from accounts
    it("Should be able to mint 10 NFTs", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        const recipients = accounts.slice(1, 11).map(a => a.address)

        const tx = await stableUnit.adminMintBatch(recipients);

        await tx.wait();

        const total = await stableUnit.totalSupply();

        expect(total).to.equal(10);
    });

    // test adminMintBatch with 150 random addresses
    it("Should be able to mint 150 NFTs", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        const recipients = [];

        for (let i = 0; i < 150; i++) {
            recipients.push(ethers.Wallet.createRandom().address);
        }

        const tx = await stableUnit.adminMintBatch(recipients);

        await tx.wait();

        const total = await stableUnit.totalSupply();

        expect(total).to.equal(150);
    });

    // it should allow minting even if the contract is paused
    it("Should be able to mint NFTs when paused", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];

        const StableUnit = await ethers.getContractFactory("StableUnitDAOogNFT");

        const stableUnit = await StableUnit.deploy();

        await stableUnit.adminMint(owner.address);

        await stableUnit.pause();

        await stableUnit.adminMint(owner.address);

        const total = await stableUnit.totalSupply();

        expect(total).to.equal(2);
    });

});
