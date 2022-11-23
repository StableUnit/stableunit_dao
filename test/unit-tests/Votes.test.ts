// @ts-ignore
import { BN } from '@openzeppelin/test-helpers';
import { expect } from 'chai';
import {SignerWithAddress} from "hardhat-deploy-ethers/signers";
import {Bonus, MockErc721Extended, SuAccessControlSingleton, VeERC721Extension} from "../../typechain";
import {ethers} from "hardhat";
import {deploy, deployProxy, getDeploymentAddress} from "../utils";
// @ts-ignore
import { shouldBehaveLikeVotes } from './Votes.behavior.js';

describe('Votes', function () {
    let deployer: SignerWithAddress,
      dao: SignerWithAddress,
      admin: SignerWithAddress,
      user1: SignerWithAddress,
      user2: SignerWithAddress,
      user3: SignerWithAddress;

    let veErc721Extension: VeERC721Extension;
    let mockErc721Extended: MockErc721Extended;

    this.beforeEach(async function () {
        [deployer, admin, dao, user1, user2, user3] = await ethers.getSigners();

        const accessControlSingleton = await deployProxy( "SuAccessControlSingleton", [admin.address, admin.address], undefined, false) as SuAccessControlSingleton;
        const bonus = await deployProxy("Bonus", [accessControlSingleton.address, admin.address], undefined, false) as Bonus;
        const veErc721ExtensionAddress = await getDeploymentAddress(deployer.address,2);
        mockErc721Extended = await deploy("MockErc721Extended", ["mock cNFT", "t_cNFT", veErc721ExtensionAddress], false) as MockErc721Extended;
        veErc721Extension = await deployProxy("VeERC721Extension", [accessControlSingleton.address, mockErc721Extended.address, bonus.address], undefined, false) as VeERC721Extension;

        await accessControlSingleton.connect(admin).grantRole(await veErc721Extension.SYSTEM_ROLE(), mockErc721Extended.address);

        this.accessControlSingleton = accessControlSingleton;
        this.votes = veErc721Extension;
        this.token = mockErc721Extended;
        this.name = "VeVoteToken";

        const network = await ethers.provider.getNetwork();
        this.chainId = network.chainId;
    });

    describe('getTotalSupply', function () {
        it('returns total amount of votes', async function () {
            await mockErc721Extended.connect(admin).mint(user1.address);
            await mockErc721Extended.connect(admin).mint(user2.address);
            const tx = await mockErc721Extended.connect(admin).mint(user3.address);

            await expect(
              this.votes.getPastTotalSupply((tx.blockNumber ?? 0) + 1)
            ).to.be.revertedWith("Votes: block not yet mined");

            const totalSupply = await veErc721Extension.getTotalSupply();
            expect(totalSupply).to.be.equal(3);
        });
    });

    describe('init', function () {
        it('starts with zero votes', async function () {
            expect(await this.votes.getTotalSupply()).to.be.equal(0);
        });
    });

    describe('performs voting operations', function () {
        it('delegates', async function () {
            await this.accessControlSingleton.connect(admin).grantRole(await this.votes.SYSTEM_ROLE(), admin.address);
            await this.votes.connect(admin).delegateOnBehalf(user3.address, user2.address);

            expect(await this.votes.delegates(user3.address)).to.be.equal(user2.address);
        });
    });

    describe('performs voting workflow', function () {
        beforeEach(async function () {
            this.account1Signer = user1;
            this.account1 = user1.address;
            this.account2 = user2.address;
            this.account1Delegatee = user2.address;
            this.NFT0 = new BN('10000000000000000000000000');
            this.NFT1 = new BN('10');
            this.NFT2 = new BN('20');
            this.NFT3 = new BN('30');
        });

        shouldBehaveLikeVotes();
    });
});