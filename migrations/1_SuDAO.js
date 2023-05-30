const {prepareVanityAddress, fundDeployer, withdrawEther} = require("./utils");

const SuDAO = artifacts.require("SuDAOv2");

module.exports = function (deployer, network, accounts) {
  console.log('start');
  const [deployer_acc, deployer_vanity_1] = accounts;
  deployer.then(async () => {
    // console.log(await artifacts.require("SuAccessControlSingleton"));
    // const accessControlSingleton = await artifacts.require("SuAccessControlSingleton");
    // console.log(accessControlSingleton)
    let suDAOInstance;
    const deployer_vanity = deployer_vanity_1;
    console.log('deployer_acc', deployer_acc);
    console.log('deployer_vanity', deployer_vanity);
    await prepareVanityAddress(web3, deployer_acc, deployer_vanity);
    await fundDeployer(web3, deployer_acc, deployer_vanity);
    {
      await deployer.deploy(SuDAO, "0x03660251f46991b40b9449831dC82e945DE14bd8", {from: deployer_vanity});
      suDAOInstance = await SuDAO.deployed();
      console.log(suDAOInstance);
      await suDAOInstance.transferOwnership(deployer_acc, {from: deployer_vanity});
    }
    await withdrawEther(web3, deployer_vanity, deployer_acc);

    console.log("suDAOv2: ", suDAOInstance.address);
  });
};
