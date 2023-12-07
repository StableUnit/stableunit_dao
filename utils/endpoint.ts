import { NETWORK } from "./network";

/**
 * @dev To see testnet endpoints and chain ids:
 * https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses
 * And docs for mainnet:
 * https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids
 * */
export const endpoint = {
    [NETWORK.eth]: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
    [NETWORK.polygon]: "0x3c2269811836af69497E5F486A85D7316753cf62",
    [NETWORK.arbitrum]: "0x3c2269811836af69497E5F486A85D7316753cf62",
    [NETWORK.arbitrumGoerli]: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
    [NETWORK.goerli]: "0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23",
    [NETWORK.sepolia]: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
    [NETWORK.mumbai]: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
};

export const lzChainId = {
    [NETWORK.eth]: 101,
    [NETWORK.polygon]: 109,
    [NETWORK.arbitrum]: 110,
    [NETWORK.arbitrumGoerli]: 10143,
    [NETWORK.goerli]: 10121,
    [NETWORK.sepolia]: 10161,
    [NETWORK.mumbai]: 10109,
};
