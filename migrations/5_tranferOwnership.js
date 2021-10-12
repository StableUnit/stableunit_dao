const {OG_NFT_JSON} = require("./deployed_addresses");

const SafeProxy = artifacts.require("GnosisSafeProxy");
const SuDAO = artifacts.require("SuDAO");
const TimelockVault = artifacts.require("VestingToken");
const Distributor = artifacts.require("TokenDistributor_v3");
const AdvisorNft = artifacts.require("StableUnitDAOaNFT");

const TokenMock = artifacts.require('TokenMock');
const NftMock = artifacts.require('NftMock');
const {RINKEBY} = require("./deployed_addresses");

const BN_1E18 = web3.utils.toBN(1e18);
const DISTRIBUTION_ID = 0;
const MAX_DONATION = BN_1E18.muln(25_000);
const MIN_REWARD_ALLOCATION = BN_1E18.muln(Math.round(2_500 / (1 - 0.70))); // -70% off
const MAX_REWARD_ALLOCATION = BN_1E18.muln(Math.round(25_000 / (1 - 0.70))); // -70% off
const TOTAL_REWARD = BN_1E18.muln(Math.round(250_000 / (1 - 0.70)));
const DEADLINE_TIMESTAMP = Math.ceil(new Date().getTime() / 1000) + 24 * 60 * 60;
const VESTING_SECONDS = 20 * 60;
const CLIFF_SECONDS = 10 * 60;

const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000";

module.exports = function (deployer, network, accounts) {
    let NETWORK = {};
    if (network === RINKEBY.NAME) NETWORK = RINKEBY; else
        return;
    
    deployer.then(async () => {
        const suDaoInstance = await SuDAO.deployed();
        const aNftInstance = await AdvisorNft.deployed();
        const timelockVaultInstance = await TimelockVault.deployed();
        const distributorInstance = await Distributor.deployed();
        
        // check and deploy, option 1
        let daiInstance;
        if (NETWORK.DAI) {
            daiInstance = await TokenMock.at(NETWORK.DAI)
        } else {
            // deploy mock token for testnet
            await deployer.deploy(TokenMock, "Test Dai Stablecoin", "tDAI", 18);
            daiInstance = await TokenMock.deployed();
            console.log("daiInstance: ", daiInstance.address);
            for (const developer of NETWORK.DEVELOPERS) {
                console.log("daiInstance.mint(developer, BN_1E18.muln(321))")
                await daiInstance.mint(developer, BN_1E18.muln(54321));
            }
            for (const tester of NETWORK.TESTERS) {
                console.log("daiInstance.mint(tester, BN_1E18.muln(123))");
                await daiInstance.mint(tester, BN_1E18.muln(12345));
            }
        }
        
        const ogNftInstance = await (async () => {
            if (NETWORK.OG_NFT) {
                return NftMock.at(NETWORK.OG_NFT)
            } else {
                // deploy mock token for testnet
                await deployer.deploy(NftMock, "Test NFT", "tNFT");
                const ogNftInstance = await NftMock.deployed();
                console.log("setBaseURI() ");
                await aNftInstance.setBaseURI(`https://ipfs.io/ipfs/${OG_NFT_JSON}?id=`);
                for (const developer of NETWORK.DEVELOPERS) {
                    console.log("await ogNftInstance.mint(developer);");
                    await ogNftInstance.mint(developer);
                }
                for (const tester of NETWORK.TESTERS) {
                    console.log("await ogNftInstance.mint(tester);");
                    await ogNftInstance.mint(tester);
                }
                return ogNftInstance;
            }
        })();
        // check and deploy, option 3
        const safeProxyInstance =
            (NETWORK.MULTISIG)
                ? await SafeProxy.at(NETWORK.MULTISIG)
                : await SafeProxy.deployed();
        
        
        // create presale for ogNFT
        console.log("call setDistribution...");
        await distributorInstance.setDistribution(
            DISTRIBUTION_ID,
            MIN_REWARD_ALLOCATION,
            MAX_REWARD_ALLOCATION,
            MAX_DONATION,
            daiInstance.address,
            DEADLINE_TIMESTAMP,
            VESTING_SECONDS,
            CLIFF_SECONDS,
            ogNftInstance.address,
        );
        console.log("await suDaoInstance.mint(distributorInstance.address, TOTAL_REWARD);");
        await suDaoInstance.mint(distributorInstance.address, TOTAL_REWARD);
        
        console.log("transferring ownership...");
        if (!NETWORK.SU_DAO) {
            console.log("await suDaoInstance.transferOwnership(safeProxyInstance.address);");
            await suDaoInstance.transferOwnership(safeProxyInstance.address);
        }
        if (!NETWORK.A_NFT) {
            console.log("await aNftInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address)");
            await aNftInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address);
            console.log("await aNftInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0])");
            await aNftInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0]);
        }
        if (!NETWORK.TIMELOCK_VAULT) {
            // make it possible to create vesting for distributor
            console.log("await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, distributorInstance.address);");
            await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, distributorInstance.address);
            // grand admin role to proxy and renounce for deployer == transferOwnership
            console.log("await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address);");
            await timelockVaultInstance.grantRole(DEFAULT_ADMIN_ROLE, safeProxyInstance.address);
            console.log("await timelockVaultInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0]);");
            await timelockVaultInstance.revokeRole(DEFAULT_ADMIN_ROLE, accounts[0]);
        }
        if (!NETWORK.DISTRIBUTOR) {
            console.log("await distributorInstance.transferOwnership(safeProxyInstance.address);");
            await distributorInstance.transferOwnership(safeProxyInstance.address);
        }
        
        console.log(`\nDAI: "${daiInstance.address}",`);
        
        console.log(`\nOG_NFT: "${ogNftInstance.address}",`);
        console.log(`\nA_NFT: "${aNftInstance.address}",`);
        
        console.log(`\nDAO_MULTISIG: "${safeProxyInstance.address}",`);
        console.log(`\nSUDAO: "${suDaoInstance.address}",`);
        console.log(`\nTIMELOCK_VAULT: "${timelockVaultInstance.address}",`);
        console.log(`\nDISTRIBUTOR: "${distributorInstance.address}",`);
    });
};
