const OG_NFT_JSON = "QmP8vZkeDEr2wwsiqhJ4JW44dZPzgXpYVQENK7gnPm628Z";
const A_NFT_JSON = "QmemBvkthjTuKZiNhZRAvUVCvNu4bKzHE6698aX1qzNQEL";

const GNOSIS = {
    GNOSIS_SAFE_FACTORY: "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2",
    GNOSIS_SAFE_MASTERCOPY: "0xd9db270c1b5e3bd161e8c8503c55ceabee709552",
    GNOSIS_SAFE_FALLBACK: "0xf48f2b2d2a534e402487b3ee7c18c33aec0fe5e4",
}

const RINKEBY = {
    NAME: "rinkeby",

    DEVELOPERS: [
        "0xF2A961aF157426953e392F6468B0162F86B2aCBC",
        "0xb79EbAa162f92A3E5B8E0CE3446e8b4a4E5C0A4B",
        "0xace5686774d6b5dee84dc9f94fa803536415f172",
    ],
    TESTERS: [
        "0x108E17e5d67102F5a7896056F5897f29674dEf6f",
        "0xffa3a3eFc1229116c9F1DEC71B788e6F89338C7c",
        "0xb0bfd8dd56e9122a84fa88ca56e199100de8266c",
        // additional
        "0x2a88a5c23A5e0c0638a56B3485AbFe038A5e8Ea4"
    ],

    GNOSIS_SAFE_FACTORY: GNOSIS.GNOSIS_SAFE_FACTORY,
    GNOSIS_SAFE_MASTERCOPY: GNOSIS.GNOSIS_SAFE_MASTERCOPY,
    GNOSIS_SAFE_FALLBACK: GNOSIS.GNOSIS_SAFE_FALLBACK,

    MULTISIG: "",
    DAI: "",
    OG_NFT: "",
    // A_NFT
    // SU_DAO
    // TIMELOCK_VAULT
    // DISTRIBUTOR
    //
}

const MAINNET = {
    NAME: "mainnet",

    DEVELOPERS: [
        "0xCcCcCccc5aD35d8e5B3389559cBF8F0971c0B0ad"
    ],
    TESTERS: [],

    GNOSIS_SAFE_FACTORY: GNOSIS.GNOSIS_SAFE_FACTORY,
    GNOSIS_SAFE_MASTERCOPY: GNOSIS.GNOSIS_SAFE_MASTERCOPY,
    GNOSIS_SAFE_FALLBACK: GNOSIS.GNOSIS_SAFE_FALLBACK,

    MULTISIG: "0x1604e6c50F48aBd827d1518E97790Ff70F8dcD63",
    DAI: "",
    OG_NFT: "",
    // A_NFT
    // SU_DAO
    // TIMELOCK_VAULT
    // DISTRIBUTOR
}

const BSC = {
    NAME: "bsc",

    DEVELOPERS: MAINNET.DEVELOPERS,
    TESTERS: MAINNET.TESTERS,

    GNOSIS_SAFE_FACTORY: GNOSIS.GNOSIS_SAFE_FACTORY,
    GNOSIS_SAFE_MASTERCOPY: GNOSIS.GNOSIS_SAFE_MASTERCOPY,
    GNOSIS_SAFE_FALLBACK: GNOSIS.GNOSIS_SAFE_FALLBACK,

    MULTISIG: "0xdDddD6BCDF3Ec3C770D6819E9Be84c55DbC82DEe",
    DAI: "",
    OG_NFT: "",
}

const POLYGON = {
    NAME: "polygon",

    GNOSIS_SAFE_FACTORY: GNOSIS.GNOSIS_SAFE_FACTORY,
    GNOSIS_SAFE_MASTERCOPY: GNOSIS.GNOSIS_SAFE_MASTERCOPY,
    GNOSIS_SAFE_FALLBACK: GNOSIS.GNOSIS_SAFE_FALLBACK,
}


export {RINKEBY, MAINNET, BSC, POLYGON, OG_NFT_JSON, A_NFT_JSON};

export function getDeployedAddresses(network: string): typeof RINKEBY {
    let NETWORK = {} as typeof RINKEBY;
    if (network == RINKEBY.NAME) NETWORK = RINKEBY; else
    if (network == BSC.NAME) NETWORK = BSC; else
        throw "unknown network";
    return NETWORK;
}
