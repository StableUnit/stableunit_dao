import {deployments, ethers, getNamedAccounts} from "hardhat";
import {ContractTransaction} from "ethers";
import {expect} from "chai";
import { run } from "hardhat";


import {BN_1E12, BN_1E18, BN_1E6} from "../utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {latest, waitNBlocks} from "../utils/time";
import {MockCNft, MockErc721} from "../../typechain";


describe("VeERC721Extension", () => {
    let accounts: Record<string, SignerWithAddress>;
    let mockCNft: MockCNft;

    beforeEach(async () => {
        const [deployer, admin, randomAccount] = await ethers.getSigners();
        accounts = { deployer, admin, randomAccount };

        await deployments.fixture(["Deployer"]);

        const mockCNftFactory = await ethers.getContractFactory("MockCNft");
        mockCNft = await mockCNftFactory.deploy() as MockCNft;
    })
    describe("check base assumption about setup", function () {
        it ("NFT is mint-able", async () => {
            await mockCNft.mint(accounts.randomAccount.address);
        })
        // mint and try to transfer
        // unlock and try to transfer
        // votings
        // check votes == balance
        // delegate vote and check new voteBalances
        // unclock and check vote balances

    });
});
