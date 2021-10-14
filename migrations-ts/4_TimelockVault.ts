import {getDeployedAddresses} from "./deployed_addresses";
import {SuDAOInstance, VestingTokenInstance} from "../types/truffle-contracts";
import {checkVanityAddress, fundDeployer, withdrawEther} from "./utils";

const VeToken = artifacts.require("VestingToken");
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
        if (DEPLOYED.TIMELOCK_VAULT) return;
        const suDaoInstance = DEPLOYED.SU_DAO
            ? await SuDAO.at(DEPLOYED.SU_DAO)
            : await SuDAO.deployed();

        // await deployer.deploy(VeToken, "Vested StableUnitDAO", "veSuDAO", suDaoInstance.address);
        // const veToken = await VeToken.deployed();
        let veToken: VestingTokenInstance;
        const deployer_vanity = deployer_vanity_4;
        await checkVanityAddress(web3, deployer_acc, deployer_vanity);
        await fundDeployer(web3, deployer_acc, deployer_vanity);
        {
            await deployer.deploy(VeToken, "Vested StableUnitDAO", "veSuDAO", suDaoInstance.address,
                {from: deployer_vanity}
            );
            veToken = await VeToken.deployed();
            await veToken.transferOwnership(deployer_acc, {from: deployer_vanity});
        }
        await withdrawEther(web3, deployer_vanity, deployer_acc);

        console.log("veToken: ", veToken.address);
    });
} as Truffle.Migration;
export {}
