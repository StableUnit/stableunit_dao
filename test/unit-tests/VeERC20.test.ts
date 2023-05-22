import {ethers, web3} from "hardhat";
import {expect} from 'chai'
import {BigNumber} from "ethers";
import {SignerWithAddress} from "hardhat-deploy-ethers/signers";

import {MockErc20, SuAccessControlSingleton, SuDAOv2, VeERC20v2} from "../../typechain";
import {increaseTime, latest} from "../utils/time";
import {ADDRESS_ZERO, BN_1E18} from "../utils";
import deployProxy from "../utils/deploy";

describe("VeERC20", () => {
    let deployer: SignerWithAddress,
        dao: SignerWithAddress,
        admin: SignerWithAddress,
        user1: SignerWithAddress,
        user2: SignerWithAddress,
        user3: SignerWithAddress;

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
    }

    const checkAvailableToClaim = async (expected: BigNumber | number) => {
        const availableToClaim = await veERC20.availableToClaim(user2.address);
        expect(availableToClaim).to.be.equal(expected);
    }

    beforeEach(async function () {
        [deployer, admin, dao, user1, user2, user3] = await ethers.getSigners();

        accessControlSingleton = await deployProxy( "SuAccessControlSingleton", [admin.address, admin.address], undefined, false) as SuAccessControlSingleton;
        suDAO = await deployProxy("SuDAOv2", [accessControlSingleton.address], undefined, false) as SuDAOv2;
        deployTimestamp = await latest();
        veERC20 = await deployProxy("VeERC20v2", [accessControlSingleton.address, suDAO.address, deployTimestamp + tgeSeconds], undefined, false) as VeERC20v2;

        await veERC20.connect(admin).updateCliffSeconds(cliffSeconds);
        await veERC20.connect(admin).updateVestingSeconds(vestingSeconds);
        await veERC20.connect(admin).updateVestingFrequencySeconds(vestingFrequencySeconds);
        await veERC20.connect(admin).updateTgeUnlockRatio(tgeUnlockRatio1e18);
    });

    describe("checkGlobalVars", async () => {
        it("all global vars should be correct", async () => {
            expect(await veERC20.tgeTimestamp()).to.be.equal(deployTimestamp + tgeSeconds);
            expect(await veERC20.cliffSeconds()).to.be.equal(cliffSeconds);
            expect(await veERC20.vestingSeconds()).to.be.equal(vestingSeconds);
            expect(await veERC20.vestingFrequencySeconds()).to.be.equal(vestingFrequencySeconds);
            expect(await veERC20.tgeUnlockRatio1e18()).to.be.equal(tgeUnlockRatio1e18);
        })
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
    });

    describe("availableToClaim", async () => {
        it("should vest right amount of tokens", async () => {
            const tgeTimestamp = await veERC20.tgeTimestamp();
            await mintAndLockTokens();

            // should have 0 available to claim before tge
            await checkAvailableToClaim(0);

            await increaseTime(tgeTimestamp - await latest() - 1);
            // should have 0 available to claim before tge
            await checkAvailableToClaim(0);

            const firstPartClaim = amountToLock.mul(tgeUnlockRatio1e18).div(BN_1E18);
            const restPartClaim = amountToLock.sub(firstPartClaim);

            // between tge and cliff => tgeUnlockRatio1e18 * N
            await increaseTime(cliffSeconds)
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
        })

        it("claim all after vesting", async () => {
            await mintAndLockTokens(amountToLock);

            await increaseTime(tgeSeconds + cliffSeconds + vestingSeconds);
            const balanceBefore = await suDAO.balanceOf(user2.address);
            await veERC20.connect(user2).claim()
            const balanceAfter = await suDAO.balanceOf(user2.address);
            expect(amountToLock).to.be.equal(balanceAfter.sub(balanceBefore));
        })

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
        })

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
        })
    });

    describe("rescue", async () => {
        it("deposit ether and rescue", async () => {
            const rescueAmountBn = BN_1E18.mul(2);
            await mintAndLockTokens();

            await web3.eth.sendTransaction({from: admin.address, to: veERC20.address, value: rescueAmountBn.toString()});

            const balanceBefore = BigNumber.from(await web3.eth.getBalance(admin.address));
            await veERC20.connect(admin).rescue(ADDRESS_ZERO);
            const balanceAfter = BigNumber.from(await web3.eth.getBalance(admin.address));

            const rescuedAmount = balanceAfter.sub(balanceBefore);
            const gas = BigNumber.from(1e9).mul(100_000 * 20);
            expect(rescuedAmount).to.be.gt(rescueAmountBn.sub(gas));
            expect(rescuedAmount).to.be.lt(rescueAmountBn);
        })

        it("deposit erc20 and rescue", async () => {
            const tokenFactory = await ethers.getContractFactory("MockErc20");
            const DAI = await tokenFactory.deploy("test DAI", "tDAI", 18) as MockErc20;
            const rescueAmountBn = BN_1E18.mul(7);
            await mintAndLockTokens();
            await DAI.mint(veERC20.address, rescueAmountBn);

            const balanceBefore = await DAI.balanceOf(admin.address);
            await veERC20.connect(admin).rescue(DAI.address);
            const balanceAfter = await DAI.balanceOf(admin.address);

            expect(balanceAfter.sub(balanceBefore)).to.be.equal(rescueAmountBn);
        })

        it("donate token to admin", async () => {
            await mintAndLockTokens();

            const balanceBefore = await suDAO.balanceOf(admin.address);
            await veERC20.connect(user2).donateTokens(admin.address);
            const balanceAfter = await suDAO.balanceOf(admin.address);

            const donated = balanceAfter.sub(balanceBefore);
            expect(donated).to.be.equal(amountToLock);
        })

        it("donate token to invalid DAO address should fail", async () => {
            await mintAndLockTokens();
            await expect(veERC20.connect(user2).donateTokens(user1.address)).to.be.reverted;
            await expect(veERC20.connect(user2).donateTokens(deployer.address)).to.be.reverted;
        })

    });

    describe("transfer", async () => {
        it("can't transfer veSuDAO", async () => {
            await expect(veERC20.transfer(user1.address, BN_1E18)).to.be.reverted;
        });
    });

    describe("updateTge", async () => {
        it("can't update to the TGE_MAX_TIMESTAMP", async () => {
            await expect(veERC20.connect(admin).updateTgeTimestamp(await latest() - 100)).to.be.reverted;
            await expect(veERC20.connect(admin).updateTgeTimestamp(await latest() + tgeSeconds)).to.be.reverted;
            await expect(veERC20.connect(admin).updateTgeTimestamp(await latest() + tgeSeconds / 2)).not.to.be.reverted;
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
