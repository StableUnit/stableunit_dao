// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

import {expect} from 'chai'
import {MockErc721, SuAccessControlSingleton, SuDAO, VeERC20} from "../../typechain";
import {increaseTime} from "../utils/time";
import {BN_1E18} from "../utils";
import deployProxy from "../utils/deploy";

// describe("VeERC20", () => {
//     const UINT256_0 = '0x0000000000000000000000000000000000000000';
//
//     let accounts: string[];
//     let owner: string, patron: string, alice: string, bob: string;
//
//     let suDAO: SuDAO;
//     let veERC20: VeERC20;
//
//     const amountToLock = BN_1E18.mul(100);
//     const cliffSeconds = 100;
//     const vestingPeriodSeconds = 500;
//
//     const mintAndLockTokens = async (_amountToLock = amountToLock, user = owner, toUser = patron) => {
//         await suDAO.mint(user, _amountToLock);
//         await suDAO.approve(veERC20.address, _amountToLock);
//         const tx = await veERC20.lockUnderVesting(
//             toUser,
//             _amountToLock,
//             vestingPeriodSeconds,
//             cliffSeconds
//         );
//     }
//
//     beforeEach(async function () {
//         accounts = await web3.eth.getAccounts();
//         [owner, patron, alice, bob] = accounts;
//
//         const accessControlSingleton = await deployProxy(undefined, "SuAccessControlSingleton", [owner], undefined, false) as SuAccessControlSingleton;
//         suDAO = await deployProxy(undefined, "SuDAO", [accessControlSingleton.address], undefined, false) as SuDAO;
//         await suDAO.mint(owner, amountToLock);
//         veERC20 = await deployProxy(undefined, "VeERC20", [accessControlSingleton.address, suDAO.address]) as VeERC20;
//     });
//
//     describe("lockUnderVesting", async () => {
//
//         it("should pull coins from the caller", async () => {
//             const balanceBefore = await suDAO.balanceOf(owner);
//             await suDAO.approve(veERC20.address, amountToLock);
//             await veERC20.lockUnderVesting(
//                 patron,
//                 amountToLock,
//                 vestingPeriodSeconds,
//                 cliffSeconds
//             );
//             const balanceAfter = await suDAO.balanceOf(owner);
//             assert.equal(true, balanceBefore.eq(balanceAfter.add(amountToLock)));
//         })
//
//     });
//
//     describe("availableToClaim", async () => {
//         it("should vest right amount of tokens", async () => {
//             const amountToLock = BN_1E18.mul(123);
//             await mintAndLockTokens(amountToLock);
//
//             // should have 0 available to claim
//             const availableToClaim = Number((await veERC20.availableToClaim(patron)).toString());
//             assert.equal(availableToClaim, 0);
//
//             // after cliff seconds should have something to claim
//             increaseTime(cliffSeconds);
//             const availableToClaim2 = Number((await veERC20.availableToClaim(patron)).toString());
//             assert.equal(availableToClaim2, 0);
//
//             // after full vesting should have all tokens to claim
//             const thirdVesting = Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3);
//             increaseTime(thirdVesting);
//             const availableToClaim3 = Number((await veERC20.availableToClaim(patron)).toString());
//             assert.isAtLeast(availableToClaim3, Number(amountToLock.div(3).toString()));
//             assert.isAtMost(availableToClaim3, Number(amountToLock.div(3).add(BN_1E18).toString()));
//
//             increaseTime(thirdVesting);
//             const availableToClaim4 = Number((await veERC20.availableToClaim(patron)).toString());
//             assert.isAtLeast(availableToClaim4, Number(amountToLock.div(3).mul(2).toString()));
//             assert.isAtMost(availableToClaim4, Number(amountToLock.div(3).mul(2).add(BN_1E18).toString()));
//         });
//     });
//
//
//     describe("claim", async () => {
//
//         it("can't claim 0 before cliff", async () => {
//             const amountToLock = BN_1E18.mul(100);
//             await mintAndLockTokens(amountToLock);
//
//             // should have 0 available to claim
//             await expect(
//                 veERC20.claim({from: patron})
//             ).to.be.revertedWith("Can't claim 0 tokens");
//         })
//
//         it("claim all after vesting", async () => {
//             const amountToLock = BN_1E18.mul(100);
//             await mintAndLockTokens(amountToLock);
//
//             increaseTime(vestingPeriodSeconds);
//             const balanceBefore = await suDAO.balanceOf(patron);
//             await veERC20.claim({from: patron})
//             const balanceAfter = await suDAO.balanceOf(patron);
//             assert.equal(true, balanceAfter.sub(balanceBefore).eq(amountToLock));
//         })
//
//         it("claim partially during vesting", async () => {
//             await mintAndLockTokens();
//
//             increaseTime(cliffSeconds + Math.ceil((vestingPeriodSeconds - cliffSeconds) / 3));
//
//             const balanceBefore = await suDAO.balanceOf(patron);
//             await veERC20.claim({from: patron})
//             const balanceAfter = await suDAO.balanceOf(patron);
//             const claimed = Number(balanceAfter.sub(balanceBefore).toString());
//             assert.isAtLeast(claimed, Number(amountToLock.div(3).toString()));
//             assert.isAtMost(claimed, Number(amountToLock.div(3).add(BN_1E18).toString()));
//         })
//     });
//
//     describe("rescue", async () => {
//
//         it("deposit ether and rescue", async () => {
//             const rescueAmountBn = BN_1E18.mul(2);
//             await mintAndLockTokens();
//             await veERC20.sendTransaction({value: rescueAmountBn});
//
//             const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(owner));
//             await veERC20.rescue(UINT256_0);
//             const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(owner));
//             const rescuedAmount = Number(balanceAfter.sub(balanceBefore).toString());
//             const rescueAmount = Number(rescueAmountBn.toString());
//             const gas = 1e9 * 100_000 * 20;
//             assert.isAtLeast(rescuedAmount, rescueAmount - gas);
//             assert.isAtMost(rescuedAmount, rescueAmount);
//         })
//
//         it("deposit erc20 and rescue", async () => {
//             const daiInstance = await TokenMock.new("test DAI", "tDAI", 18);
//             const rescueAmountBn = BN_1E18.mul(7);
//             await mintAndLockTokens();
//             await daiInstance.mint(veERC20.address, rescueAmountBn);
//
//             const balanceBefore = await daiInstance.balanceOf(owner);
//             await veERC20.rescue(daiInstance.address);
//             const balanceAfter = await daiInstance.balanceOf(owner);
//             const rescuedAmount = Number(balanceAfter.sub(balanceBefore).toString());
//             const rescueAmount = Number(rescueAmountBn.toString());
//             assert.equal(rescuedAmount, rescueAmount);
//         })
//
//         it("donate token to admin", async () => {
//             await mintAndLockTokens();
//
//             const balanceBefore = await suDAO.balanceOf(owner);
//             await veERC20.donateTokens(owner, {from: patron})
//             const balanceAfter = await suDAO.balanceOf(owner);
//             const donated = Number(balanceAfter.sub(balanceBefore).toString());
//             // console.log(donated);
//             assert.isTrue(donated == Number(amountToLock.toString()));
//         })
//
//         it("donate token to invalid admin address should fail", async () => {
//             await mintAndLockTokens();
//             await expect(
//                 veERC20.donateTokens(alice, {from: patron})
//             ).to.be.revertedWith("invalid admin address");
//
//             await expect(
//                 veERC20.donateTokens(bob, {from: patron})
//             ).to.be.revertedWith("invalid admin address");
//         })
//
//     });
//
//
// });
