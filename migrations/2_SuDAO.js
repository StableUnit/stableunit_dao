const SuDAO = artifacts.require("suDAO");
const {RINKEBY} = require("./deployed_addresses");

module.exports = function(deployer, network, accounts) {
    let NETWORK = {};
    if (network === RINKEBY.NAME) NETWORK = RINKEBY; else
        return;
    
    deployer.then(async () => {
        await deployer.deploy(SuDAO, 0);
        this.suDAO = await SuDAO.deployed();
        console.log("suDAO: ", this.suDAO.address);
    });
};
