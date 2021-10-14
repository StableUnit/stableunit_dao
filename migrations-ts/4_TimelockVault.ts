const VeToken = artifacts.require("VestingToken");
const SuDAO = artifacts.require("suDAO");
const {RINKEBY} = require("./deployed_addresses");

module.exports = function (deployer, network, accounts) {
    let NETWORK = {};
    if (network === RINKEBY.NAME) NETWORK = RINKEBY; else
        return;

    deployer.then(async () => {
        const suDaoInstance = await SuDAO.deployed();

        await deployer.deploy(VeToken, "Vested StableUnitDAO", "veSuDAO", suDaoInstance.address);
        const veToken = await VeToken.deployed();
        console.log("veToken: ", veToken.address);
    });
};
