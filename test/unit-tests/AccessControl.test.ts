import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import deployProxy from "../utils/deploy";
import { SuAccessControlSingleton } from "../../contracts/periphery/typechain-types";

describe("SuAccessControlSingleton", function () {
    let accounts: Record<string, SignerWithAddress>;
    let accessControlSingleton: SuAccessControlSingleton;
    let defaultAdminRole: string;
    let daoRole: string;

    const beforeAllFunc = async () => {
        const [deployer, admin, dao] = await ethers.getSigners();
        accounts = { deployer, dao, admin };
        accessControlSingleton = (await deployProxy("SuAccessControlSingleton", [
            dao.address,
        ])) as SuAccessControlSingleton;
        defaultAdminRole = await accessControlSingleton.DEFAULT_ADMIN_ROLE();
        daoRole = await accessControlSingleton.DAO_ROLE();
    };

    describe("hasRole", function () {
        this.beforeAll(beforeAllFunc);
        it("DEFAULT_ADMIN_ROLE is as expected", async () => {
            expect(defaultAdminRole).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
        });

        it("deployer has DEFAULT_ADMIN_ROLE", async () => {
            expect(await accessControlSingleton.hasRole(defaultAdminRole, accounts.deployer.address)).to.be.true;
            expect(await accessControlSingleton.hasRole(defaultAdminRole, accounts.dao.address)).to.be.false;
            expect(await accessControlSingleton.hasRole(daoRole, accounts.dao.address)).to.be.true;
        });

        it("can grant role", async () => {
            let isAdmin = await accessControlSingleton.hasRole(defaultAdminRole, accounts.admin.address);
            expect(isAdmin).to.be.false;

            // deployer can't grant role
            let tx = accessControlSingleton.grantRole(defaultAdminRole, accounts.admin.address);
            await expect(tx).to.be.reverted;

            tx = accessControlSingleton.connect(accounts.dao).grantRole(defaultAdminRole, accounts.admin.address);
            await expect(tx).not.to.be.reverted;

            isAdmin = await accessControlSingleton.hasRole(defaultAdminRole, accounts.admin.address);
            expect(isAdmin).to.be.true;
        });
    });
});
