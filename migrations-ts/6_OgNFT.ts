import {getDeployedAddresses} from "./deployed_addresses";
import {prepareVanityAddress, fundDeployer, withdrawEther} from "./utils";

const {OG_NFT_JSON} = require("./deployed_addresses");
const OgNft = artifacts.require("StableUnitDAOogNFT");

module.exports = function (deployer, network, accounts) {
    const [deployer_acc,
        deployer_vanity_1,
        deployer_vanity_2,
        deployer_vanity_3,
        deployer_vanity_4,
        deployer_vanity_5,
        deployer_vanity_6,
    ] = accounts;
    const DEPLOYED = getDeployedAddresses(network);


    // @ts-ignore
    deployer.then(async () => {
        let ogNftInstance;
        if (DEPLOYED.OG_NFT) {
            ogNftInstance = await OgNft.at(DEPLOYED.OG_NFT)
        } else {
            const deployer_vanity = deployer_vanity_6;
            await prepareVanityAddress(web3, deployer_acc, deployer_vanity);
            await fundDeployer(web3, deployer_acc, deployer_vanity);
            {
                await deployer.deploy(OgNft, {from: deployer_vanity});
                ogNftInstance = await OgNft.deployed();
                await ogNftInstance.transferOwnership(deployer_acc, {from: deployer_vanity});
            }
            await withdrawEther(web3, deployer_vanity, deployer_acc);

            await ogNftInstance.setBaseURI(`https://ipfs.io/ipfs/${OG_NFT_JSON}?id=`);
            // test mock deploying
            for (let i = 0; i < DEPLOYED.DEVELOPERS.length; i++) {
                console.log("aNftInstance.mint(NETWORK.DEVELOPERS[i])");
                await ogNftInstance.adminMint(DEPLOYED.DEVELOPERS[i]);
            }
        }
    });
} as Truffle.Migration;
export {}

