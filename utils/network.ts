export type NetworkType =
    | "mainnet"
    | "optimisticEthereum"
    | "arbitrumOne"
    | "opera" // fantom-opera
    | "avalanche"
    | "sepolia"
    | "scroll"
    // | "optimisticSepolia" OZ don't work with it
    | "optimisticGoerli"
    | "arbitrumSepolia"
    | "unsupported";

export const NETWORK: Record<NetworkType, NetworkType> = {
    mainnet: "mainnet",
    optimisticEthereum: "optimisticEthereum",
    opera: "opera",
    arbitrumOne: "arbitrumOne",
    avalanche: "avalanche",
    scroll: "scroll",

    arbitrumSepolia: "arbitrumSepolia",
    sepolia: "sepolia",
    // optimisticSepolia: "optimisticSepolia",
    optimisticGoerli: "optimisticGoerli",

    unsupported: "unsupported",
};

export const SUPPORTED_NETWORKS = [
    NETWORK.optimisticEthereum,
    NETWORK.opera,
    NETWORK.arbitrumOne,
    NETWORK.avalanche,
    NETWORK.scroll,
];

export const getNetworkNameById: (chainId?: number) => NetworkType = (chainId) => {
    switch (chainId) {
        case 1:
            return NETWORK.mainnet;
        case 10:
            return NETWORK.optimisticEthereum;
        case 250:
            return NETWORK.opera;
        case 42161:
            return NETWORK.arbitrumOne;
        case 43114:
            return NETWORK.avalanche;
        case 421614:
            return NETWORK.arbitrumSepolia;
        case 534352:
            return NETWORK.scroll;
        case 11155111:
            return NETWORK.sepolia;
        case 420:
            return NETWORK.optimisticGoerli;
        // case 11155420:
        //     return NETWORK.optimisticSepolia;
        case undefined:
            return NETWORK.unsupported;
        default:
            return NETWORK.unsupported;
    }
};
export const getIdByNetworkName: (name: NetworkType) => number = (name) => {
    switch (name) {
        case NETWORK.mainnet:
            return 1;
        case NETWORK.optimisticEthereum:
            return 10;
        case NETWORK.opera:
            return 250;
        case NETWORK.arbitrumOne:
            return 42161;
        case NETWORK.avalanche:
            return 43114;
        case NETWORK.arbitrumSepolia:
            return 421614;
        case NETWORK.scroll:
            return 534352;
        case NETWORK.sepolia:
            return 11155111;
        case NETWORK.optimisticGoerli:
            return 420;
        default:
            return 0;
    }
};
