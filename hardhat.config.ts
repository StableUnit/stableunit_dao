import dotenv from 'dotenv'

const envPath = "../.env/.env";
dotenv.config({ path: envPath });

import "@nomiclabs/hardhat-truffle5";

require("@nomiclabs/hardhat-web3");
import {task} from "hardhat/config";
import "solidity-coverage";
import "@nomiclabs/hardhat-waffle";

import "./tasks/accounts.ts";
import "./tasks/ogDistribution.ts";
import "./tasks/transfer-owner.ts";
import "./tasks/grant-role.ts";
import "./tasks/renounce-role.ts";

const {
    INFURA_API_KEY,
    ALCHEMY_API_KEY,
    ETHERSCAN_API_KEY,
    PRIVATE_KEY_TESTNET_DEPLOYER,
    PRIVATE_KEY_TESTNET_OWNER
} = process.env;

const accountsTestnet = [PRIVATE_KEY_TESTNET_DEPLOYER, PRIVATE_KEY_TESTNET_OWNER];

const accountsMainnet = accountsTestnet;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
    solidity: "0.8.12",
    networks: {
        hardhat: {},
        mainnet: {
            url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsMainnet,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        },
        polygon: {
            url: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsMainnet,
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
            accounts: accountsTestnet,
        }
    }
};
