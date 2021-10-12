const Distributor = artifacts.require("TokenDistributor_v3");
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");
const SuDAO = artifacts.require("suDAO");
const TimelockVault = artifacts.require("VestingToken");

const {RINKEBY} = require("./deployed_addresses");

module.exports = function (deployer, network, accounts) {
    let NETWORK = {};
    if (network === RINKEBY.NAME) NETWORK = RINKEBY; else
        return;
    
    deployer.then(async () => {
        const aNftInstance = await AdvisorNft.deployed();
        const suDaoInstance = await SuDAO.deployed();
        const timelockVaultInstance = await TimelockVault.deployed();
        
        await deployer.deploy(
            Distributor,
            aNftInstance.address,
            suDaoInstance.address,
            timelockVaultInstance.address
        );
        const distributorInstance = await Distributor.deployed();
        console.log("distributorInstance: ", distributorInstance.address);
    });
};
