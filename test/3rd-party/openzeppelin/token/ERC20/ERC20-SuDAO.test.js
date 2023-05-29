const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Transfer,
  shouldBehaveLikeERC20Approve,
} = require('./ERC20.behavior');
const {deployProxy, BN_1E18} = require("../../../../utils");
const { contract, ethers} = require("hardhat");
const {latest} = require("../../../../utils/time");
const {shouldBehaveLikeERC20Burnable} = require("./extensions/ERC20BurnableUpgradeable.behavior");

// const ERC20 = artifacts.require('$ERC20');
// const ERC20Decimals = artifacts.require('$ERC20DecimalsMock');
const TOKEN = artifacts.require("VeERC20v2");

contract('ERC20', function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;
  const initialSupply = new BN(100);

  // const name = 'My Token';
  // const symbol = 'MTKN';

  const stableUnitInitialize = async () => {
    [admin] = await ethers.getSigners();

    const tgeSeconds = 50;
    const cliffSeconds = 100;
    const vestingSeconds = 400;
    const tgeUnlockRatio1e18 = BN_1E18.mul(10).div(100);
    const vestingFrequencySeconds = 100;

    const accessControlSingleton = await deployProxy( "SuAccessControlSingleton", [admin.address, admin.address], undefined, false);
    const suDAO = await deployProxy("SuDAOv2", [accessControlSingleton.address], undefined, false);
    const deployTimestamp = await latest();
    const ve =  await deployProxy("VeERC20v2", [accessControlSingleton.address, suDAO.address, deployTimestamp + tgeSeconds], undefined, false);

    await ve.connect(admin).updateTimestamps(
        deployTimestamp + tgeSeconds,
        cliffSeconds,
        vestingSeconds,
        tgeUnlockRatio1e18,
        vestingFrequencySeconds
    );

    await suDAO.connect(admin).mint(admin.address, initialSupply.toString());
    await suDAO.connect(admin).approve(ve.address, initialSupply.toString());
    await ve.connect(admin).lockUnderVesting(admin.address, initialSupply.toString());

    await ve.adminTransferUnlock(initialHolder, true);
    await ve.adminTransferUnlock(recipient, true);
    await ve.adminTransferUnlock(anotherAccount, true);

    return ve.address;
  }

  beforeEach(async function () {
    const veAddress = await stableUnitInitialize();
    this.token = await TOKEN.at(veAddress);
    // this.token = await ERC20.new(name, symbol);
    // await this.token.$_mint(initialHolder, initialSupply);
  });

  // it('has a name', async function () {
  //   expect(await this.token.name()).to.equal(name);
  // });
  //
  // it('has a symbol', async function () {
  //   expect(await this.token.symbol()).to.equal(symbol);
  // });

  it('has 18 decimals', async function () {
    expect(await this.token.decimals()).to.be.bignumber.equal('18');
  });

  // describe('set decimals', function () {
  //   const decimals = new BN(6);
  //
  //   it('can set decimals during construction', async function () {
  //     const token = await ERC20Decimals.new(name, symbol, decimals);
  //     expect(await token.decimals()).to.be.bignumber.equal(decimals);
  //   });
  // });

  shouldBehaveLikeERC20('ERC20', initialSupply, initialHolder, recipient, anotherAccount);

  shouldBehaveLikeERC20Burnable(initialHolder, initialSupply, [recipient]);

  describe('decrease allowance', function () {
    describe('when the spender is not the zero address', function () {
      const spender = recipient;

      function shouldDecreaseApproval(amount) {
        describe('when there was no approved amount before', function () {
          it('reverts', async function () {
            await expectRevert(
                this.token.decreaseAllowance(spender, amount, { from: initialHolder }),
                'ERC20: decreased allowance below zero',
            );
          });
        });

        describe('when the spender had an approved amount', function () {
          const approvedAmount = amount;

          beforeEach(async function () {
            await this.token.approve(spender, approvedAmount, { from: initialHolder });
          });

          it('emits an approval event', async function () {
            expectEvent(
                await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder }),
                'Approval',
                { owner: initialHolder, spender: spender, value: new BN(0) },
            );
          });

          it('decreases the spender allowance subtracting the requested amount', async function () {
            await this.token.decreaseAllowance(spender, approvedAmount.subn(1), { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('1');
          });

          it('sets the allowance to zero when all allowance is removed', async function () {
            await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });
            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('0');
          });

          it('reverts when more than the full allowance is removed', async function () {
            await expectRevert(
                this.token.decreaseAllowance(spender, approvedAmount.addn(1), { from: initialHolder }),
                'ERC20: decreased allowance below zero',
            );
          });
        });
      }

      describe('when the sender has enough balance', function () {
        const amount = initialSupply;

        shouldDecreaseApproval(amount);
      });

      describe('when the sender does not have enough balance', function () {
        const amount = initialSupply.addn(1);

        shouldDecreaseApproval(amount);
      });
    });

    describe('when the spender is the zero address', function () {
      const amount = initialSupply;
      const spender = ZERO_ADDRESS;

      it('reverts', async function () {
        await expectRevert(
            this.token.decreaseAllowance(spender, amount, { from: initialHolder }),
            'ERC20: decreased allowance below zero',
        );
      });
    });
  });

  describe('increase allowance', function () {
    const amount = initialSupply;

    describe('when the spender is not the zero address', function () {
      const spender = recipient;

      describe('when the sender has enough balance', function () {
        it('emits an approval event', async function () {
          expectEvent(await this.token.increaseAllowance(spender, amount, { from: initialHolder }), 'Approval', {
            owner: initialHolder,
            spender: spender,
            value: amount,
          });
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, new BN(1), { from: initialHolder });
          });

          it('increases the spender allowance adding the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
          });
        });
      });

      describe('when the sender does not have enough balance', function () {
        const amount = initialSupply.addn(1);

        it('emits an approval event', async function () {
          expectEvent(await this.token.increaseAllowance(spender, amount, { from: initialHolder }), 'Approval', {
            owner: initialHolder,
            spender: spender,
            value: amount,
          });
        });

        describe('when there was no approved amount before', function () {
          it('approves the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
          });
        });

        describe('when the spender had an approved amount', function () {
          beforeEach(async function () {
            await this.token.approve(spender, new BN(1), { from: initialHolder });
          });

          it('increases the spender allowance adding the requested amount', async function () {
            await this.token.increaseAllowance(spender, amount, { from: initialHolder });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
          });
        });
      });
    });

    describe('when the spender is the zero address', function () {
      const spender = ZERO_ADDRESS;

      it('reverts', async function () {
        await expectRevert(
            this.token.increaseAllowance(spender, amount, { from: initialHolder }),
            'ERC20: approve to the zero address',
        );
      });
    });
  });

  describe.skip('_mint', function () {
    const amount = new BN(50);
    it('rejects a null account', async function () {
      await expectRevert(this.token.$_mint(ZERO_ADDRESS, amount), 'ERC20: mint to the zero address');
    });

    describe('for a non zero account', function () {
      beforeEach('minting', async function () {
        this.receipt = await this.token.$_mint(recipient, amount);
      });

      it('increments totalSupply', async function () {
        const expectedSupply = initialSupply.add(amount);
        expect(await this.token.totalSupply()).to.be.bignumber.equal(expectedSupply);
      });

      it('increments recipient balance', async function () {
        expect(await this.token.balanceOf(recipient)).to.be.bignumber.equal(amount);
      });

      it('emits Transfer event', async function () {
        const event = expectEvent(this.receipt, 'Transfer', { from: ZERO_ADDRESS, to: recipient });

        expect(event.args.value).to.be.bignumber.equal(amount);
      });
    });
  });

  describe.skip('_burn', function () {
    it('rejects a null account', async function () {
      await expectRevert(this.token.$_burn(ZERO_ADDRESS, new BN(1)), 'ERC20: burn from the zero address');
    });

    describe('for a non zero account', function () {
      it('rejects burning more than balance', async function () {
        await expectRevert(
            this.token.$_burn(initialHolder, initialSupply.addn(1)),
            'ERC20: burn amount exceeds balance',
        );
      });

      const describeBurn = function (description, amount) {
        describe(description, function () {
          beforeEach('burning', async function () {
            this.receipt = await this.token.$_burn(initialHolder, amount);
          });

          it('decrements totalSupply', async function () {
            const expectedSupply = initialSupply.sub(amount);
            expect(await this.token.totalSupply()).to.be.bignumber.equal(expectedSupply);
          });

          it('decrements initialHolder balance', async function () {
            const expectedBalance = initialSupply.sub(amount);
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(expectedBalance);
          });

          it('emits Transfer event', async function () {
            const event = expectEvent(this.receipt, 'Transfer', { from: initialHolder, to: ZERO_ADDRESS });

            expect(event.args.value).to.be.bignumber.equal(amount);
          });
        });
      };

      describeBurn('for entire balance', initialSupply);
      describeBurn('for less amount than balance', initialSupply.subn(1));
    });
  });

  describe.skip('_transfer', function () {
    shouldBehaveLikeERC20Transfer('ERC20', initialHolder, recipient, initialSupply, function (from, to, amount) {
      return this.token.$_transfer(from, to, amount);
    });

    describe('when the sender is the zero address', function () {
      it('reverts', async function () {
        await expectRevert(
            this.token.$_transfer(ZERO_ADDRESS, recipient, initialSupply),
            'ERC20: transfer from the zero address',
        );
      });
    });
  });

  describe.skip('_approve', function () {
    shouldBehaveLikeERC20Approve('ERC20', initialHolder, recipient, initialSupply, function (owner, spender, amount) {
      return this.token.$_approve(owner, spender, amount);
    });

    describe('when the owner is the zero address', function () {
      it('reverts', async function () {
        await expectRevert(
            this.token.$_approve(ZERO_ADDRESS, recipient, initialSupply),
            'ERC20: approve from the zero address',
        );
      });
    });
  });
});