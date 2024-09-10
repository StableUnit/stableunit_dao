import { ethers } from "hardhat";
import fs from "fs";
import { daoPassportNftAbi } from "../utils/dao-passport-nft-abi";

const { INFURA_API_KEY, ALCHEMY_API_KEY_OPTIMISM, ALCHEMY_API_KEY_ARBITRUM2 } = process.env;

// Define RPC endpoints for each chain
const rpcUrls: Record<string, string> = {
    avax: `https://avalanche-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    bnb: "https://bsc-dataseed1.defibit.io",
    opera: "https://rpc.ankr.com/fantom",
    arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_ARBITRUM2}`,
    optimism: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_OPTIMISM}`,
    scroll: "https://rpc.scroll.io",
};

const contractAddresses: Record<string, string> = {
    avax: "0xAfF640d39fac0E58b58F7220d32c618a2f0e9DC6",
    bnb: "0xA8A01cca93B95661F14D07EDBA4C828A6D8A97e9",
    opera: "0xAfF640d39fac0E58b58F7220d32c618a2f0e9DC6",
    arbitrum: "0x30ACBEe042310bE38a9F39209128E2d360635A1E",
    optimism: "0x30ACBEe042310bE38a9F39209128E2d360635A1E",
    scroll: "0x30ACBEe042310bE38a9F39209128E2d360635A1E",
};
// Define contract ABI and addresses
const ogNFTAddress = "0xfffffffff615bee8d0c7d329ebe0d444ab46ee5a";

// Function to fetch users who minted cross-chain NFTs
async function fetchCrossChainMinters(chain: string) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrls[chain]);
    const iface = new ethers.utils.Interface(daoPassportNftAbi);

    let users = new Set();
    // const latestBlock = await provider.getBlockNumber();

    // for (let start = fromBlock; start <= latestBlock; start += step) {
    //     const end = Math.min(start + step - 1, latestBlock);

    const filter = {
        address: contractAddresses[chain],
        topics: [ethers.utils.id("Transfer(address,address,uint256)")],
        fromBlock: 0,
        toBlock: "latest",
    };

    const logs = await provider.getLogs(filter);

    logs.forEach((log) => {
        const event = iface.parseLog(log);
        users.add(event.args._from);
    });

    // }

    return users;
}

function saveUsersToFile(users: string[], chain: string) {
    const filename = `og-nft-users-on-${chain}.txt`;
    const data = Array.from(users).join("\n");
    fs.writeFileSync(filename, data, "utf-8");
    console.log(`Saved users to ${filename}`);
}

async function main() {
    const ogNFTOwners = await getOgNFTUsers();
    console.log(`Fetched ${ogNFTOwners.size} ogNFT owners from Polygon`);

    const chains = ["avax", "arbitrum", "optimism", "scroll"];

    for (const chain of chains) {
        console.log("");
        console.log(`CHAIN ${chain}`);
        let crossChainOgUsers = [];
        for (const ogUser of ogNFTOwners) {
            if (isUserParticipate(ogUser, chain)) {
                console.log(`✅user ${ogUser} participated in chain ${chain}`);
                crossChainOgUsers.push(ogUser);
                break;
            } else {
                console.log(`❌user ${ogUser} NOT participated in chain ${chain}`);
            }
        }

        const uniqueOgUsersThatParticipated = crossChainOgUsers.filter((x, i, a) => a.indexOf(x) == i);
        saveUsersToFile(uniqueOgUsersThatParticipated, chain);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
