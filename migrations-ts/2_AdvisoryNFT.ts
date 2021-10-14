import {getDeployedAddresses} from "./deployed_addresses";
import {checkVanityAddress, fundDeployer, withdrawEther} from "./utils";

const {A_NFT_JSON} = require("./deployed_addresses");
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");

module.exports = function (deployer, network, accounts) {
    const [deployer_acc,
        deployer_vanity_1,
        deployer_vanity_2,
        deployer_vanity_3,
        deployer_vanity_4,
        deployer_vanity_5,
    ] = accounts;
    const DEPLOYED = getDeployedAddresses(network);


    // @ts-ignore
    deployer.then(async () => {
        let aNftInstance;
        if (DEPLOYED.A_NFT) {
            aNftInstance = await AdvisorNft.at(DEPLOYED.A_NFT)
        } else {
            const deployer_vanity = deployer_vanity_2;
            await checkVanityAddress(web3, deployer_acc, deployer_vanity);
            await fundDeployer(web3, deployer_acc, deployer_vanity);
            {
                await deployer.deploy(AdvisorNft, {from: deployer_vanity});
                aNftInstance = await AdvisorNft.deployed();
                await aNftInstance.transferOwnership(deployer_acc, {from: deployer_vanity});
            }
            await withdrawEther(web3, deployer_vanity, deployer_acc);

            await aNftInstance.setBaseURI(`https://ipfs.io/ipfs/${A_NFT_JSON}?id=`);
            // test mock deploying
            for (let i = 0; i < DEPLOYED.DEVELOPERS.length; i++) {
                console.log("aNftInstance.mint(NETWORK.DEVELOPERS[i], 1200 + 200*i)");
                await aNftInstance.mintWithLevel(DEPLOYED.DEVELOPERS[i], 1200 + 200 * i);
            }
        }
    });
} as Truffle.Migration;
export {}

