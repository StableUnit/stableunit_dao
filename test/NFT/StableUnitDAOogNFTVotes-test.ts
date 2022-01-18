import { expect } from "chai";
import { ethers } from "hardhat";

describe("StableUnitDAO ogNFTVotes", () => {
    it("should mint new NFT, send old to DEAD address", async () => {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];

        const NftMock = await ethers.getContractFactory("NftMock");
        const nftMock = await NftMock.deploy("NFT mock", "mNFT");
        const SuDAOogVotes = await ethers.getContractFactory("StableUnitDAOogNFTVotes");
        const suDAOogVotes = await SuDAOogVotes.deploy(nftMock.address);
                    
        await nftMock.mint(owner.address);
        await nftMock.setApprovalForAll(suDAOogVotes.address, true);

        await suDAOogVotes.mint();

        await expect(await nftMock.balanceOf("0x000000000000000000000000000000000000dEaD")).to.equal(1);
        await expect(await suDAOogVotes.totalSupply()).to.equal(1);
    });

    it("Should be able to mint NFTs when paused", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];

        const NftMock = await ethers.getContractFactory("NftMock");
        const nftMock = await NftMock.deploy("NFT mock", "mNFT");
        const SuDAOogVotes = await ethers.getContractFactory("StableUnitDAOogNFTVotes");
        const suDAOogVotes = await SuDAOogVotes.deploy(nftMock.address);

        await nftMock.mint(owner.address);
        await nftMock.setApprovalForAll(suDAOogVotes.address, true);

        await suDAOogVotes.pause();
        await suDAOogVotes.mint();

        await expect(await nftMock.balanceOf("0x000000000000000000000000000000000000dEaD")).to.equal(1);
        await expect(await suDAOogVotes.totalSupply()).to.equal(1);
    });

    // it should be able to mint after you pause and unpause
    it("Should mint NFT when paused and unpaused", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];

        const NftMock = await ethers.getContractFactory("NftMock");
        const nftMock = await NftMock.deploy("NFT mock", "mNFT");
        const SuDAOogVotes = await ethers.getContractFactory("StableUnitDAOogNFTVotes");
        const suDAOogVotes = await SuDAOogVotes.deploy(nftMock.address);

        await nftMock.mint(owner.address);
        await nftMock.setApprovalForAll(suDAOogVotes.address, true);

        await suDAOogVotes.pause();
        await suDAOogVotes.unpause();
        await suDAOogVotes.mint();

        await expect(await nftMock.balanceOf("0x000000000000000000000000000000000000dEaD")).to.equal(1);
        await expect(await suDAOogVotes.totalSupply()).to.equal(1);
    });

    // it shouldn't be able to transfer when paused
    it("Should not transfer NFT when paused", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const NftMock = await ethers.getContractFactory("NftMock");
        const nftMock = await NftMock.deploy("NFT mock", "mNFT");
        const SuDAOogVotes = await ethers.getContractFactory("StableUnitDAOogNFTVotes");
        const suDAOogVotes = await SuDAOogVotes.deploy(nftMock.address);

        await nftMock.mint(owner.address);
        await nftMock.setApprovalForAll(suDAOogVotes.address, true);

        await suDAOogVotes.mint();
        await suDAOogVotes.pause();

        await expect(
            suDAOogVotes.transferFrom(owner.address, nonOwner.address, 0)
        ).to.be.revertedWith("Contract is paused");
    });

    // owner should be able to change baseURI using setBaseURI method, test that uri is changed
    it("Should be able to change uri", async function () {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const nonOwner = accounts[1];

        const NftMock = await ethers.getContractFactory("NftMock");
        const nftMock = await NftMock.deploy("NFT mock", "mNFT");
        const SuDAOogVotes = await ethers.getContractFactory("StableUnitDAOogNFTVotes");
        const suDAOogVotes = await SuDAOogVotes.deploy(nftMock.address);

        await nftMock.mint(owner.address);
        await nftMock.setApprovalForAll(suDAOogVotes.address, true);

        await suDAOogVotes.mint();

        await suDAOogVotes.setBaseURI("https://example.com/");

        const uri = await suDAOogVotes.tokenURI(0);

        expect(uri).to.equal("https://example.com/0");
    });
});
