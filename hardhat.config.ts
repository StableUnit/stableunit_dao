import dotenv from 'dotenv'
dotenv.config();

import "@nomiclabs/hardhat-truffle5";
require("@nomiclabs/hardhat-web3");
import { task } from "hardhat/config";
import "solidity-coverage";
import "@nomiclabs/hardhat-waffle";

import "./tasks/accounts.ts";
import "./tasks/airdrop.ts";
import "./tasks/transfer-owner.ts";
import "./tasks/grant-role.ts";
import "./tasks/renounce-role.ts";

const {
    INFURA_KEY,
    MNEMONIC,
    ETHERSCAN_API_KEY,

    PRIVATE_KEY
} = process.env;

const accounts = PRIVATE_KEY
    ? [PRIVATE_KEY]
    : { mnemonic: MNEMONIC };

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
    solidity: "0.8.9",
    networks: {
        hardhat: {
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
            accounts,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
            accounts,
        },
        polygon: {
            url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
            accounts,
        },
        mumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
            accounts,
        }
    }
};
