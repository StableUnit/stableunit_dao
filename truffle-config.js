const path = require('path');
const envPath = path.join(__dirname, './.env');
require('dotenv').config({path: envPath});

const HDWalletProvider = require("@truffle/hdwallet-provider");
const PRIVATE_KEYS = [
    process.env.PRIVATE_KEY,
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
        ganache: {
            host: "127.0.0.1",     // Localhost (default: none)
            port: 8545,            // Standard Ethereum port (default: none)
            network_id: "*",       // Any network (default: none)
        },
        development: {
            provider: () => new HDWalletProvider(PRIVATE_KEYS, `http://127.0.0.1:8545`),
            network_id: "*",      // Any network (default: none)
            skipDryRun: true
        },
        
        rinkeby: {
            provider: () => new HDWalletProvider(PRIVATE_KEYS, `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_KEY}`),
            network_id: 4,
            gas: 10000000,
            timeoutBlocks: 200,
            networkCheckTimeout: 1000000,  // # of blocks before a deployment times out  (minimum/default: 50)
            skipDryRun: true,
            websockets: true
        },
        
    },
    
    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },
    
    // Configure your compilers
    compilers: {
        solc: {
            version: "0.8.8",    // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            // settings: {          // See the solidity docs for advice about optimization and evmVersion
            //  optimizer: {
            //    enabled: false,
            //    runs: 200
            //  },
            //  evmVersion: "byzantium"
            // }
        }
    },
    plugins: ["truffle-plugin-verify", "solidity-coverage"],
    api_keys: {
        etherscan: process.env.ETHERSCAN_API_KEY
    }
};
