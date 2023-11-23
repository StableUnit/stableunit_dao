// It's copy-paste of oz Votes test.
// Here we changed only artifacts name (to test MockSuVotes), constructor arguments for Votes and this.chainId.
const { expectRevert, BN } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const {
  shouldBehaveLikeVotes,
} = require('./Votes.behavior');
const {ZERO_ADDRESS} = require("@openzeppelin/test-helpers/src/constants");

// To test like OZ we can get VotesMock.sol from
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/mocks/VotesMock.sol
const Votes = artifacts.require('MockSuVotes');

contract('Votes', function (accounts) {
  const [ account1, account2, account3 ] = accounts;
  beforeEach(async function () {
    this.name = 'My Vote';
    this.votes = await Votes.new(ZERO_ADDRESS, this.name);
  });

  it('starts with zero votes', async function () {
    expect(await this.votes.getTotalSupply()).to.be.bignumber.equal('0');
  });

  describe('performs voting operations', function () {
    beforeEach(async function () {
      this.tx1 = await this.votes.mint(account1, 1);
      this.tx2 = await this.votes.mint(account2, 1);
      this.tx3 = await this.votes.mint(account3, 1);
    });

    it('reverts if block number >= current block', async function () {
      await expectRevert(
          this.votes.getPastTotalSupply(this.tx3.receipt.blockNumber + 1),
          'Votes: future lookup',
      );
    });

    it('delegates', async function () {
      await this.votes.delegate(account3, account2);

      expect(await this.votes.delegates(account3)).to.be.equal(account2);
    });

    it('returns total amount of votes', async function () {
      expect(await this.votes.getTotalSupply()).to.be.bignumber.equal('3');
    });
  });

  describe('performs voting workflow', function () {
    beforeEach(async function () {
      this.chainId = 31337;
      this.account1 = account1;
      this.account2 = account2;
      this.account1Delegatee = account2;
      this.NFT0 = new BN('10000000000000000000000000');
      this.NFT1 = new BN('10');
      this.NFT2 = new BN('20');
      this.NFT3 = new BN('30');
    });

    shouldBehaveLikeVotes();
  });
});
