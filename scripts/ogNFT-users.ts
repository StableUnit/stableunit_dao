import { ethers } from "hardhat";
import fs from "fs";
import { daoPassportNftAbi } from "../utils/dao-passport-nft-abi";

const { ALCHEMY_API_KEY_MATIC } = process.env;

// Define RPC endpoints for each chain
const rpcUrls: Record<string, string> = {
    polygon: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_MATIC}`,
};

// Define contract ABI and addresses
const ogNFTAddress = "0xfffffffff615bee8d0c7d329ebe0d444ab46ee5a";

// Function to fetch owners of ogNFT on Polygon
async function fetchOgNFTOwners() {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrls.polygon);
    const transferEventSignature = ethers.utils.id("Transfer(address,address,uint256)");
    const filter = {
        address: ogNFTAddress,
        topics: [transferEventSignature],
        fromBlock: 0,
        toBlock: "latest",
    };

    const logs = await provider.getLogs(filter);
    const iface = new ethers.utils.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ]);

    const owners = [] as string[];

    // @ts-ignore
    logs.forEach((log: any) => {
        const event = iface.parseLog(log);
        const { from, to } = event.args;

        if (from !== ethers.constants.AddressZero) {
            owners.push(from);
        }
        if (to !== ethers.constants.AddressZero) {
            owners.push(to);
        }
    });

    return owners.filter((x, i, a) => a.indexOf(x) == i);
}

// Function to save users to a file
function saveUsersToFile(users: string[]) {
    const filename = `og_nft__users.txt`;
    const data = Array.from(users).join("\n");
    fs.writeFileSync(filename, data, "utf-8");
    console.log(`Saved users to ${filename}`);
}

// Main function to fetch and intersect users
async function main() {
    const ogNFTOwners = await fetchOgNFTOwners();
    console.log(`Fetched ${ogNFTOwners.length} ogNFT owners from Polygon`);

    saveUsersToFile(ogNFTOwners);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
