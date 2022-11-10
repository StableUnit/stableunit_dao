import {web3, ethers} from "hardhat";
import {expect} from 'chai'
import {BigNumber} from "ethers";
import {SignerWithAddress} from "hardhat-deploy-ethers/signers";

import {MockErc20, SuAccessControlSingleton, SuDAO, VeERC20} from "../../typechain";
import {increaseTime, latest} from "../utils/time";
import {ADDRESS_ZERO, BN_1E18} from "../utils";
import deployProxy from "../utils/deploy";

describe("VeERC20", () => {
    const UINT256_0 = '0x0000000000000000000000000000000000000000';

    let deployer: SignerWithAddress, dao: SignerWithAddress, admin: SignerWithAddress, user1: SignerWithAddress , user2: SignerWithAddress;

    let suDAO: SuDAO;
    let veERC20: VeERC20;

    const amountToLock = BN_1E18.mul(100);
    const cliffSeconds = 100;
    const vestingPeriodSeconds = 500;
    const tgeUnlockRatio1e18 = BN_1E18.mul(5).div(100);
    const vestingFrequencySeconds = 10;

    const mintAndLockTokens = async (_amountToLock = amountToLock, toUser = user2) => {
        await suDAO.connect(admin).mint(admin.address, _amountToLock);
        await suDAO.connect(admin).approve(veERC20.address, _amountToLock);
        await veERC20.connect(admin).lockUnderVesting(
            toUser.address,
            _amountToLock,
            vestingPeriodSeconds,
            cliffSeconds,
            tgeUnlockRatio1e18,
            vestingFrequencySeconds
        );
    }

    beforeEach(async function () {
        [deployer, admin, dao, user1, user2] = await ethers.getSigners();

        const accessControlSingleton = await deployProxy( "SuAccessControlSingleton", [admin.address, admin.address], undefined, false) as SuAccessControlSingleton;
        suDAO = await deployProxy("SuDAO", [accessControlSingleton.address], undefined, false) as SuDAO;
        veERC20 = await deployProxy("VeERC20", [accessControlSingleton.address, suDAO.address, await latest()]) as VeERC20;
        await suDAO.connect(admin).mint(admin.address, amountToLock);
    });

    describe("lockUnderVesting", async () => {
        it("should pull coins from the caller", async () => {
            const balanceBefore = await suDAO.balanceOf(admin.address);
            await suDAO.connect(admin).approve(veERC20.address, amountToLock);
            await veERC20.connect(admin).lockUnderVesting(
                user2.address,
                amountToLock,
                vestingPeriodSeconds,
                cliffSeconds,
                tgeUnlockRatio1e18,
                vestingFrequencySeconds
            );
            const balanceAfter = await suDAO.balanceOf(admin.address);
            expect(balanceBefore).to.be.equal(balanceAfter.add(amountToLock))
        })
    });

    describe("availableToClaim", async () => {
        it("should vest right amount of tokens", async () => {
            const amountToLock = BN_1E18.mul(123);
            await mintAndLockTokens(amountToLock);

            // should have 0 available to claim
            const availableToClaim = await veERC20.availableToClaim(user2.address);
            expect(availableToClaim).to.be.equal(0);

            // after cliff seconds should have something to claim
            await increaseTime(cliffSeconds);
            const availableToClaim2 = await veERC20.availableToClaim(user2.address);
            expect(availableToClaim2).to.be.equal(0);

            // after full vesting should have all tokens to claim
            const thirdVesting = Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3);
            await increaseTime(thirdVesting);
            const availableToClaim3 = await veERC20.availableToClaim(user2.address);
            // should be as amountToLock.div(3) +- 3%
            expect(availableToClaim3).to.be.gt(amountToLock.div(3).mul(97).div(100));
            expect(availableToClaim3).to.be.lt(amountToLock.div(3).mul(103).div(100));

            await increaseTime(vestingPeriodSeconds);
            const availableToClaim4 = await veERC20.availableToClaim(user2.address);
            expect(availableToClaim4).to.be.equal(amountToLock);
        });
    });


    describe("claim", async () => {
        it("can't claim 0 before cliff", async () => {
            const amountToLock = BN_1E18.mul(100);
            await mintAndLockTokens(amountToLock);
            // should have 0 available to claim
            await expect(veERC20.connect(user2).claim()).to.be.revertedWith("Can't claim 0 tokens");
        })

        it("claim all after vesting", async () => {
            const amountToLock = BN_1E18.mul(100);
            await mintAndLockTokens(amountToLock);

            await increaseTime(vestingPeriodSeconds);
            const balanceBefore = await suDAO.balanceOf(user2.address);
            await veERC20.connect(user2).claim()
            const balanceAfter = await suDAO.balanceOf(user2.address);
            expect(amountToLock).to.be.equal(balanceAfter.sub(balanceBefore));
        })

        it("claim partially during vesting", async () => {
            await mintAndLockTokens();

            await increaseTime(cliffSeconds + Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3));

            const balanceBefore = await suDAO.balanceOf(user2.address);
            await veERC20.connect(user2).claim();
            const balanceAfter = await suDAO.balanceOf(user2.address);

            // should be as amountToLock.div(3) +- 7%
            const claimed = balanceAfter.sub(balanceBefore);
            expect(claimed).to.be.gt(amountToLock.div(3).mul(93).div(100));
            expect(claimed).to.be.lt(amountToLock.div(3).mul(107).div(100));
        })

        it("totalClaimed", async () => {
            await mintAndLockTokens();

            await increaseTime(cliffSeconds + Math.ceil(cliffSeconds + (vestingPeriodSeconds - cliffSeconds) / 3));

            const balanceBefore = await suDAO.balanceOf(user2.address);
            const availableToClaim = await veERC20.availableToClaim(user2.address);
            await veERC20.connect(user2).claim();
            const balanceAfter = await suDAO.balanceOf(user2.address);

            // should be as availableToClaim, but during claim it can be a little more
            const claimed = balanceAfter.sub(balanceBefore);
            expect(claimed).to.be.gte(availableToClaim);
            expect(claimed).to.be.lte(availableToClaim.mul(110).div(100));

            const totalClaimed = await veERC20.totalClaimed(user2.address);
            expect(totalClaimed).to.be.equal(claimed);
        })
    });

    describe("rescue", async () => {

        it("deposit ether and rescue", async () => {
            const rescueAmountBn = BN_1E18.mul(2);
            await mintAndLockTokens();
            // // @ts-ignore
            // await veERC20.connect(admin).sendTransaction({value: rescueAmountBn});
            await web3.eth.sendTransaction({from: admin.address, to: veERC20.address, value: rescueAmountBn.toString()});

            const balanceBefore = BigNumber.from(await web3.eth.getBalance(admin.address));
            await veERC20.connect(admin).rescue(UINT256_0);
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
            await veERC20.connect(user2).donateTokens(admin.address)
            const balanceAfter = await suDAO.balanceOf(admin.address);
            const donated = balanceAfter.sub(balanceBefore);
            expect(donated).to.be.equal(amountToLock);
        })

        it("donate token to invalid DAO address should fail", async () => {
            await mintAndLockTokens();
            await expect(
                veERC20.connect(user2).donateTokens(user1.address)
            ).to.be.revertedWith("invalid DAO address");

            await expect(
                veERC20.connect(user2).donateTokens(deployer.address)
            ).to.be.revertedWith("invalid DAO address");
        })

    });

    describe("transfer", async () => {
        it("can't transfer veSuDAO", async () => {
            await expect(veERC20.transfer(user1.address, BN_1E18)).to.be.revertedWith('not possible to transfer vested token');
        });
    });

    describe("updateTge", async () => {
        it("can't update to the TGE_MAX_TIMESTAMP", async () => {
            await expect(veERC20.connect(admin).updateTgeTimestamp(await latest() - 100)).to.be.revertedWith('veERC20: TGE date can\'t be in the past');
            await expect(veERC20.connect(admin).updateTgeTimestamp(await latest() + 100)).to.be.revertedWith('veERC20: new TGE date is beyond limit');
        });
    });
});
