const path = require('path');
const envPath = path.join(__dirname, '../.env/.env');
require('dotenv').config({path: envPath});

const HDWalletProvider = require("@truffle/hdwallet-provider");
const PRIVATE_KEYS = [
    process.env.PRIVATE_KEY,
    process.env.PRIVATE_KEY_VANITY_1
];

const PRIVATE_KEYS_TESTNET = [
    process.env.PRIVATE_KEY_TESTNET_DEPLOYER,
    process.env.PRIVATE_KEY_VANITY_1
];

module.exports = {
    /**
     * Networks define how you connect to your ethereum client and let you set the
     * defaults web3 uses to send transactions. If you don't specify one truffle
     * will spin up a development blockchain for you on port 9545 when you
     * run `develop` or `test`. You can ask a truffle command to use a specific
     * network from the command line, e.g
     *
     * $ truffle test --network <network-name>
     */
    networks: {
        goerli: {
            provider: () =>
                new HDWalletProvider(PRIVATE_KEYS_TESTNET,`https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`),
            network_id: 5,
            // skipDryRun: true
        },
        // bsc: {
        //     provider: () => new HDWalletProvider(PRIVATE_KEYS, `https://bsc-dataseed1.binance.org`),
        //     network_id: 56,
        //     gas: 10000000,
        //     gasPrice: 5 * 1e9,
        //     confirmations: 1,
        //     timeoutBlocks: 2000,
        //     skipDryRun: true
        // },
        // polygon: {
        //     // provider: () => new HDWalletProvider(PRIVATE_KEYS, `https://polygon-rpc.com`),
        //     provider: () => new HDWalletProvider(PRIVATE_KEYS, `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`),
        //     network_id: 137,
        //     gas: 10000000,
        //     gasPrice: 34 * 1e9,
        //     confirmations: 1,
        //     timeoutBlocks: 2000,
        //     skipDryRun: true
        // },
        // mainnet: {
        //     provider: () => new HDWalletProvider(PRIVATE_KEYS, `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_KEY}`),
        //     network_id: 1,
        //     gas: 500_000,
        //     gasPrice: 80 * 1e9,
        //     confirmations: 1,
        //     timeoutBlocks: 2000,  // # of blocks before a deployment times out  (minimum/default: 50)
        //     skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
        // },
    },

    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: "0.8.15",    // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            settings: {          // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 1
                },
                // evmVersion: "byzantium"
            }
        }
    },
    plugins: ["truffle-plugin-verify", "solidity-coverage"],
    api_keys: {
        etherscan: process.env.ETHERSCAN_API_KEY,
        bscscan: process.env.BSCSCAN_API_KEY,
        polygonscan: process.env.POLYGON_API_KEY,
    }
};
