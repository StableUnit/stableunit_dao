import { NETWORK } from "./network";

/**
 * @dev To see testnet endpoints and chain ids:
 * https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses
 * And docs for mainnet:
 * https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids
 * */
export const endpoint = {
    [NETWORK.mainnet]: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
    [NETWORK.avalanche]: "0x3c2269811836af69497E5F486A85D7316753cf62",
    [NETWORK.arbitrumOne]: "0x3c2269811836af69497E5F486A85D7316753cf62",
    [NETWORK.optimisticEthereum]: "0x3c2269811836af69497E5F486A85D7316753cf62",
    [NETWORK.opera]: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
    [NETWORK.scroll]: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",

    [NETWORK.arbitrumSepolia]: "0x6098e96a28E02f27B1e6BD381f870F1C8Bd169d3",
    [NETWORK.sepolia]: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
    [NETWORK.optimisticGoerli]: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
};

export const lzChainId = {
    [NETWORK.mainnet]: 101,
    [NETWORK.avalanche]: 106,
    [NETWORK.arbitrumOne]: 110,
    [NETWORK.optimisticEthereum]: 111,
    [NETWORK.opera]: 112,
    [NETWORK.scroll]: 214,

    [NETWORK.arbitrumSepolia]: 10231,
    [NETWORK.optimisticGoerli]: 10132,
    [NETWORK.sepolia]: 10161,
};
