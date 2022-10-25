import {ethers, upgrades} from "hardhat";
import { expect } from "chai";
import {SuAccessControl, SuAccessControlSingleton} from "../../typechain";
import {SignerWithAddress} from "hardhat-deploy-ethers/signers";
import deployProxy from "../utils/deploy";

describe("SuAccessControlSingleton", function () {
    let accounts: Record<string, SignerWithAddress>;
    let accessControlSingleton: SuAccessControlSingleton;
    let defaultAdminRole: string;

    const beforeAllFunc = async () => {
        const [
            deployer,
            owner,
            alice,
            bob,
            carl,
        ] = await ethers.getSigners();
        accounts = {
            deployer,
            owner,
            alice,
            bob,
            carl,
        };
        accessControlSingleton = await deployProxy("SuAccessControlSingleton", []) as SuAccessControlSingleton;
        defaultAdminRole = await accessControlSingleton.DEFAULT_ADMIN_ROLE();
    };


    describe("hasRole", function () {
        this.beforeAll(beforeAllFunc);
        it("DEFAULT_ADMIN_ROLE is as expected", async () => {
            expect(defaultAdminRole).to.be.equal("0x0000000000000000000000000000000000000000000000000000000000000000");
        })

        it("deployer has DEFAULT_ADMIN_ROLE", async () => {
            const tx = await accessControlSingleton.hasRole(defaultAdminRole, accounts.deployer.address);
            expect(tx).to.be.true;
        })

        it("can grant role", async () => {
            const tx = accessControlSingleton.grantRole(defaultAdminRole, accounts.bob.address);
            await expect(tx).not.to.be.reverted;
            const tx2 = await accessControlSingleton.hasRole(defaultAdminRole, accounts.bob.address);
            expect(tx2).to.be.true;
        })
    })
})
