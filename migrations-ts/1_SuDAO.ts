import {prepareVanityAddress, fundDeployer, withdrawEther} from "../scripts/utils";
import {artifacts, ethers, web3} from "hardhat";
import {SuAccessControlSingleton} from "../typechain";

const SuDAO = artifacts.require("SuDAOv2");

module.exports = function (deployer, network, accounts) {
  console.log('start');
  const [deployer_acc, deployer_vanity_1] = accounts;
  deployer.then(async () => {
    const accessControlSingleton = await ethers.getContract("SuAccessControlSingleton");

    let suDAOInstance;
    const deployer_vanity = deployer_vanity_1;
    await prepareVanityAddress(web3, deployer_acc, deployer_vanity);
    await fundDeployer(web3, deployer_acc, deployer_vanity);
    {
      await deployer.deploy(SuDAO, accessControlSingleton.address, {from: deployer_vanity});
      suDAOInstance = await SuDAO.deployed();
      await suDAOInstance.transferOwnership(deployer_acc, {from: deployer_vanity});
    }
    await withdrawEther(web3, deployer_vanity, deployer_acc);

    console.log("suDAOv2: ", suDAOInstance.address);
  });
};
export {}
