import {getDeployedAddresses} from "./deployed_addresses";
import {StableUnitDAOaNFTInstance, SuDAOInstance, TokenMockInstance} from "../types/truffle-contracts";

const {OG_NFT_JSON} = require("./deployed_addresses");

const SafeProxy = artifacts.require("GnosisSafeProxy");
const SuDAO = artifacts.require("SuDAO");
const TimelockVault = artifacts.require("VestingToken");
const Distributor = artifacts.require("TokenDistributor_v3s1");
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");

const TokenMock = artifacts.require('TokenMock');
const NftMock = artifacts.require('NftMock');


const BN_1E18 = web3.utils.toBN(1e18);
const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000";

const DAY_SECONDS = 24 * 60 * 60;
const TOTAL_REWARD = BN_1E18.muln(Math.round(420_000)); // 2% from total supply
const VESTING_SECONDS = 365 * DAY_SECONDS;
const CLIFF_SECONDS = 90 * DAY_SECONDS;


module.exports = function (deployer, network, accounts) {
    const [deployer_acc, deploy_e] = accounts;
    const DEPLOYED = getDeployedAddresses(network);
    // @ts-ignore
    deployer.then(async () => {
        const suDaoInstance = DEPLOYED.SU_DAO
            ? await SuDAO.at(DEPLOYED.SU_DAO)
            : await SuDAO.deployed();

        let aNftInstance = DEPLOYED.A_NFT
            ? await AdvisorNft.at(DEPLOYED.A_NFT)
            : await AdvisorNft.deployed();

        const timelockVaultInstance = DEPLOYED.TIMELOCK_VAULT
            ? await TimelockVault.at(DEPLOYED.TIMELOCK_VAULT)
            : await TimelockVault.deployed();

        const distributorInstance = DEPLOYED.DISTRIBUTOR
            ? await Distributor.at(DEPLOYED.DISTRIBUTOR)
            : await Distributor.deployed();

        // check and deploy, option 1
        let daiInstance: TokenMockInstance;
        if (DEPLOYED.DAI) {
            daiInstance = await TokenMock.at(DEPLOYED.DAI)
        } else {
            // deploy mock token for testnet
            await deployer.deploy(TokenMock, "Test Dai Stablecoin", "tDAI", 18);
            daiInstance = await TokenMock.deployed();
            console.log("daiInstance: ", daiInstance.address);
            for (const developer of DEPLOYED.DEVELOPERS) {
                console.log("daiInstance.mint(developer, BN_1E18.muln(321))")
                await daiInstance.mint(developer, BN_1E18.muln(54321));
            }
            for (const tester of DEPLOYED.TESTERS) {
                console.log("daiInstance.mint(tester, BN_1E18.muln(123))");
                await daiInstance.mint(tester, BN_1E18.muln(12345));
            }
        }
        // check and deploy, option 2
        const ogNftInstance = await (async () => {
            if (DEPLOYED.OG_NFT) {
                return NftMock.at(DEPLOYED.OG_NFT)
            } else {
                // deploy mock token for testnet
                await deployer.deploy(NftMock, "Test NFT", "tNFT");
                const ogNftInstance = await NftMock.deployed();
                console.log("setBaseURI() ");
                await ogNftInstance.setBaseURI(`https://ipfs.io/ipfs/${OG_NFT_JSON}?id=`);
                for (const developer of DEPLOYED.DEVELOPERS) {
                    console.log("await ogNftInstance.mint(developer);");
                    await ogNftInstance.mint(developer);
                }
                for (const tester of DEPLOYED.TESTERS) {
                    console.log("await ogNftInstance.mint(tester);");
                    await ogNftInstance.mint(tester);
                }
                return ogNftInstance;
            }
        })();
        // check and deploy, option 3
        const safeProxyInstance =
            (DEPLOYED.DAO_MULTISIG)
                ? await SafeProxy.at(DEPLOYED.DAO_MULTISIG)
                : await SafeProxy.deployed();

        console.log("transferring ownership...");

        if (!DEPLOYED.A_NFT) {
            console.log("await aNftInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address)");
            await aNftInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address);
            console.log("await aNftInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0])");
            await aNftInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0]);
        }
        if (!DEPLOYED.TIMELOCK_VAULT) {
            // make it possible to create vesting for distributor
            console.log("await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, distributorInstance.address);");
            await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, distributorInstance.address);
            // grand admin role to proxy and renounce for deployer == transferOwnership
            console.log("await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address);");
            await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address);
            console.log("await timelockVaultInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0]);");
            await timelockVaultInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0]);
        }
        if (!DEPLOYED.DISTRIBUTOR) {
            // create presale for ogNFT
            console.log("call setDistributions...");
            // distribution #1 aNFT only, days 1-2, 1-10k
            // distribution #2, days 2-7, 1-20k
            // distribution #3, days 3-7, 2.5-25k 0.4
            async function setDistribution(
                id: number,
                nftAddress: string,
                startDay: number,
                endDay: number,
                minDonation: number,
                maxDonation: number,
                suRate: number
            ) {
                await distributorInstance.setDistribution(
                    id,
                    BN_1E18.muln(Math.round(minDonation / suRate)),
                    BN_1E18.muln(Math.round(maxDonation / suRate)),
                    BN_1E18.muln(maxDonation),
                    daiInstance.address,
                    Math.ceil(new Date().getTime() / 1000) + startDay * DAY_SECONDS,
                    Math.ceil(new Date().getTime() / 1000) + endDay * DAY_SECONDS,
                    VESTING_SECONDS,
                    CLIFF_SECONDS,
                    nftAddress,
                );
            }

            await setDistribution(
                1, aNftInstance.address, 0, 2,
                1_000, 10_000, 0.3
            );
            await setDistribution(
                2, ogNftInstance.address, 2, 7,
                1_000, 10_000, 0.3
            );
            await setDistribution(
                3, ogNftInstance.address, 4, 7,
                2_500, 25_000, 0.4
            );
            console.log("await distributorInstance.transferOwnership(safeProxyInstance.address);");
            await distributorInstance.transferOwnership(safeProxyInstance.address);
        }

        if (!DEPLOYED.SU_DAO) {
            console.log("await suDaoInstance.mint(distributorInstance.address, TOTAL_REWARD);");
            await suDaoInstance.mint(distributorInstance.address, TOTAL_REWARD);
            console.log("await suDaoInstance.transferOwnership(safeProxyInstance.address);");
            await suDaoInstance.transferOwnership(safeProxyInstance.address);
        }

        console.log(`\nDAI: "${daiInstance.address}",`);

        console.log(`\nOG_NFT: "${ogNftInstance.address}",`);
        console.log(`\nA_NFT: "${aNftInstance.address}",`);

        console.log(`\nDAO_MULTISIG: "${safeProxyInstance.address}",`);
        console.log(`\nSUDAO: "${suDaoInstance.address}",`);
        console.log(`\nTIMELOCK_VAULT: "${timelockVaultInstance.address}",`);
        console.log(`\nDISTRIBUTOR: "${distributorInstance.address}",`);
    });
} as Truffle.Migration;
export {};
