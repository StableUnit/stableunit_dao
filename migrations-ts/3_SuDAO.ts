import {getDeployedAddresses} from "./deployed_addresses";
import {prepareVanityAddress, fundDeployer, withdrawEther} from "./utils";
import {SuDAOInstance} from "../types/truffle-contracts";

const SuDAO = artifacts.require("SuDAO");

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
        if (DEPLOYED.SU_DAO) return;
        // await deployer.deploy(SuDAO, 0);
        // const suDAOInstance = await SuDAO.deployed();
        let suDAOInstance: SuDAOInstance;
        const deployer_vanity = deployer_vanity_3;
        await prepareVanityAddress(web3, deployer_acc, deployer_vanity);
        await fundDeployer(web3, deployer_acc, deployer_vanity);
        {
            await deployer.deploy(SuDAO, 0, {from: deployer_vanity});
            suDAOInstance = await SuDAO.deployed();
            await suDAOInstance.transferOwnership(deployer_acc, {from: deployer_vanity});
        }
        await withdrawEther(web3, deployer_vanity, deployer_acc);

        console.log("suDAO: ", suDAOInstance.address);

    });
} as Truffle.Migration;
export {}
