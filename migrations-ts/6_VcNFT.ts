import {getDeployedAddresses} from "./deployed_addresses";
import {prepareVanityAddress, fundDeployer, withdrawEther} from "./utils";

const {VC_NFT_JSON} = require("./deployed_addresses");
const VcNft = artifacts.require("StableUnitDAOvcNFT");

module.exports = function (deployer, network, accounts) {
    const [deployer_acc,
        deployer_vanity_1,
        deployer_vanity_2,
        deployer_vanity_3,
        deployer_vanity_4,
        deployer_vanity_5,
        deployer_vanity_6,
        deployer_vanity_7,
    ] = accounts;
    const DEPLOYED = getDeployedAddresses(network);


    // @ts-ignore
    deployer.then(async () => {
        let vcNftInstance;
        if (DEPLOYED.VC_NFT) {
            vcNftInstance = await VcNft.at(DEPLOYED.VC_NFT)
        } else {
            const deployer_vanity = deployer_vanity_7;
            await prepareVanityAddress(web3, deployer_acc, deployer_vanity);
            await fundDeployer(web3, deployer_acc, deployer_vanity);
            {
                await deployer.deploy(VcNft, {from: deployer_vanity});
                vcNftInstance = await VcNft.deployed();
                await vcNftInstance.transferOwnership(deployer_acc, {from: deployer_vanity});
            }
            await withdrawEther(web3, deployer_vanity, deployer_acc);

            await vcNftInstance.setBaseURI(`https://ipfs.io/ipfs/${VC_NFT_JSON}?id=`);
            // test mock deploying
            if (DEPLOYED.NAME === "rinkeby") {
                for (let i = 0; i < DEPLOYED.DEVELOPERS.length; i++) {
                    console.log("aNftInstance.mint(NETWORK.DEVELOPERS[i])");
                    await vcNftInstance.mint(DEPLOYED.DEVELOPERS[i]);
                }
            }
            await vcNftInstance.transferOwnership(DEPLOYED.DAO_MULTISIG);
        }
    });
} as Truffle.Migration;
export {}

