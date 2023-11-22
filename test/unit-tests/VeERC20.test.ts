import { ethers, web3 } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

import { MockErc20, SuAccessControlSingleton, SuDAOv2, VeERC20v2 } from "../../typechain";
import { increaseTime, latest } from "../utils/time";
import { ADDRESS_ZERO, BN_1E18 } from "../utils";
import deployProxy from "../utils/deploy";

describe("VeERC20", () => {
    let deployer: SignerWithAddress;
    let dao: SignerWithAddress;
    let admin: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;

    let accessControlSingleton: SuAccessControlSingleton;
    let suDAO: SuDAOv2;
    let veERC20: VeERC20v2;

    const amountToLock = BN_1E18.mul(100);
    let deployTimestamp = 0;
    const tgeSeconds = 50;
    const cliffSeconds = 100;
    const vestingSeconds = 400;
    const tgeUnlockRatio1e18 = BN_1E18.mul(10).div(100);
    const vestingFrequencySeconds = 100;
    const vestingPeriodsCount = vestingSeconds / vestingFrequencySeconds; // should be int

    const mintAndLockTokens = async (_amountToLock = amountToLock, toUser = user2) => {
        await suDAO.connect(admin).mint(admin.address, _amountToLock);
        await suDAO.connect(admin).approve(veERC20.address, _amountToLock);
        await veERC20.connect(admin).lockUnderVesting(toUser.address, _amountToLock);
    };

    const checkAvailableToClaim = async (expected: BigNumber | number) => {
        const availableToClaim = await veERC20.availableToClaim(user2.address);
        expect(availableToClaim).to.be.equal(expected);
    };

    beforeEach(async function () {
        [deployer, admin, dao, user1, user2, user3] = await ethers.getSigners();

        accessControlSingleton = (await deployProxy(
            "SuAccessControlSingleton",
            [admin.address, admin.address],
            undefined,
            false
        )) as SuAccessControlSingleton;
        suDAO = (await deployProxy("SuDAOv2", [accessControlSingleton.address], undefined, false)) as SuDAOv2;
        deployTimestamp = await latest();
        veERC20 = (await deployProxy(
            "VeERC20v2",
            [accessControlSingleton.address, suDAO.address, deployTimestamp + tgeSeconds],
            undefined,
            false
        )) as VeERC20v2;

        await veERC20
            .connect(admin)
            .updateTimestamps(
                deployTimestamp + tgeSeconds,
                cliffSeconds,
                vestingSeconds,
                tgeUnlockRatio1e18,
                vestingFrequencySeconds
            );
    });

    describe("checkGlobalVars", async () => {
        it("all global vars should be correct", async () => {
            expect(await veERC20.tgeTimestamp()).to.be.equal(deployTimestamp + tgeSeconds);
            expect(await veERC20.cliffSeconds()).to.be.equal(cliffSeconds);
            expect(await veERC20.vestingSeconds()).to.be.equal(vestingSeconds);
            expect(await veERC20.vestingFrequencySeconds()).to.be.equal(vestingFrequencySeconds);
            expect(await veERC20.tgeUnlockRatio1e18()).to.be.equal(tgeUnlockRatio1e18);
        });

        it("updateTimestamps: bad tgeTimestamp", async () => {
            const tx = veERC20.connect(admin).updateTimestamps(
                deployTimestamp - 1, // in the past
                cliffSeconds,
                vestingSeconds,
                tgeUnlockRatio1e18,
                vestingFrequencySeconds
            );
            await expect(tx).to.be.reverted;
        });

        it("updateTimestamps: bad ratio", async () => {
            const tx = veERC20.connect(admin).updateTimestamps(
                deployTimestamp + tgeSeconds,
                cliffSeconds,
                vestingSeconds,
                BN_1E18.add(1), // should be less that 1e18
                vestingFrequencySeconds
            );
            await expect(tx).to.be.reverted;
        });

        it("updateTimestamps: bad frequency", async () => {
            const tx = veERC20.connect(admin).updateTimestamps(
                deployTimestamp + tgeSeconds,
                cliffSeconds,
                500,
                tgeUnlockRatio1e18,
                300 // 500/300 is not int
            );
            await expect(tx).to.be.reverted;
        });

        it("updateTimestamps: good frequency", async () => {
            const tx = veERC20
                .connect(admin)
                .updateTimestamps(deployTimestamp + tgeSeconds, cliffSeconds, 900, tgeUnlockRatio1e18, 300);
            await expect(tx).not.to.be.reverted;
        });
    });

    describe("lockUnderVesting", async () => {
        it("should pull coins from the caller", async () => {
            await suDAO.connect(admin).mint(admin.address, amountToLock);
            const balanceBefore = await suDAO.balanceOf(admin.address);
            await suDAO.connect(admin).approve(veERC20.address, amountToLock);
            await veERC20.connect(admin).lockUnderVesting(user2.address, amountToLock);
            const balanceAfter = await suDAO.balanceOf(admin.address);
            expect(balanceBefore).to.be.equal(balanceAfter.add(amountToLock));
        });

        it("can't lockUnderVesting after burn and rescue", async () => {
            await mintAndLockTokens(BN_1E18, user1);

            await veERC20.connect(admin).rescue(suDAO.address);
            await suDAO.connect(admin).burn(BN_1E18);
            await suDAO.connect(admin).approve(veERC20.address, BN_1E18);
            await expect(veERC20.connect(admin).lockUnderVesting(user1.address, BN_1E18)).to.be.reverted;
        });
    });

    describe("availableToClaim", async () => {
        it("should vest right amount of tokens", async () => {
            const tgeTimestamp = await veERC20.tgeTimestamp();
            await mintAndLockTokens();

            // should have 0 available to claim before tge
            await checkAvailableToClaim(0);

            await increaseTime(tgeTimestamp - (await latest()) - 1);
            // should have 0 available to claim before tge
            await checkAvailableToClaim(0);

            const firstPartClaim = amountToLock.mul(tgeUnlockRatio1e18).div(BN_1E18);
            const restPartClaim = amountToLock.sub(firstPartClaim);

            // between tge and cliff => tgeUnlockRatio1e18 * N
            await increaseTime(cliffSeconds);
            await checkAvailableToClaim(firstPartClaim);

            await increaseTime(vestingFrequencySeconds / 2);
            // between cliff and vesting1 => tgeUnlockRatio1e18 * N, here we are in 1 second before cliff
            await checkAvailableToClaim(firstPartClaim);

            // after first vesting after cliff should have more tokens to claim
            await increaseTime(vestingFrequencySeconds / 2 + 2);
            // between vesting1 and vesting2 => firstPartClaim + restPartClaim * 1/4
            await checkAvailableToClaim(firstPartClaim.add(restPartClaim.div(vestingPeriodsCount)));

            await increaseTime(vestingFrequencySeconds);
            await checkAvailableToClaim(firstPartClaim.add(restPartClaim.mul(2).div(vestingPeriodsCount)));

            await increaseTime(vestingFrequencySeconds);
            await checkAvailableToClaim(firstPartClaim.add(restPartClaim.mul(3).div(vestingPeriodsCount)));

            // after full vesting should have all tokens to claim
            await increaseTime(vestingFrequencySeconds);
            expect(await latest()).to.be.gt(tgeTimestamp + cliffSeconds + vestingSeconds);
            await checkAvailableToClaim(amountToLock);
        });
    });

    describe("claim", async () => {
        it("can't claim 0 before cliff", async () => {
            await mintAndLockTokens(amountToLock);
            // should have 0 available to claim
            await expect(veERC20.connect(user2).claim()).to.be.reverted;
        });

        it("claim all after vesting", async () => {
            await mintAndLockTokens(amountToLock);

            await increaseTime(tgeSeconds + cliffSeconds + vestingSeconds);
            const balanceBefore = await suDAO.balanceOf(user2.address);
            await veERC20.connect(user2).claim();
            const balanceAfter = await suDAO.balanceOf(user2.address);
            expect(amountToLock).to.be.equal(balanceAfter.sub(balanceBefore));
        });

        it("claim partially during vesting", async () => {
            await mintAndLockTokens();

            await increaseTime(tgeSeconds + cliffSeconds + vestingFrequencySeconds);

            const balanceBefore = await suDAO.balanceOf(user2.address);
            await veERC20.connect(user2).claim();
            const balanceAfter = await suDAO.balanceOf(user2.address);

            const firstPartClaim = amountToLock.mul(tgeUnlockRatio1e18).div(BN_1E18);
            const restPartClaim = amountToLock.sub(firstPartClaim);

            // should be as amountToLock.div(3) +- 7%
            const claimed = balanceAfter.sub(balanceBefore);
            const amount = firstPartClaim.add(restPartClaim.div(vestingPeriodsCount));
            expect(claimed).to.be.eq(amount);

            const totalClaimed = await veERC20.totalClaimed(user2.address);
            expect(totalClaimed).to.be.equal(amount);
        });

        it("totalClaimed", async () => {
            await mintAndLockTokens();

            await increaseTime(tgeSeconds + cliffSeconds + vestingFrequencySeconds);

            const balanceBefore = await suDAO.balanceOf(user2.address);
            const availableToClaim = await veERC20.availableToClaim(user2.address);
            await veERC20.connect(user2).claim();
            const balanceAfter = await suDAO.balanceOf(user2.address);

            // should be as availableToClaim
            const claimed = balanceAfter.sub(balanceBefore);
            expect(claimed).to.be.eq(availableToClaim);

            const totalClaimed = await veERC20.totalClaimed(user2.address);
            expect(totalClaimed).to.be.equal(claimed);
        });
    });

    describe("rescue", async () => {
        it("deposit ether and rescue", async () => {
            const rescueAmountBn = BN_1E18.mul(2);
            await mintAndLockTokens();

            await web3.eth.sendTransaction({
                from: admin.address,
                to: veERC20.address,
                value: rescueAmountBn.toString(),
            });

            const balanceBefore = BigNumber.from(await web3.eth.getBalance(admin.address));
            await veERC20.connect(admin).rescue(ADDRESS_ZERO);
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
            await mintAndLockTokens();
            await DAI.mint(veERC20.address, rescueAmountBn);

            const balanceBefore = await DAI.balanceOf(admin.address);
            await veERC20.connect(admin).rescue(DAI.address);
            const balanceAfter = await DAI.balanceOf(admin.address);

            expect(balanceAfter.sub(balanceBefore)).to.be.equal(rescueAmountBn);
        });
    });

    describe("transfer", async () => {
        it("can't as default transfer veSuDAO", async () => {
            await expect(veERC20.transfer(user1.address, BN_1E18)).to.be.reverted;
        });

        it("can't do transfer with 0 veSuDAO by dao", async () => {
            await veERC20.connect(admin).adminTransferUnlock(admin.address, true);

            await expect(veERC20.connect(admin).transfer(user1.address, BN_1E18)).to.be.reverted;
        });

        it("can do transfer veSuDAO by dao", async () => {
            const amount = BN_1E18;
            await veERC20.connect(admin).adminTransferUnlock(admin.address, true);
            await mintAndLockTokens(amount, admin);

            const balanceUserBefore = await veERC20.balanceOf(user1.address);
            const balanceAdminBefore = await veERC20.balanceOf(admin.address);

            await veERC20.connect(admin).transfer(user1.address, amount);

            const balanceUserAfter = await veERC20.balanceOf(user1.address);
            const balanceAdminAfter = await veERC20.balanceOf(admin.address);

            expect(balanceUserAfter).to.be.equal(balanceUserBefore.add(amount));
            expect(balanceAdminAfter).to.be.equal(balanceAdminBefore.sub(amount));

            await veERC20.connect(admin).adminTransferUnlock(admin.address, false);
            await expect(veERC20.connect(admin).transfer(user1.address, BN_1E18)).to.be.reverted;
        });
    });

    describe("burn", async () => {
        it("can't burn more that in balance", async () => {
            await expect(veERC20.connect(user1).burn(BN_1E18)).to.be.reverted;
        });

        it("can burn less that in balance after transfer", async () => {
            const amount = BN_1E18;
            await veERC20.connect(admin).adminTransferUnlock(admin.address, true);
            await mintAndLockTokens(amount, admin);

            const balanceAdminBefore = await veERC20.balanceOf(admin.address);

            await veERC20.connect(admin).transfer(user1.address, amount);
            await veERC20.connect(user1).burn(amount.sub(1));

            const balanceUserAfter = await veERC20.balanceOf(user1.address);
            const balanceAdminAfter = await veERC20.balanceOf(admin.address);

            expect(balanceUserAfter).to.be.equal(1);
            expect(balanceAdminAfter).to.be.equal(balanceAdminBefore.sub(amount));
        });

        it("can burn less that in balance after lock", async () => {
            const amount = BN_1E18;
            await mintAndLockTokens(amount, user1);

            const suDaoBalanceContractBefore = await suDAO.balanceOf(veERC20.address);
            const balanceUserBefore = await veERC20.balanceOf(user1.address);
            const balanceAdminBefore = await veERC20.balanceOf(admin.address);

            expect(balanceUserBefore).to.be.equal(amount);
            await veERC20.connect(user1).burn(amount.sub(1));

            const suDaoBalanceContractAfter = await suDAO.balanceOf(veERC20.address);
            const balanceUserAfter = await veERC20.balanceOf(user1.address);
            const balanceAdminAfter = await veERC20.balanceOf(admin.address);

            expect(balanceUserAfter).to.be.equal(1);
            expect(balanceAdminAfter).to.be.equal(balanceAdminBefore);
            expect(suDaoBalanceContractAfter).to.be.equal(suDaoBalanceContractBefore.sub(amount.sub(1)));

            // in balance user1 have only 1 after burn
            await expect(veERC20.connect(user1).burn(2)).to.be.reverted;

            await veERC20.connect(user1).burn(1);
            expect(await veERC20.balanceOf(user1.address)).to.be.equal(0);
        });

        it("can't burn if locked tokens are not enough", async () => {
            await mintAndLockTokens(BN_1E18, user1);

            await veERC20.connect(admin).rescue(suDAO.address);
            await expect(veERC20.connect(user1).burn(1)).to.be.reverted;
        });
    });

    describe("voting ability", async () => {
        beforeEach(async () => {
            await accessControlSingleton.connect(admin).grantRole(await veERC20.SYSTEM_ROLE(), admin.address);
        });

        it("has voting power by default", async () => {
            await mintAndLockTokens(amountToLock, user1);
            expect(await veERC20.getVotes(user1.address)).to.be.equal(amountToLock);
        });

        it("can delegate vote power to account with no balance", async () => {
            await mintAndLockTokens(amountToLock, user1);
            await veERC20.connect(admin).delegateOnBehalf(user1.address, user2.address);
            expect(await veERC20.getVotes(user2.address)).to.be.equal(amountToLock);
        });

        it("after unlock no voting power", async () => {
            await mintAndLockTokens(amountToLock, user1);
            await increaseTime(tgeSeconds + cliffSeconds + vestingSeconds);
            await veERC20.connect(user1).claim();
            expect(await veERC20.getVotes(user1.address)).to.be.equal(0);
        });

        it("can delegate but after unlock this doesn't add voting power", async () => {
            await mintAndLockTokens(amountToLock, user1);
            await veERC20.connect(admin).delegateOnBehalf(user1.address, user2.address);
            await increaseTime(tgeSeconds + cliffSeconds + vestingSeconds);
            await veERC20.connect(user1).claim();
            expect(await veERC20.getVotes(user2.address)).to.be.equal(0);
        });

        it("if delegatee unlock its tokens, still have others voting power", async () => {
            await mintAndLockTokens(amountToLock, user1);
            await mintAndLockTokens(amountToLock, user2);
            await veERC20.connect(admin).delegateOnBehalf(user1.address, user2.address);
            expect(await veERC20.getVotes(user2.address)).to.be.equal(amountToLock.mul(2));

            await increaseTime(tgeSeconds + cliffSeconds + vestingSeconds);
            await veERC20.connect(user2).claim();
            expect(await veERC20.getVotes(user2.address)).to.be.equal(amountToLock);
        });
    });
});
