import {deployments, ethers, getNamedAccounts} from "hardhat";
import {ContractTransaction} from "ethers";
import {expect} from "chai";

import {
    MockErc721,
    SuAccessControlSingleton,
    SuDAO,
    SuDAOUpgrader,
    SuDAOv2,
    VeERC20v2
} from "../../typechain";
import {ADDRESS_ZERO, BN_1E18} from "../utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("SuDAOUpgrader", () => {
    let tx: ContractTransaction | Promise<ContractTransaction>;

    let distributor: SuDAOUpgrader;
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

        accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
        distributor = await ethers.getContract("SuDAOUpgrader") as SuDAOUpgrader;
        suDAOOld = await ethers.getContract("SuDAO") as SuDAO;
        suDAONew = await ethers.getContract("SuDAOv2") as SuDAOv2;
        veERC20 = await ethers.getContract("VeERC20v2") as VeERC20v2;

        // distributor should be able to call lockUnderVesting
        await accessControlSingleton.connect(daoSigner).grantRole(await distributor.ADMIN_ROLE(), distributor.address);
    };

    describe("initial tests", function () {
        this.beforeEach(beforeAllFunc);

        it("initial data is correct", async () => {
            expect(await distributor.SU_DAO()).to.be.equal(suDAONew.address);
            expect(await distributor.SU_DAO_OLD()).to.be.equal(suDAOOld.address);
            expect(await distributor.VE_ERC_20()).to.be.equal(veERC20.address);
        });
    });

    describe("Main flow is correct", function () {
        this.beforeEach(beforeAllFunc);

        it("distributor don't have suDAO to distribute", async () => {
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.add(1));

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;
        });

        it("distributor don't have so much suDAO to distribute", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute);

            // user should receive sudaoToDistribute * 100 * 16 / 21
            const amount = sudaoToDistribute;
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;
        });

        it("user don't have approve", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.add(1));

            const amount = BN_1E18.mul(100);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).to.be.reverted;
        });

        it("distributor can change suDAO to veSuDAO", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute);

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);
            tx = distributor.connect(userSigner).participate(amount);
            await expect(tx).not.to.be.reverted;
        });

        it("distributor can change suDAO to veSuDAO properly", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.add(1));

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

    });

    describe.only("adminWithdraw", function () {
        this.beforeEach(beforeAllFunc);

        it("Admin can withdraw suDAO old", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.mul(2));

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);

            await distributor.connect(userSigner).participate(amount);

            const suDAOOldDistributorBalanceBefore = await suDAOOld.balanceOf(distributor.address);
            const suDAOOldDaoBalanceBefore = await suDAOOld.balanceOf(daoSigner.address);

            await distributor.connect(daoSigner).adminWithdraw(suDAOOld.address);

            const suDAOOldDistributorBalanceAfter = await suDAOOld.balanceOf(distributor.address);
            const suDAOOldDaoBalanceAfter = await suDAOOld.balanceOf(daoSigner.address);

            expect(suDAOOldDistributorBalanceBefore).to.be.equal(amount);
            expect(suDAOOldDistributorBalanceAfter).to.be.equal(0);
            expect(suDAOOldDaoBalanceAfter).to.be.equal(suDAOOldDaoBalanceBefore.add(amount));
        });

        it("Admin can withdraw suDAO new with no participate", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);

            const suDAONewDistributorBalanceBefore = await suDAONew.balanceOf(distributor.address);
            const suDAONewDaoBalanceBefore = await suDAONew.balanceOf(daoSigner.address);

            await distributor.connect(daoSigner).adminWithdraw(suDAONew.address);

            const suDAONewDistributorBalanceAfter = await suDAONew.balanceOf(distributor.address);
            const suDAONewDaoBalanceAfter = await suDAONew.balanceOf(daoSigner.address);

            expect(suDAONewDistributorBalanceBefore).to.be.equal(sudaoToDistribute);
            expect(suDAONewDistributorBalanceAfter).to.be.equal(0);
            expect(suDAONewDaoBalanceAfter).to.be.equal(suDAONewDaoBalanceBefore.add(sudaoToDistribute));
        });

        it("Admin can withdraw suDAO new with participate", async () => {
            await suDAONew.connect(daoSigner).mint(distributor.address, sudaoToDistribute);
            await suDAOOld.connect(daoSigner).mint(userSigner.address, sudaoToDistribute.mul(2));

            const amount = BN_1E18.mul(100);
            await suDAOOld.connect(userSigner).approve(distributor.address, amount);

            await distributor.connect(userSigner).participate(amount);

            const suDAONewDistributorBalanceBefore = await suDAONew.balanceOf(distributor.address);
            const suDAONewDaoBalanceBefore = await suDAONew.balanceOf(daoSigner.address);

            await distributor.connect(daoSigner).adminWithdraw(suDAONew.address);

            const suDAONewDistributorBalanceAfter = await suDAONew.balanceOf(distributor.address);
            const suDAONewDaoBalanceAfter = await suDAONew.balanceOf(daoSigner.address);

            const outAmount = amount.mul(100).mul(16).div(21);
            expect(suDAONewDistributorBalanceBefore).to.be.equal(sudaoToDistribute.sub(outAmount));
            expect(suDAONewDistributorBalanceAfter).to.be.equal(0);
            expect(suDAONewDaoBalanceAfter).to.be.equal(suDAONewDaoBalanceBefore.add(sudaoToDistribute.sub(outAmount)));
        });
    });
});
