import {ethers} from "hardhat";
import {expect} from "chai";
import {SuAccessControlSingleton} from "../../typechain";
import {SignerWithAddress} from "hardhat-deploy-ethers/signers";
import deployProxy from "../utils/deploy";

describe("SuAccessControlSingleton", function () {
    let accounts: Record<string, SignerWithAddress>;
    let accessControlSingleton: SuAccessControlSingleton;
    let defaultAdminRole: string;

    const beforeAllFunc = async () => {
        const [deployer, dao, admin ] = await ethers.getSigners();
        accounts = { deployer, dao, admin };
        accessControlSingleton = await deployProxy(undefined, "SuAccessControlSingleton", [dao.address]) as SuAccessControlSingleton;
        defaultAdminRole = await accessControlSingleton.DEFAULT_ADMIN_ROLE();
    };


    describe("hasRole", function () {
        this.beforeAll(beforeAllFunc);
        it("DEFAULT_ADMIN_ROLE is as expected", async () => {
            expect(defaultAdminRole).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
        })

        it("deployer has DEFAULT_ADMIN_ROLE", async () => {
            expect(await accessControlSingleton.hasRole(defaultAdminRole, accounts.deployer.address)).to.be.false;
            expect(await accessControlSingleton.hasRole(defaultAdminRole, accounts.dao.address)).to.be.true;
        })

        it("can grant role", async () => {
            // deployer can't grant role
            let tx = accessControlSingleton.grantRole(defaultAdminRole, accounts.admin.address);
            await expect(tx).to.be.reverted;

            tx = accessControlSingleton.connect(accounts.dao).grantRole(defaultAdminRole, accounts.admin.address);
            await expect(tx).not.to.be.reverted;

            const isAdmin = await accessControlSingleton.hasRole(defaultAdminRole, accounts.admin.address);
            expect(isAdmin).to.be.true;
        })
    })
})
