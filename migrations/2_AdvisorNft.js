const {A_NFT_JSON} = require("./deployed_addresses");
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");
const {RINKEBY} = require("./deployed_addresses");

module.exports = function (deployer, network, accounts) {
    let NETWORK = {};
    if (network === RINKEBY.NAME) NETWORK = RINKEBY; else
        return;
    
    deployer.then(async () => {
        let aNftInstance;
        if (NETWORK.A_NFT) {
            aNftInstance = await AdvisorNft.at(NETWORK.A_NFT)
        } else {
            await deployer.deploy(AdvisorNft);
            aNftInstance = await AdvisorNft.deployed();
            await aNftInstance.setBaseURI(`https://ipfs.io/ipfs/${A_NFT_JSON}?id=`);
            // test mock deploying
            for (let i = 0; i < NETWORK.DEVELOPERS.length; i++) {
                console.log("aNftInstance.mint(NETWORK.DEVELOPERS[i], 1200 + 200*i)");
                await aNftInstance.mintWithLevel(NETWORK.DEVELOPERS[i], 1200 + 200 * i);
            }
        }
    });
};
