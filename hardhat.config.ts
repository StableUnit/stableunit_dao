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
    ALCHEMY_API_KEY,
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
        nft: {
            default: 9,
            goerli: "0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23",
            mumbai: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
            "bnb-testnet": "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
            polygon: "0x3c2269811836af69497E5F486A85D7316753cf62",
            bnb: "0x3c2269811836af69497E5F486A85D7316753cf62",
            mainnet: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
        },
    },
    solidity: {
        version: "0.8.15",
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
                url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
                blockNumber: 14518074,
            },
            // // uses for supporting the legacy version of solidity-coverage
            // // see https://github.com/sc-forks/solidity-coverage/issues/652
            // initialBaseFeePerGas: 0,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
            allowUnlimitedContractSize: true,
            // timeout: 100000,
            // blockGasLimit: 7_000_000,
            // gas: 7_000_000,
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },
        // matic: {
        //   url: process.env.MATIC_URL || "",
        //   blockGasLimit: 7_000_000,
        //   gas: 7_000_000,
        //   accounts:
        //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, vanityPrivateKey] : [],
        // },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API_KEY as string,
            goerli: process.env.ETHERSCAN_API_KEY as string,
            polygon: process.env.POLYGONSCAN_API_KEY as string,
            polygonMumbai: process.env.POLYGONSCAN_API_KEY as string,
            arbitrumOne: process.env.ARBISCAN_API_KEY as string,
        },
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
};

export default config;
