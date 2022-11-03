import {SaftForNftV1Instance, SaftV0Instance, TokenMockInstance} from "../../types/truffle-contracts";

const truffleAssert = require('truffle-assertions');
// @ts-ignore
import { assert, web3, artifacts } from "hardhat";

const { increaseTime } = require('../utils/timeManipulation');

// @ts-ignore
const SAFT = artifacts.require("Saft_v0");
// @ts-ignore
const suDAO = artifacts.require("SuDAO");
// @ts-ignore
const Token = artifacts.require("TokenMock");

const bn1e18 = web3.utils.toBN(1e18);

const ERRORS = {
    PURCHASE_IS_NOT_INIT: "purchase isn't initialized",
}
const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000';

describe("SAFT", () => {
  let accounts: string[];
  let purchaser: string;
  let owner: string;
  let daiTokenInstance: TokenMockInstance;
  let saftInstance: SaftV0Instance;
  let suDAOInstance: TokenMockInstance;

  let suDAOTotalSupply = web3.utils.toWei('1000');
  let tokenAllocation = web3.utils.toWei('100');
  const paymentAmount = bn1e18.muln(10);
  // let pricePerToken = 10; // 0.1$
  let paymentPeriodSeconds = 1000;
  let vestingPeriodSeconds = 5000;
  let cliffSeconds = 100;
  let presalePeriod = 5184000; // 2 months

  async function addPurchaser(account = accounts[1], paymentMethod = daiTokenInstance.address) {
      await suDAOInstance.approve(saftInstance.address, tokenAllocation);
      await daiTokenInstance.mint(account, tokenAllocation);

      let result = await saftInstance.addPurchaser(
          account,
          tokenAllocation,
          paymentAmount,
          paymentMethod,
          paymentPeriodSeconds,
          cliffSeconds,
          vestingPeriodSeconds
      );
      assert.equal((await saftInstance.presale(account))[2], paymentMethod);
      let txTimestamp = (await web3.eth.getBlock(result.receipt.blockNumber)).timestamp;

      truffleAssert.eventEmitted(result, 'AddedAccount', {
          account: account,
          maxRewardTokens: web3.utils.toBN(tokenAllocation),
          maxStakeTokens: web3.utils.toBN(Number(paymentAmount)),
          stakeTokenAddress: paymentMethod,
          stakeDeadlineTimestamp: web3.utils.toBN(Number(txTimestamp) + paymentPeriodSeconds),
          rewardCliffTimestamp: web3.utils.toBN(Number(txTimestamp) + vestingPeriodSeconds),
          rewardVestingTimestamp: web3.utils.toBN(Number(txTimestamp) + cliffSeconds)
      });
  }

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts();
    owner = accounts[0];
    purchaser = accounts[1];
    daiTokenInstance = await Token.new('DAI Stablecoin', 'DAI', '18');

    suDAOInstance = await suDAO.new(suDAOTotalSupply);
    saftInstance = await SAFT.new(suDAOInstance.address);
  });

  describe( "addPurchaser", function() {
    it("Should add purchaser successfully", async () => {
        const saftBalanceBefore = await suDAOInstance.balanceOf(saftInstance.address);
        await addPurchaser();
        const saftBalanceAfter = await suDAOInstance.balanceOf(saftInstance.address);
        assert.equal(true, saftBalanceBefore.eq(saftBalanceAfter.sub(web3.utils.toBN(tokenAllocation))));
    });

    it("Should not be able to add purchaser due to account is already funded", async () => {
      await addPurchaser();

      await daiTokenInstance.mint(accounts[1], tokenAllocation);
      let daiBalanceBefore = await daiTokenInstance.balanceOf(purchaser);

      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      let result = await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });
      truffleAssert.eventEmitted(result, 'Staked', {
        account: accounts[1],
        stakedAmount: web3.utils.toBN(Number(tokenAllocation))
      });

      let daiBalanceAfter = await daiTokenInstance.balanceOf(purchaser);
      assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.add(paymentAmount)));

      // @ts-ignore
        assert.equal(true, (await saftInstance.presale(purchaser))._tokensBought.eq(web3.utils.toBN(Number(tokenAllocation))));

      await suDAOInstance.approve(saftInstance.address, tokenAllocation);

      await truffleAssert.reverts(
        saftInstance.addPurchaser(accounts[1], tokenAllocation, paymentAmount, daiTokenInstance.address, paymentPeriodSeconds, cliffSeconds, vestingPeriodSeconds),
        "purchase is already initialized"
      );
  });

    it("Should not be able to add purchaser due to allocation is too small", async () => {
      await truffleAssert.reverts(
        saftInstance.addPurchaser(accounts[1], '1', paymentAmount, daiTokenInstance.address, paymentPeriodSeconds, cliffSeconds, vestingPeriodSeconds),
        "allocation is too small"
      );
    });

    it("Should not be able to add purchaser due to saft contract doesn't have enough tokens to sell", async () => {
        await truffleAssert.reverts(
          saftInstance.addPurchaser(accounts[1], tokenAllocation, paymentAmount, daiTokenInstance.address, paymentPeriodSeconds, cliffSeconds, vestingPeriodSeconds),
          "ERC20: transfer amount exceeds allowance"
        );
    });

    it("Should not be able to add purchaser due to caller is not the owner", async () => {
        await truffleAssert.reverts(
          saftInstance.addPurchaser(accounts[1], tokenAllocation, paymentAmount, daiTokenInstance.address, paymentPeriodSeconds, cliffSeconds, vestingPeriodSeconds, {from: purchaser}),
          "Ownable: caller is not the owner"
        );
    });
  });

  describe( "purchase", function() {
    it("Should purchase with tokens successfully", async () => {
        await addPurchaser();

        const daiBalanceBefore = await daiTokenInstance.balanceOf(purchaser);

        await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
        const result = await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });
        truffleAssert.eventEmitted(result, 'Staked', {
          account: accounts[1],
          stakedAmount: web3.utils.toBN(Number(tokenAllocation))
        });

        const daiBalanceAfter = await daiTokenInstance.balanceOf(purchaser);
        assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.add(paymentAmount)));
    });

    it("Should purchase with eth successfully", async () => {
      await addPurchaser(purchaser, GENESIS_ADDRESS);

      const ethBalanceBefore = web3.utils.toBN(await web3.eth.getBalance(purchaser));
      const result = await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser, value: paymentAmount });
      const feePayed = web3.utils.toBN(result.receipt.gasUsed * Number((await web3.eth.getTransaction(result.tx)).gasPrice));

      truffleAssert.eventEmitted(result, 'Staked', {
        account: accounts[1],
        stakedAmount: web3.utils.toBN(Number(tokenAllocation))
      });

      const ethBalanceAfter = web3.utils.toBN(await web3.eth.getBalance(purchaser));
      assert.equal(true, ethBalanceBefore.eq(ethBalanceAfter.add(paymentAmount).add(feePayed)));
  });

    it("Should purchase successfully with 2 steps", async () => {
      await addPurchaser();

      let daiBalanceBefore = await daiTokenInstance.balanceOf(purchaser);
      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      let result = await saftInstance.purchase(purchaser, bn1e18.muln(7), { from: purchaser });

      truffleAssert.eventEmitted(result, 'Staked', {
        account: accounts[1],
        stakedAmount: web3.utils.toBN(Number(tokenAllocation) * 70 / 100)
      });

      let daiBalanceAfter = await daiTokenInstance.balanceOf(purchaser);
      assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.add(bn1e18.muln(7))));

      daiBalanceBefore = await daiTokenInstance.balanceOf(purchaser);

      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      result = await saftInstance.purchase(purchaser, bn1e18.muln(3), { from: purchaser });

      truffleAssert.eventEmitted(result, 'Staked', {
        account: accounts[1],
        stakedAmount: web3.utils.toBN(Number(tokenAllocation) * 30 / 100)
      });

      daiBalanceAfter = await daiTokenInstance.balanceOf(purchaser);
      assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.add(bn1e18.muln(3))));
    });

    it("Should purchase successfully after update allocation x2", async () => {
      await addPurchaser();

      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      let result = await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });
      truffleAssert.eventEmitted(result, 'Staked', {
        account: accounts[1],
        stakedAmount: web3.utils.toBN(Number(tokenAllocation))
      });

      let saftBalanceBefore = await suDAOInstance.balanceOf(saftInstance.address);

      // x2 approve
      await suDAOInstance.approve(saftInstance.address, tokenAllocation);
      await saftInstance.increaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).muln(2), paymentAmount.muln(2));

      let saftBalanceAfter = await suDAOInstance.balanceOf(saftInstance.address);
      assert.equal(true, saftBalanceBefore.eq(saftBalanceAfter.sub(web3.utils.toBN(tokenAllocation))));

      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      result = await saftInstance.purchase(
          purchaser,
          paymentAmount, { from: purchaser });

      truffleAssert.eventEmitted(result, 'Staked', {
        account: accounts[1],
        stakedAmount: web3.utils.toBN(Number(tokenAllocation))
      });
    });

    it("Should not be able to purchase due to payment deadline is over", async () => {
        await addPurchaser();

        await daiTokenInstance.approve(saftInstance.address, tokenAllocation, { from: purchaser });
        // let payAmount = (web3.utils.toBN(tokenAllocation).mul(web3.utils.toBN(pricePerToken))).div(web3.utils.toBN(100)).div(web3.utils.toBN(1e18));
        increaseTime(web3, paymentPeriodSeconds);

        await truffleAssert.reverts(
          saftInstance.purchase(purchaser, paymentAmount, { from: purchaser }),
          "payment deadline is over"
        );
    });

    it("Should not be able to purchase due to exceeded the purchase limit", async () => {
        await addPurchaser();

        await daiTokenInstance.approve(saftInstance.address, tokenAllocation, { from: purchaser });
        // let payAmount = (web3.utils.toBN(tokenAllocation).div(web3.utils.toBN(1e18)).mul(web3.utils.toBN(pricePerToken))).div(web3.utils.toBN(100));

        await truffleAssert.reverts(
          saftInstance.purchase(purchaser, paymentAmount.muln(2), { from: purchaser }),
          "exceeded the purchase limit"
        );
    });

    it("Should not be able to purchase due to transfer amount exceeds allowance", async () => {
      await addPurchaser();

      //await daiTokenInstance.approve(saftInstance.address, tokenAllocation, { from: purchaser });
      // let payAmount = (web3.utils.toBN(tokenAllocation).div(web3.utils.toBN(1e18)).mul(web3.utils.toBN(pricePerToken))).div(web3.utils.toBN(100));

      await truffleAssert.reverts(
        saftInstance.purchase(purchaser, paymentAmount, { from: purchaser }),
        "ERC20: transfer amount exceeds allowance"
      );
  });
  });

  describe( "increaseAllocation", function() {
    it("Should successfully increase allocation", async () => {
      await addPurchaser();

      let saftBalanceBefore = await suDAOInstance.balanceOf(saftInstance.address);

      // x2 approve
      await suDAOInstance.approve(saftInstance.address, tokenAllocation);
      await saftInstance.increaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).muln(2), paymentAmount.muln(2));

      let saftBalanceAfter = await suDAOInstance.balanceOf(saftInstance.address);
      assert.equal(true, saftBalanceBefore.eq(saftBalanceAfter.sub(web3.utils.toBN(tokenAllocation))));
    });

    it("Should not be able to increase allocation due to invalid newMaxTokenAllocation", async () => {
      await addPurchaser();

      // x2 approve
      await suDAOInstance.approve(saftInstance.address, tokenAllocation);

      await truffleAssert.reverts(
        saftInstance.increaseAllocation(purchaser, tokenAllocation, paymentAmount.muln(2)),
        "invalid newMaxTokenAllocation"
      );
    });

    it("Should not be able to increase allocation due to caller is not the owner", async () => {
        await addPurchaser();
        // x2 approve
        await suDAOInstance.approve(saftInstance.address, tokenAllocation);

        await truffleAssert.reverts(
          saftInstance.increaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).muln(2), paymentAmount.muln(2), { from: purchaser }),
          "Ownable: caller is not the owner"
        );
    });

    it("Should not be able to increase allocation due to transfer amount exceeds allowance", async () => {
      await addPurchaser();

      await truffleAssert.reverts(
        saftInstance.increaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).muln(2), paymentAmount.muln(2)),
        "ERC20: transfer amount exceeds allowance"
      );
    });

    it("Should not be able to increase allocation due to purchase isn't initialized", async () => {
      // x2 approve
      await suDAOInstance.approve(saftInstance.address, tokenAllocation);

      await truffleAssert.reverts(
        saftInstance.increaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).muln(2), paymentAmount),
        ERRORS.PURCHASE_IS_NOT_INIT
      );
    });
  })

  describe( "decreaseAllocation", function() {
    it("Should successfully decrease allocation", async () => {
      await addPurchaser();
      let saftBalanceBefore = await suDAOInstance.balanceOf(saftInstance.address);

      await saftInstance.decreaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).divn(2), paymentAmount.divn(2));

      let saftBalanceAfter = await suDAOInstance.balanceOf(saftInstance.address);
      assert.equal(true, saftBalanceBefore.eq(saftBalanceAfter.add(web3.utils.toBN(tokenAllocation).divn(2))));
    });

    it("Should successfully decrease allocation to zero", async () => {
      await addPurchaser();
      let saftBalanceBefore = await suDAOInstance.balanceOf(saftInstance.address);

      await saftInstance.decreaseAllocation(purchaser, '0', '0');

      let saftBalanceAfter = await suDAOInstance.balanceOf(saftInstance.address);
      assert.equal(true, saftBalanceBefore.eq(saftBalanceAfter.add(web3.utils.toBN(tokenAllocation))));
    });

    it("Should not be able to decrease allocation due to invalid newMaxTokenAllocation", async () => {
      await addPurchaser();
      await truffleAssert.reverts(
        saftInstance.decreaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).muln(2), paymentAmount.muln(2)),
        "invalid newMaxTokenAllocation"
      );
    });

    it("Should not be able to decrease allocation due to caller is not the owner", async () => {
        await addPurchaser();
        await truffleAssert.reverts(
          saftInstance.decreaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).divn(2), paymentAmount.divn(2), { from: purchaser }),
          "Ownable: caller is not the owner"
        );
    });

    it("Should not be able to decrease allocation due to caller is not the owner 2", async () => {
      await addPurchaser();

      await truffleAssert.reverts(
        saftInstance.decreaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).divn(2), paymentAmount.divn(2), { from: purchaser }),
        "Ownable: caller is not the owner"
      );
  });

    it("Should not be able to decrease allocation due to invalid newMaxTokenAllocation 2", async () => {
      await truffleAssert.reverts(
        saftInstance.decreaseAllocation(purchaser, web3.utils.toBN(tokenAllocation).divn(2), paymentAmount),
        ERRORS.PURCHASE_IS_NOT_INIT
      );
    });
  })

  describe( "updatePaymentDeadline", function() {
    it("Should successfully update payment deadline", async () => {
      await addPurchaser();
      let result = await saftInstance.updatePaymentDeadline(purchaser, web3.utils.toBN(paymentPeriodSeconds));

      let txTimestamp = (await web3.eth.getBlock(result.receipt.blockNumber)).timestamp;
      // @ts-ignore
        assert.equal(true, (web3.utils.toBN(Number(txTimestamp) + paymentPeriodSeconds).eq(web3.utils.toBN((await saftInstance.presale(purchaser)).paymentDeadline))));
    });

    it("Should not be able to update payment deadline due to caller is not the owner", async () => {
      await addPurchaser();

      await truffleAssert.reverts(
        saftInstance.updatePaymentDeadline(purchaser, web3.utils.toBN(paymentPeriodSeconds), { from: purchaser }),
        "Ownable: caller is not the owner"
      );
    });
  })

  // describe( "updatePaymentMethod", function() {
  //   it("Should successfully update payment method", async () => {
  //     await addPurchaser();
  //
  //     let usdtTokenInstance = await Token.new('USDT Stablecoin', 'USDT', '6');
  //     let result = await saftInstance.updatePaymentMethod(purchaser, usdtTokenInstance.address);
  //
  //     assert.equal(true, (usdtTokenInstance.address == (await saftInstance.presale(purchaser)).paymentMethod));
  //   });
  //
  //   it("Should not be able to update payment method due to caller is not the owner", async () => {
  //     await addPurchaser();
  //     let usdtTokenInstance = await Token.new('USDT Stablecoin', 'USDT', '6');
  //
  //     await truffleAssert.reverts(
  //       saftInstance.updatePaymentMethod(purchaser, usdtTokenInstance.address, { from: purchaser }),
  //       "Ownable: caller is not the owner"
  //     );
  //   });
  //
  //   it("Should not be able to update payment method due to purchase isn't initialized", async () => {
  //     let usdtTokenInstance = await Token.new('USDT Stablecoin', 'USDT', '6');
  //
  //     await truffleAssert.reverts(
  //       saftInstance.updatePaymentMethod(purchaser, usdtTokenInstance.address),
  //         ERRORS.PURCHASE_IS_NOT_INIT
  //     );
  //   });
  // })

  describe( "claimTokens", function () {
      it ("revert before cliff", async () => {
          await addPurchaser();

          await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
          await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

          await truffleAssert.reverts(
              saftInstance.claimTokens({ from: purchaser }),
              "cannot claim tokens before cliff is over"
          );
      })

      it ("something after cliff", async () => {
          await addPurchaser();

          await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
          await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });
          increaseTime(web3, cliffSeconds);

          const result = await saftInstance.claimTokens({ from: purchaser })
          truffleAssert.eventEmitted(result, 'ClaimedReward', {
              account: purchaser
          });
      })

      it ("everything after vesting is over", async () => {
          await addPurchaser();

          await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
          await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });
          increaseTime(web3, vestingPeriodSeconds);

          const result = await saftInstance.claimTokens({ from: purchaser })
          truffleAssert.eventEmitted(result, 'ClaimedReward', {
              account: purchaser,
              rewardAmount: web3.utils.toBN(Number(tokenAllocation))
          });
      })

      it ("half after half vesting is over", async () => {
          await addPurchaser();

          await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
          await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

          increaseTime(web3, (vestingPeriodSeconds-cliffSeconds)/2 + cliffSeconds );

          const result = await saftInstance.claimTokens({ from: purchaser })

          truffleAssert.eventEmitted(result, 'ClaimedReward', (ev: any) => {
            return ev.account === purchaser &&
            web3.utils.toBN(ev.rewardAmount).gt(web3.utils.toBN(Number(tokenAllocation)).divn(2)) &&
            web3.utils.toBN(ev.rewardAmount).lt(web3.utils.toBN(Number(tokenAllocation)).divn(2).add(bn1e18));
          });
      })

      it ("claim twice at the same time", async () => {
          await addPurchaser();

          await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
          await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });
          const halfVesting = cliffSeconds + (vestingPeriodSeconds-cliffSeconds)/2;
          increaseTime(web3, halfVesting);

          const result = await saftInstance.claimTokens({ from: purchaser })

          truffleAssert.eventEmitted(result, 'ClaimedReward', (ev: any) => {
            return ev.account === purchaser &&
            web3.utils.toBN(ev.rewardAmount).gt(web3.utils.toBN(Number(tokenAllocation)).divn(2)) &&
            web3.utils.toBN(ev.rewardAmount).lt(web3.utils.toBN(Number(tokenAllocation)).divn(2).add(bn1e18));
          });

          increaseTime(web3, "10");

          const result2 = await saftInstance.claimTokens({ from: purchaser });

          truffleAssert.eventEmitted(result2, 'ClaimedReward', (ev: any) => {
            return ev.account === purchaser && ev.rewardAmount < Number(bn1e18);
          });
      })
  })

  describe( "adminWithdraw", function () {
    it("withdraw DAI", async () => {
        await addPurchaser();
        await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
        await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

        let daiBalanceBefore = await daiTokenInstance.balanceOf(accounts[0]);
        let result = await saftInstance.adminWithdraw(daiTokenInstance.address);
        let daiBalanceAfter = await daiTokenInstance.balanceOf(accounts[0]);
        assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.sub(paymentAmount)));
    })

    it("withdraw DAI from two purchases", async () => {
        await addPurchaser();
        await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
        await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

        const alice = accounts[2];
        const aliceAmount = paymentAmount.divn(2);
        await addPurchaser(alice);
        await daiTokenInstance.approve(saftInstance.address, aliceAmount, { from: alice });
        await saftInstance.purchase(alice, aliceAmount, { from: alice });


        let daiBalanceBefore = await daiTokenInstance.balanceOf(accounts[0]);
        let result = await saftInstance.adminWithdraw(daiTokenInstance.address);
        let daiBalanceAfter = await daiTokenInstance.balanceOf(accounts[0]);
        assert.equal(true, daiBalanceBefore.eq(daiBalanceAfter.sub(paymentAmount).sub(aliceAmount)));
    })

    it("withdraw suDAO before finish presale", async () => {
        await addPurchaser();

        await truffleAssert.reverts(
            saftInstance.adminWithdraw(suDAOInstance.address),
            "Presale haven't finish yet"
        );
    })

    it("withdraw suDAO after finish presale", async () => {
        await addPurchaser();
        await addPurchaser(accounts[2]);

        increaseTime(web3, presalePeriod);

        let suDAOBalanceLeft = await suDAOInstance.balanceOf(saftInstance.address);

        let suDAOBalanceBefore = await suDAOInstance.balanceOf(accounts[0]);
        await saftInstance.adminWithdraw(suDAOInstance.address);
        let siDAOBalanceAfter = await suDAOInstance.balanceOf(accounts[0]);

        assert.equal(true, suDAOBalanceBefore.eq(siDAOBalanceAfter.sub(suDAOBalanceLeft)));
    })

    it("withdraw ether", async () => {
        await addPurchaser();
        // send ether to contract
        const amount = bn1e18;
        await web3.eth.sendTransaction({from: accounts[3], to: saftInstance.address, value: amount});
        assert.equal(true, web3.utils.toBN( await web3.eth.getBalance(saftInstance.address) ).eq(amount) );
        // withdraw this ether
        const etherBalanceBefore = web3.utils.toBN( await web3.eth.getBalance(owner) );
        // console.log(etherBalanceBefore.toString());
        await saftInstance.adminWithdraw(GENESIS_ADDRESS);
        const etherBalanceAfter = web3.utils.toBN( await web3.eth.getBalance(owner) );
        // console.log(etherBalanceAfter.toString());
        const withdrawnAmount = etherBalanceAfter.sub(etherBalanceBefore);
        const gasUsedMax = bn1e18.muln(0.1);
        assert.equal(true, withdrawnAmount.add(gasUsedMax).gt(amount));
    })
  })

  describe( "donatePurchasedTokens", function() {
    it("Should successfully donate purchased tokens", async () => {
        await addPurchaser();

        await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
        await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

        let tokensBoughtBefore = (await saftInstance.presale(purchaser) as any)._tokensBought;
        assert.equal(true, tokensBoughtBefore > 0);

        let tokensSoldBefore = await saftInstance.totalTokensSold();
        assert.equal(true, tokensSoldBefore.eq(web3.utils.toBN(Number(tokenAllocation))));

        await saftInstance.donatePurchasedTokens({ from: purchaser });
        let tokensBoughtAfter = (await saftInstance.presale(purchaser) as any)._tokensBought;

        assert.equal(0, tokensBoughtAfter);

        // @ts-ignore
        assert.equal(true, tokensSoldBefore.eq(web3.utils.toBN((await saftInstance.totalTokensSold()) + (tokensBoughtBefore - (await saftInstance.presale(purchaser))._tokensClaimed))));
    })

    it("Should not be able to donate if didn't buy anything tokens", async () => {
        await addPurchaser();

        await truffleAssert.reverts(
            saftInstance.donatePurchasedTokens({ from: purchaser }),
            "Account isn't funded"
        );
    })
  })

  describe( "tokenVested", function() {
    it("Should be correct amount of vested tokens after full vesting period", async () => {
        await addPurchaser();

        await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
        await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

        increaseTime(web3, vestingPeriodSeconds);

        assert.equal(true, (await saftInstance.tokenVested(purchaser)).eq(web3.utils.toBN(Number(tokenAllocation))))
    })

    it("Should be correct amount of vested tokens after half vesting period", async () => {
      await addPurchaser();

      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

      increaseTime(web3, vestingPeriodSeconds/2 + cliffSeconds);

      assert.equal(true, (await saftInstance.tokenVested(purchaser)).gte(web3.utils.toBN(Number(tokenAllocation)/2)) && (await saftInstance.tokenVested(purchaser)).lt(web3.utils.toBN(Number(tokenAllocation)/2).add(bn1e18.muln(2))))
    })

    it("Should be correct amount of vested tokens after 3/4 vesting period", async () => {
      await addPurchaser();

      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

      increaseTime(web3, vestingPeriodSeconds*3/4 + cliffSeconds);

      assert.equal(true, (await saftInstance.tokenVested(purchaser)).gte(web3.utils.toBN(Number(tokenAllocation)*3/4)) && (await saftInstance.tokenVested(purchaser)).lt(web3.utils.toBN(Number(tokenAllocation)*3/4).add(bn1e18.muln(2))))
    })

    it("Should be 0 amount of vested tokens before cliff passed", async () => {
      await addPurchaser();

      await daiTokenInstance.approve(saftInstance.address, paymentAmount, { from: purchaser });
      await saftInstance.purchase(purchaser, paymentAmount, { from: purchaser });

      assert.equal(true, (await saftInstance.tokenVested(purchaser)).eq(web3.utils.toBN(0)))
    })
  })

});



