import { ethers } from "hardhat";
import fs from "fs";
import { daoPassportNftAbi } from "../utils/dao-passport-nft-abi";

const { INFURA_API_KEY, ALCHEMY_API_KEY_OPTIMISM, ALCHEMY_API_KEY_ARBITRUM2, QUICKNODE_API_KEY_FANTOM } = process.env;

console.log(INFURA_API_KEY);
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

// Function to fetch users who called sendFrom successfully
async function fetchUsers(chain: string, fromBlock: number, toBlock: number, step = 2500) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrls[chain]);
    const contract = new ethers.Contract(contractAddresses[chain], daoPassportNftAbi, provider);
    const iface = new ethers.utils.Interface(daoPassportNftAbi);

    let users = [] as string[];

    for (let start = fromBlock; start <= toBlock; start += step) {
        console.log("start", start, toBlock);
        const end = Math.min(start + step - 1, toBlock);

        // Define the filter for SendToChain events
        const filter = {
            address: contractAddresses[chain],
            topics: [ethers.utils.id("SendToChain(uint16,address,bytes,uint256)")],
            fromBlock: start,
            toBlock: end,
        };

        // Query the logs
        const logs = await provider.getLogs(filter);

        // Decode logs to get event data
        logs.forEach((log) => {
            const event = iface.parseLog(log);
            users.push(event.args[1]);
        });

        console.log(`Fetched logs from block ${start} to ${end} on ${chain}`);
    }

    return users.filter((x, i, a) => a.indexOf(x) == i);
}

// Function to save users to a file
function saveUsersToFile(chain: string, users: string[]) {
    const filename = `${chain}_users.txt`;
    const data = users.join("\n");
    fs.writeFileSync(filename, data, "utf-8");
    console.log(`Saved users of ${chain} to ${filename}`);
}

// Main function to fetch users for all chains and save to files
async function main() {
    // const chains = ["avax", "bnb", "opera", "arbitrum", "optimism", "scroll"];
    const chains = ["opera"];
    const allUsers = {} as Record<string, string[]>;

    for (const chain of chains) {
        // const users = await fetchUsers(chain, 36326727, 39069729); bnb
        const users = await fetchUsers(chain, 73322183, 81641400);
        allUsers[chain] = users;
        // console.log(`Users on ${chain}:`, users);
        saveUsersToFile(chain, users);
    }

    console.log("All users data saved to respective files.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
