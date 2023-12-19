import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@openzeppelin/hardhat-defender";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
// for 3rd-party tests like openzeppelin tests
import "@nomiclabs/hardhat-truffle5";
import "hardhat-contract-sizer";

// To learn how to create Hardhat task, go to https://hardhat.org/guides/create-task.html
import "./tasks/accounts.ts";
import "./tasks/setDistributor.ts";
import "./tasks/setBonus.ts";

// The environment file stores wallets and API keys
// and preferably should be stored outside the repo folder
// const envPath = "./.env";
const envPath = "../.env/.env";
dotenv.config({ path: envPath });

const {
    INFURA_API_KEY,
    ALCHEMY_API_KEY_MAINNET,
    ALCHEMY_API_KEY_OPTIMISM,
    ALCHEMY_API_KEY_ARBITRUM,
    ALCHEMY_API_KEY_OPTIMISM_GOERLI,
    QUICKNODE_API_KEY_FANTOM,
    PRIVATE_KEY_TESTNET_DEPLOYER,
    PRIVATE_KEY_TESTNET_ADMIN,
    PRIVATE_KEY_TESTNET_VANITY_1,
    PRIVATE_KEY_TESTNET_VANITY_2,
    PRIVATE_KEY_TESTNET_VANITY_3,
} = process.env;

const accountsTestnetEnv = [
    PRIVATE_KEY_TESTNET_DEPLOYER,
    PRIVATE_KEY_TESTNET_ADMIN,
    PRIVATE_KEY_TESTNET_VANITY_1,
    PRIVATE_KEY_TESTNET_VANITY_2,
    PRIVATE_KEY_TESTNET_VANITY_3,
] as string[];
const accountsTestnet = accountsTestnetEnv.filter((v) => v);

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
    // Hardhat-deploy plugin extends the HardhatConfig's object with an optional namedAccounts field.
    // learn more https://github.com/wighawag/hardhat-deploy#1-namedaccounts-ability-to-name-addresses
    namedAccounts: {
        deployer: 0,
        admin: {
            // core team
            default: 1,
            goerli: "0xE2661235b116781a7b30D4a675898cF9E61298Df",
        },
        dao: {
            // DAO multisig address or local EOA for testing
            default: 2,
            goerli: "0xdf92E30b3E8Ad232577087E036c1fDc6138bB2e9",
        },
        randomAccount: 3,
        userAccount: 4,
        liquidatorAccount: 5,
        alice: 6,
        bob: 7,
        carl: 8,
    },
    solidity: {
        version: "0.8.23",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1,
            },
        },
    },
    networks: {
        hardhat: {
            gas: 12000000,
            blockGasLimit: 0x1fffffffffffff,
            allowUnlimitedContractSize: true,
            forking: {
                url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_MAINNET}`,
                blockNumber: 14518074,
            },
            // // uses for supporting the legacy version of solidity-coverage
            // // see https://github.com/sc-forks/solidity-coverage/issues/652
            // initialBaseFeePerGas: 0,
        },
        mainnet: {
            url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_MAINNET}`,
            accounts: accountsTestnet,
        },
        optimisticEthereum: {
            url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_OPTIMISM}`,
            accounts: accountsTestnet,
        },
        arbitrumOne: {
            url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_ARBITRUM}`,
            accounts: accountsTestnet,
        },
        opera: {
            url: `https://autumn-newest-valley.fantom.quiknode.pro/${QUICKNODE_API_KEY_FANTOM}`,
            accounts: accountsTestnet,
        },
        avalanche: {
            url: `https://avalanche-mainnet.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },

        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },
        optimisticGoerli: {
            url: `https://opt-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY_OPTIMISM_GOERLI}`,
            accounts: accountsTestnet,
        },
        arbitrumSepolia: {
            url: `https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API_KEY as string,
            arbitrumOne: process.env.ARBISCAN_API_KEY as string,
            opera: process.env.FANTOM_API_KEY as string,
            optimisticEthereum: process.env.OPTIMISTIC_API_KEY as string,
            avalanche: "",

            sepolia: process.env.ETHERSCAN_API_KEY as string,
            arbitrumSepolia: process.env.ARBISCAN_API_KEY as string,
            optimisticGoerli: process.env.OPTIMISTIC_API_KEY as string,
        },
        customChains: [
            {
                network: "avalanche",
                chainId: 43114,
                urls: {
                    apiURL: "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan",
                    browserURL: "https://avalanche.routescan.io",
                },
            },
            {
                network: "arbitrumSepolia",
                chainId: 421614,
                urls: {
                    apiURL: "https://api-sepolia.arbiscan.io/api",
                    browserURL: "https://sepolia.arbiscan.io/",
                },
            },
        ],
    },
    paths: {
        deploy: "deploy",
        deployments: "submodule-artifacts",
        imports: "imports",
    },
    defender: {
        apiKey: process.env.DEFENDER_TEAM_API_KEY ?? "",
        apiSecret: process.env.DEFENDER_TEAM_API_SECRET_KEY ?? "",
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
        only: [":MockErc721CrossChainV2"],
    },
};

export default config;
