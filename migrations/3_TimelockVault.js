const VeToken = artifacts.require("VeToken");

const SuDAO = artifacts.require("suDAO");

module.exports = function(deployer, network, accounts) {
    deployer.then(async () => {
        const suDaoInstance = await SuDAO.deployed();
        
        await deployer.deploy(VeToken, "Vested StableUnitDAO", "veSuDAO", suDaoInstance.address);
        const veToken = await VeToken.deployed();
        console.log("veToken: ", veToken.address);
    });
};
