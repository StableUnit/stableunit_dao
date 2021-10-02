const SuDAO = artifacts.require("suDAO");

module.exports = function(deployer, network, accounts) {
    deployer.then(async () => {
        await deployer.deploy(SuDAO, 0);
        this.suDAO = await SuDAO.deployed();
        console.log("suDAO: ", this.suDAO.address);
    });
};
