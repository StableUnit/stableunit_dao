import {deployments, ethers, getNamedAccounts} from "hardhat";
import {expect} from "chai";
import {SuAccessControlSingleton} from "../../typechain";

describe("checkOwnership", () => {
    let defaultAdminRole: string;
    let accessControlSingleton: SuAccessControlSingleton;

    beforeEach(async () => {
        // const network = await ethers.provider;
        // console.log("checkOwnership.test network =  ", network);
        accessControlSingleton = await ethers.getContract("SuAccessControlSingleton") as SuAccessControlSingleton;
        // console.log("accessControlSingleton = ", accessControlSingleton.address);
        defaultAdminRole = await accessControlSingleton.DEFAULT_ADMIN_ROLE();
        // console.log("defaultAdminRole = ", defaultAdminRole);
    });

    describe("SuAccessControlSingleton", () => {
        it("deployer doesn't have any roles", async () => {
            const {deployer} = await getNamedAccounts();
            expect(await accessControlSingleton.hasRole(defaultAdminRole, deployer)).to.be.false;
        });
    });
});
