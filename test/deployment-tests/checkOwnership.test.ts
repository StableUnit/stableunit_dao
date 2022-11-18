import {deployments, ethers, getNamedAccounts} from "hardhat";
import {expect} from "chai";
import {SuAccessControlSingleton} from "../../typechain";

describe("checkOwnership", () => {
    let defaultAdminRole: string;
    let accessControlSingleton: SuAccessControlSingleton;

    beforeEach(async () => {
        await deployments.fixture(["Deployer"]);
        accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
        defaultAdminRole = await accessControlSingleton.DEFAULT_ADMIN_ROLE();
    });

    describe("SuAccessControlSingleton", () => {
        it("deployer doesn't have any roles", async () => {
            const {deployer} = await getNamedAccounts();
            expect(await accessControlSingleton.hasRole(defaultAdminRole, deployer)).to.be.false;
        });
    });
});
