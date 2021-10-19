import {getDeployedAddresses} from "./deployed_addresses";
import {
    TokenDistributorV31Instance,
    TokenDistributorV3Instance,
    VestingTokenInstance
} from "../types/truffle-contracts";
import {checkVanityAddress, fundDeployer, withdrawEther} from "./utils";

const Distributor = artifacts.require("TokenDistributor_v3s1");
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");
const SuDAO = artifacts.require("SuDAO");
const TimelockVault = artifacts.require("VestingToken");

const {RINKEBY} = require("./deployed_addresses");

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
        if (DEPLOYED.DISTRIBUTOR) return;

        let aNftInstance = DEPLOYED.A_NFT
            ? await AdvisorNft.at(DEPLOYED.A_NFT)
            : await AdvisorNft.deployed();

        const timelockVaultInstance = DEPLOYED.TIMELOCK_VAULT
            ? await TimelockVault.at(DEPLOYED.TIMELOCK_VAULT)
            : await TimelockVault.deployed();

        const suDaoInstance = DEPLOYED.SU_DAO
            ? await SuDAO.at(DEPLOYED.SU_DAO)
            : await SuDAO.deployed();

        // await deployer.deploy(
        //     Distributor,
        //     aNftInstance.address,
        //     suDaoInstance.address,
        //     timelockVaultInstance.address
        // );
        // const distributorInstance = await Distributor.deployed();

        let distributorInstance: TokenDistributorV31Instance;
        const deployer_vanity = deployer_vanity_5;
        await checkVanityAddress(web3, deployer_acc, deployer_vanity);
        await fundDeployer(web3, deployer_acc, deployer_vanity);
        {
            await deployer.deploy(
                Distributor,
                aNftInstance.address,
                suDaoInstance.address,
                timelockVaultInstance.address,
                {from: deployer_vanity}
            );
            distributorInstance = await Distributor.deployed();
            await distributorInstance.transferOwnership(deployer_acc, {from: deployer_vanity});
        }
        await withdrawEther(web3, deployer_vanity, deployer_acc);

        console.log("distributorInstance: ", distributorInstance.address);
    });
} as Truffle.Migration;
export {}
