import {deployments, ethers} from "hardhat";
import { expect } from "chai";
import {SuAccessControlSingleton, TokenDistributorV4} from "../../typechain";
import deployProxy from "../utils/deploy";
import {BN_1E12, BN_1E18, BN_1E6} from "../utils";

describe("TokenDistributorV4", () => {
    let distributor: TokenDistributorV4;

    beforeEach(async () => {
        // console.log(await ethers.provider.getNetwork());
        await deployments.fixture(["TokenDistributorV4"]);
        distributor = await ethers.getContract("TokenDistributorV4") as TokenDistributorV4;
        // console.log(distributor);
    })

    describe("rewards are correct", () => {
        it("bonding curve give right amount of rewards", async () => {
            await distributor.setBondingCurve([
                BN_1E18.mul(9).div(10), // 1e18*0.9
                BN_1E18.mul(15).div(100).div(BN_1E6), // 1e18*0.15*1e-6
                BN_1E18.mul(15).div(100).div(BN_1E12), // 1e18*0.15*1e-12
            ]);

        })
    })
});
