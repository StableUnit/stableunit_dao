import {Bonus, MockErc721, SuAccessControlSingleton} from "../../typechain";
import {SignerWithAddress} from "hardhat-deploy-ethers/signers";
import deployProxy from "../utils/deploy";
import {ethers} from "hardhat";
import {ContractTransaction} from "ethers";
import {expect} from "chai";
import {ADDRESS_ZERO, BN_1E18, BN_1E6} from "../utils";

describe("Bonus", () => {
  let accounts: Record<string, SignerWithAddress>;
  let bonus: Bonus;
  let mockNft: MockErc721;
  let tx: ContractTransaction | Promise<ContractTransaction>;

  const beforeAllFunc = (needMock: boolean) => async () => {
    const [deployer, dao, alice, bob, carl] = await ethers.getSigners();
    accounts = { deployer, dao, alice, bob, carl };

    const accessControlSingleton = await deployProxy("SuAccessControlSingleton", [dao.address, ADDRESS_ZERO], undefined, false) as SuAccessControlSingleton;
    bonus = await deployProxy("Bonus", [accessControlSingleton.address, ADDRESS_ZERO], undefined, false) as Bonus;
    if (needMock) {
      mockNft = await deployProxy("MockErc721", ["Mock StableUnit NFT", "SuNFTPro"], undefined, false) as MockErc721;
    }
  };

  describe("Correct rights and setNftInfo", function () {
    this.beforeEach(beforeAllFunc(true));

    it("deployer can't call anything", async () => {
      tx = bonus.connect(accounts.deployer).setCommunityAdmin(accounts.dao.address, BN_1E6, 100);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.deployer).setNftInfo(mockNft.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.deployer).setUserInfo(accounts.alice.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.deployer).distributeXp(accounts.alice.address, 5000);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.deployer).setAdmin(accounts.dao.address, true);
      await expect(tx).to.be.reverted;
    });

    it("DAO can only call setAdmin", async () => {
      tx = bonus.connect(accounts.dao).setCommunityAdmin(accounts.dao.address, BN_1E6, 100);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.dao).setNftInfo(mockNft.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.dao).setUserInfo(accounts.alice.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.dao).distributeXp(accounts.alice.address, 5000);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.dao).setAdmin(accounts.dao.address, true);
      await expect(tx).not.to.be.reverted;

      tx = bonus.connect(accounts.dao).setAdmin(accounts.alice.address, true);
      await expect(tx).not.to.be.reverted;
    });

    it("admin (=DAO) can't call distribute ", async () => {
      await bonus.connect(accounts.dao).setAdmin(accounts.dao.address, true);

      tx = bonus.connect(accounts.dao).setNftInfo(mockNft.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).not.to.be.reverted;

      tx = bonus.connect(accounts.dao).setUserInfo(accounts.alice.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).not.to.be.reverted;

      tx = bonus.connect(accounts.dao).distributeXp(accounts.alice.address, 5000);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.dao).setCommunityAdmin(accounts.dao.address, BN_1E6, 100);
      await expect(tx).not.to.be.reverted;
    });

    it("admin (NOT DAO) can't call distribute ", async () => {
      await bonus.connect(accounts.dao).setAdmin(accounts.bob.address, true);

      tx = bonus.connect(accounts.bob).setNftInfo(mockNft.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).not.to.be.reverted;

      tx = bonus.connect(accounts.bob).setUserInfo(accounts.alice.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).not.to.be.reverted;

      tx = bonus.connect(accounts.bob).distributeXp(accounts.alice.address, 5000);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.bob).setCommunityAdmin(accounts.alice.address, BN_1E6, 100);
      await expect(tx).not.to.be.reverted;
    });

    it("communityAdmin can call only distribute", async () => {
      // bob is admin, alice is communityAdmin, carl is user
      await bonus.connect(accounts.dao).setAdmin(accounts.bob.address, true);
      await bonus.connect(accounts.bob).setCommunityAdmin(accounts.alice.address, BN_1E6, 100);

      tx = bonus.connect(accounts.alice).distributeXp(accounts.carl.address, 5000);
      await expect(tx).not.to.be.reverted;

      tx = bonus.connect(accounts.alice).setAdmin(accounts.carl.address, true);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.alice).setCommunityAdmin(accounts.carl.address, BN_1E6, 100);
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.alice).setNftInfo(mockNft.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).to.be.reverted;

      tx = bonus.connect(accounts.alice).setUserInfo(accounts.carl.address, BN_1E6, BN_1E18.div(10));
      await expect(tx).to.be.reverted;
    });

    it("setNftInfo set all variables correct", async () => {
      const allocation = BN_1E6;
      const discount = BN_1E18.div(10);

      await bonus.connect(accounts.dao).setAdmin(accounts.bob.address, true);
      await bonus.connect(accounts.bob).setNftInfo(mockNft.address, allocation, discount);

      const newAllocation = await bonus.getNftAllocation(mockNft.address);
      expect(newAllocation).to.be.equal(allocation);

      const newDiscount = await bonus.getNftBonus(mockNft.address);
      expect(newDiscount).to.be.equal(discount);
    });
  });

  describe("Correct distributor and setUserInfo", function () {
    this.beforeEach(beforeAllFunc(false));

    it("setUserInfo set all variables correct", async () => {
      const allocation = BN_1E6;
      const discount = BN_1E18.div(10);

      await bonus.connect(accounts.dao).setAdmin(accounts.bob.address, true);
      await bonus.connect(accounts.bob).setUserInfo(accounts.alice.address, allocation, discount);

      const newAllocation = await bonus.getAllocation(accounts.alice.address);
      expect(newAllocation).to.be.equal(allocation);

      const newDiscount = await bonus.getBonus(accounts.alice.address);
      expect(newDiscount).to.be.equal(discount);
    });

    it("distribute with allowed level", async () => {
      // bob is admin, alice is communityAdmin, carl is user
      const userXP = 85120;
      const lvl = 20;
      const allowedLvl = 22;
      const adminXP = 100000;

      await bonus.connect(accounts.dao).setAdmin(accounts.bob.address, true);
      await bonus.connect(accounts.bob).setCommunityAdmin(accounts.alice.address, adminXP, allowedLvl);

      let userInfo = await bonus.userInfo(accounts.carl.address);
      expect(userInfo.xp).to.be.equal(0);
      expect(await bonus.getLevel(accounts.carl.address)).to.be.equal(1);

      await bonus.connect(accounts.alice).distributeXp(accounts.carl.address, userXP);
      let communityAdminInfo = await bonus.communityAdminInfo(accounts.alice.address);
      userInfo = await bonus.userInfo(accounts.carl.address);

      expect(communityAdminInfo.levelLimit).to.be.equal(allowedLvl);
      expect(communityAdminInfo.xpLimit).to.be.equal(adminXP - userXP);

      expect(userInfo.xp).to.be.equal(userXP);
      expect(userInfo.allocation).to.be.equal(0);
      expect(userInfo.donationBonusRatio).to.be.equal(0);
      expect(await bonus.getLevel(accounts.carl.address)).to.be.equal(lvl);

      // can't distribute more xp than admin has
      tx = bonus.connect(accounts.alice).distributeXp(accounts.carl.address, adminXP - userXP + 1);
      await expect(tx).to.be.reverted;

      // admin can distribute all xp
      await bonus.connect(accounts.alice).distributeXp(accounts.carl.address, adminXP - userXP);

      communityAdminInfo = await bonus.communityAdminInfo(accounts.alice.address);
      userInfo = await bonus.userInfo(accounts.carl.address);

      expect(communityAdminInfo.levelLimit).to.be.equal(allowedLvl);
      expect(communityAdminInfo.xpLimit).to.be.equal(0);

      expect(userInfo.xp).to.be.equal(adminXP);
      expect(userInfo.allocation).to.be.equal(0);
      expect(userInfo.donationBonusRatio).to.be.equal(0);
      expect(await bonus.getLevel(accounts.carl.address)).to.be.equal(lvl + 1);
    });

    it("distribute with restricted level", async () => {
      // bob is admin, alice is communityAdmin, carl is user
      const userXP = 85120;
      const restrictedLvl = 10;
      const adminXP = 100000;

      await bonus.connect(accounts.dao).setAdmin(accounts.bob.address, true);
      await bonus.connect(accounts.bob).setCommunityAdmin(accounts.alice.address, adminXP, restrictedLvl);

      // can't distribute more lvl than admin has
      tx = bonus.connect(accounts.alice).distributeXp(accounts.carl.address, userXP);
      await expect(tx).to.be.reverted;

      // can't distribute more xp than admin has
      tx = bonus.connect(accounts.alice).distributeXp(accounts.carl.address, userXP * 2);
      await expect(tx).to.be.reverted;
    });

    it("user can get max lvl", async () => {
      // bob is admin, alice is communityAdmin, carl is user
      const userXP = 1_810_034_208;
      const lvl = 75;
      const allowedLvl = 100;
      const adminXP = 2*1e9;

      await bonus.connect(accounts.dao).setAdmin(accounts.bob.address, true);
      await bonus.connect(accounts.bob).setCommunityAdmin(accounts.alice.address, adminXP, allowedLvl);

      await bonus.connect(accounts.alice).distributeXp(accounts.carl.address, userXP);
      const userInfo = await bonus.userInfo(accounts.carl.address);

      expect(userInfo.xp).to.be.equal(userXP);
      expect(await bonus.getLevel(accounts.carl.address)).to.be.equal(lvl);
    });
  })
});
