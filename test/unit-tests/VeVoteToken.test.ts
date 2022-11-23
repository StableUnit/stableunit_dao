import {ethers, web3} from "hardhat";
import {expect} from 'chai'
import {BigNumber} from "ethers";
import {SignerWithAddress} from "hardhat-deploy-ethers/signers";

import {MockErc20, SuAccessControlSingleton, SuDAO, VeERC20, VeVoteToken} from "../../typechain";
import {increaseTime, latest} from "../utils/time";
import {ADDRESS_ZERO, BN_1E18} from "../utils";
import deployProxy from "../utils/deploy";

describe("VeVoteToken", () => {
    let deployer: SignerWithAddress,
        dao: SignerWithAddress,
        admin: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        user3: SignerWithAddress;

    let veVoteToken: VeVoteToken;

    beforeEach(async function () {
        [deployer, admin, dao, user1, user2, user3] = await ethers.getSigners();

        const accessControlSingleton = await deployProxy( "SuAccessControlSingleton", [admin.address, admin.address], undefined, false) as SuAccessControlSingleton;
    });

    describe("lockUnderVesting", async () => {
        it("should pull coins from the caller", async () => {

        })
    });
});
