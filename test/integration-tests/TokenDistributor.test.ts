import {deployments, ethers, getNamedAccounts} from "hardhat";
import {ContractTransaction} from "ethers";
import {expect} from "chai";

import {MockErc721, SuAccessControlSingleton, SuDAO, SuDAOv2, TokenDistributor, VeERC20v2} from "../../typechain";
import {BN_1E18} from "../utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import deployProxy from "../utils/deploy";

describe("TokenDistributorV4", () => {
    let tx: ContractTransaction | Promise<ContractTransaction>;

    let distributor: TokenDistributor;
    let mockNft: MockErc721;
    let mockNft2: MockErc721;
    let suDAOOld: SuDAO;
    let suDAONew: SuDAOv2;
    let veERC20: VeERC20v2;
    let accessControlSingleton: SuAccessControlSingleton;

    let deployerSigner: SignerWithAddress;
    let daoSigner: SignerWithAddress;
    let adminSigner: SignerWithAddress;
    let randomSigner: SignerWithAddress;
    let userSigner: SignerWithAddress;
    let aliceSigner: SignerWithAddress;

    const sudaoToDistribute = BN_1E18.mul(1_000_000);

    const beforeAllFunc = async () => {
        const {
            deployer, dao, admin, randomAccount, userAccount, alice
        } = await getNamedAccounts();

        deployerSigner = await ethers.getSigner(deployer);
        daoSigner = await ethers.getSigner(dao);
        adminSigner = await ethers.getSigner(admin);
        userSigner = await ethers.getSigner(userAccount);
        aliceSigner = await ethers.getSigner(alice);
        randomSigner = await ethers.getSigner(randomAccount);

        await deployments.fixture(["Deployer"]);

        mockNft = await deployProxy("MockErc721", ["mock cNFT", "t_cNFT"]) as MockErc721;
        mockNft2 = await deployProxy("MockErc721", ["mock cNFT 2", "t_cNFT 2"]) as MockErc721;

        accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
        distributor = await ethers.getContract("TokenDistributor") as TokenDistributor;
        suDAOOld = await ethers.getContract("SuDAO") as SuDAO;
        suDAONew = await ethers.getContract("SuDAOv2") as SuDAOv2;
        veERC20 = await ethers.getContract("VeERC20v2") as VeERC20v2;

        // distributor should be able to call lockUnderVesting
        await accessControlSingleton.connect(daoSigner).grantRole(await distributor.ADMIN_ROLE(), distributor.address);
        await distributor.connect(daoSigner).updateNftRequirement(mockNft.address);
    };

    describe("initial tests", function () {
        this.beforeEach(beforeAllFunc);

        it("initial data is correct", async () => {
            expect(await distributor.nftRequirement()).to.be.equal(mockNft.address);
            expect(await distributor.SU_DAO()).to.be.equal(suDAONew.address);
            expect(await distributor.SU_DAO_OLD()).to.be.equal(suDAOOld.address);
            expect(await distributor.VE_ERC_20()).to.be.equal(veERC20.address);
        });
    });

    describe("Main flow is correct", function () {
        this.beforeEach(beforeAllFunc);

        it("user don't have nft", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.mul(2));

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);

            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;

            await mockNft2.mint(userSigner.address);

            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;
        });

        it("distributor don't have suDAO to distribute", async () => {
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.add(1));
            await mockNft.mint(userSigner.address);

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;
        });

        it("distributor don't have so much suDAO to distribute", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute);
            await mockNft.mint(userSigner.address);

            // user should receive sudaoToDistribute * 100 * 16 / 21
            const amount = sudaoToDistribute;
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;
        });

        it("user don't have approve", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.add(1));
            await mockNft.mint(userSigner.address);

            const amount = BN_1E18.mul(100);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;
        });

        it("distributor can change suDAO to veSuDAO", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute);
            await mockNft.mint(userSigner.address);

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).not.to.be.reverted;
        });

        it("distributor can change suDAO to veSuDAO properly", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.add(1));

            await mockNft.mint(userSigner.address);

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);

            const suDAOOldUserBalanceBefore = await suDAOOld.balanceOf(userSigner.address);
            const suDAOOldDistributorBalanceBefore = await suDAOOld.balanceOf(distributor.address);
            const suDAONewUserBalanceBefore = await suDAONew.balanceOf(userSigner.address);
            const suDAONewDistributorBalanceBefore = await suDAONew.balanceOf(distributor.address);
            const veSuDAOUserBalanceBefore = await veERC20.balanceOf(userSigner.address);
            const veSuDAODistributorBalanceBefore = await veERC20.balanceOf(distributor.address);

            await distributor.connect(userSigner).participate(amount);

            const suDAOOldUserBalanceAfter = await suDAOOld.balanceOf(userSigner.address);
            const suDAOOldDistributorBalanceAfter = await suDAOOld.balanceOf(distributor.address);
            const suDAONewUserBalanceAfter = await suDAONew.balanceOf(userSigner.address);
            const suDAONewDistributorBalanceAfter = await suDAONew.balanceOf(distributor.address);
            const veSuDAOUserBalanceAfter = await veERC20.balanceOf(userSigner.address);
            const veSuDAODistributorBalanceAfter = await veERC20.balanceOf(distributor.address);

            const outAmount = amount.mul(100).mul(16).div(21);

            // suDAO decreased for user
            expect(suDAOOldUserBalanceAfter).to.be.equal(suDAOOldUserBalanceBefore.sub(amount));
            // suDAO increased for distributor
            expect(suDAOOldDistributorBalanceAfter).to.be.equal(suDAOOldDistributorBalanceBefore.add(amount));

            expect(suDAONewUserBalanceBefore).to.be.equal(0);
            expect(suDAONewUserBalanceAfter).to.be.equal(0);
            // suDAOv2 decreased for distributor
            expect(suDAONewDistributorBalanceAfter).to.be.equal(suDAONewDistributorBalanceBefore.sub(outAmount));

            expect(veSuDAOUserBalanceBefore).to.be.equal(0);
            expect(veSuDAODistributorBalanceBefore).to.be.equal(0);
            expect(veSuDAODistributorBalanceAfter).to.be.equal(0);
            expect(veSuDAOUserBalanceAfter).to.be.equal(outAmount);
        });
    })
});
