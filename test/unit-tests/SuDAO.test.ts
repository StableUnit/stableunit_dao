import { ethers, web3 } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

import { BigNumber } from "ethers";
import { increaseTime, latest } from "../utils/time";
import { ADDRESS_ZERO, BN_1E18 } from "../utils";
import deployProxy from "../utils/deploy";
// @ts-ignore
import { shouldBehaveLikeERC20 } from "../3rd-party/openzeppelin/token/ERC20/ERC20.behavior.js";
import { MockErc20, SuAccessControlSingleton, SuDAOv2 } from "../../typechain-types";

describe("SuDAO", () => {
    let deployer: SignerWithAddress;
    let dao: SignerWithAddress;
    let admin: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;

    let accessControlSingleton: SuAccessControlSingleton;
    let suDAO: SuDAOv2;

    const MAX_SUPPLY = 16_000_000 * 100;
    const MAX_POST_VESTING_INFLATION = 5_000_000 * 100;
    const MIN_FULLY_DILUTED_VESTING = 4 * 365 * 24 * 60 * 60;
    let DEPLOY_TIME: number;

    beforeEach(async function () {
        [deployer, admin, dao, user1, user2] = await ethers.getSigners();

        accessControlSingleton = (await deployProxy(
            "SuAccessControlSingleton",
            [admin.address],
            undefined,
            false
        )) as SuAccessControlSingleton;
        suDAO = (await (await ethers.getContractFactory("SuDAOv2")).deploy(accessControlSingleton.address)) as SuDAOv2;
        DEPLOY_TIME = await latest();
    });

    describe("checkGlobalVars", async () => {
        it("all global vars should be correct", async () => {
            expect(await suDAO.MAX_SUPPLY()).to.be.equal(BN_1E18.mul(MAX_SUPPLY));
            expect(await suDAO.MAX_POST_VESTING_INFLATION()).to.be.equal(BN_1E18.mul(MAX_POST_VESTING_INFLATION));
            expect(await suDAO.MIN_FULLY_DILUTED_VESTING()).to.be.equal(MIN_FULLY_DILUTED_VESTING);
            expect(await suDAO.DEPLOY_TIME()).to.be.equal(DEPLOY_TIME);
        });
    });

    describe("mint", async () => {
        it("access", async () => {
            await expect(suDAO.connect(deployer).mint(deployer.address, 100)).to.be.reverted;
            await expect(suDAO.connect(dao).mint(dao.address, 100)).to.be.reverted;
            await expect(suDAO.connect(user1).mint(user1.address, 100)).to.be.reverted;
            await expect(suDAO.connect(admin).mint(admin.address, 100)).not.to.be.reverted;
            await expect(suDAO.connect(admin).mint(user1.address, 100)).not.to.be.reverted;
        });

        it("before vesting max", async () => {
            await suDAO.connect(admin).mint(admin.address, BN_1E18.mul(9)); // 9 * 1e18 minted in total
            await suDAO.connect(admin).mint(user1.address, BN_1E18); // 10 * 1e18 minted in total
            await suDAO.connect(admin).mint(deployer.address, BN_1E18.mul(MAX_SUPPLY - 10)); // MAX_SUPPLY * 1e18 minted in total
            await expect(suDAO.connect(admin).mint(user1.address, 1)).to.be.reverted;
        });

        it("after vesting max", async () => {
            await suDAO.connect(admin).mint(admin.address, BN_1E18.mul(9)); // 9 * 1e18 minted in total
            await suDAO.connect(admin).mint(user1.address, BN_1E18); // 10 * 1e18 minted in total

            await increaseTime(MIN_FULLY_DILUTED_VESTING - 10);
            await expect(suDAO.connect(admin).mint(user1.address, BN_1E18.mul(MAX_SUPPLY - 10).add(1))).to.be.reverted;

            await increaseTime(10);
            await suDAO.connect(admin).mint(admin.address, BN_1E18.mul(MAX_SUPPLY - 10)); // MAX_SUPPLY * 1e18 minted in total
            await suDAO.connect(admin).mint(user1.address, BN_1E18); // (MAX_SUPPLY + 1) * 1e18 minted in total
            await suDAO.connect(admin).mint(user1.address, BN_1E18.mul(MAX_POST_VESTING_INFLATION - 1)); // (MAX_SUPPLY + MAX_POST_VESTING_INFLATION) * 1e18 minted in total
            await expect(suDAO.connect(admin).mint(user1.address, 1)).to.be.reverted;
        });
    });

    describe("rescueTokens", async () => {
        it("deposit ether and rescue", async () => {
            const rescueAmountBn = BN_1E18.mul(2);
            await suDAO.connect(admin).mint(admin.address, rescueAmountBn);

            await web3.eth.sendTransaction({
                from: admin.address,
                to: suDAO.address,
                value: rescueAmountBn.toString(),
            });

            const balanceBefore = BigNumber.from(await web3.eth.getBalance(admin.address));
            await suDAO.connect(admin).rescueTokens(ADDRESS_ZERO);
            const balanceAfter = BigNumber.from(await web3.eth.getBalance(admin.address));

            const rescuedAmount = balanceAfter.sub(balanceBefore);
            const gas = BigNumber.from(1e9).mul(100_000 * 20);
            expect(rescuedAmount).to.be.gt(rescueAmountBn.sub(gas));
            expect(rescuedAmount).to.be.lt(rescueAmountBn);
        });

        it("deposit erc20 and rescue", async () => {
            const tokenFactory = await ethers.getContractFactory("MockErc20");
            const DAI = (await tokenFactory.deploy("test DAI", "tDAI", 18)) as MockErc20;
            const rescueAmountBn = BN_1E18.mul(7);
            await DAI.mint(suDAO.address, rescueAmountBn);

            const balanceBefore = await DAI.balanceOf(admin.address);
            await suDAO.connect(admin).rescueTokens(DAI.address);
            const balanceAfter = await DAI.balanceOf(admin.address);

            expect(balanceAfter.sub(balanceBefore)).to.be.equal(rescueAmountBn);
        });
    });
});
