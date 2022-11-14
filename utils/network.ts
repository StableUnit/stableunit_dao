export type NetworkType =
    | "eth"
    | "goerli"
    | "mumbai"
    | "polygon"
    | "bsc"
    | "fantom"
    | "avalanche"
    | "aurora"
    | "harmony"
    | "unsupported";

export const NETWORK: Record<NetworkType, NetworkType> = {
    eth: "eth",
    goerli: "goerli",
    mumbai: "mumbai",
    polygon: "polygon",
    aurora: "aurora",
    harmony: "harmony",
    bsc: "bsc",
    fantom: "fantom",
    avalanche: "avalanche",
    unsupported: "unsupported",
};

export const getNetworkNameById: (chainId?: number) => NetworkType = (chainId) => {
    switch (chainId) {
        case 1:
            return NETWORK.eth;
        case 5:
            return NETWORK.goerli;
        case 56:
            return NETWORK.bsc;
        case 137:
            return NETWORK.polygon;
        case 250:
            return NETWORK.fantom;
        case 43114:
            return NETWORK.avalanche;
        case 80001:
            return NETWORK.mumbai;
        case 1313161554:
            return NETWORK.aurora;
        case 1666600000:
            return NETWORK.harmony;
        case undefined:
            return NETWORK.unsupported;
        default:
            return NETWORK.unsupported;
    }
};
export const getIdByNetworkName: (name: NetworkType) => number = (name) => {
    switch (name) {
        case NETWORK.eth:
            return 1;
        case NETWORK.goerli:
            return 5;
        case NETWORK.bsc:
            return 56;
        case NETWORK.polygon:
            return 137;
        case NETWORK.fantom:
            return 250;
        case NETWORK.avalanche:
            return 43114;
        case NETWORK.mumbai:
            return 80001;
        case NETWORK.aurora:
            return 1313161554;
        case NETWORK.harmony:
            return 1666600000;
        default:
            return 0;
    }
};
