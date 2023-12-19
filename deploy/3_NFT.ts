import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades, run } from "hardhat";
import { getNetworkNameById, NETWORK } from "../utils/network";
import { SuAccessControlSingleton } from "../typechain-types";
import { endpoint } from "../utils/endpoint";

const func: DeployFunction = async () => {
    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;

    const STEP = 10_000;
    const generateRange = (i: number) => [(i - 1) * STEP, i * STEP - 1];
    const TOKENS = {
        [NETWORK.mainnet]: { range: generateRange(1) }, // from 0 to 9999
        [NETWORK.optimisticEthereum]: { range: generateRange(2) }, // from 10_000 to 19_999
        [NETWORK.opera]: { range: generateRange(3) },
        [NETWORK.arbitrumOne]: { range: generateRange(4) },
        [NETWORK.avalanche]: { range: generateRange(5) },
        [NETWORK.arbitrumSepolia]: { range: generateRange(6) },
        [NETWORK.sepolia]: { range: generateRange(7) },
        [NETWORK.optimisticGoerli]: { range: generateRange(8) },
    };

    const network = await ethers.provider.getNetwork();
    const token = TOKENS[getNetworkNameById(network.chainId)];
    const lzEndpoint = endpoint[getNetworkNameById(network.chainId)];

    // let signatureVerificationLib = (await ethers.getContractOrNull("SignatureVerification"));
    // if (!signatureVerificationLib) {
    //     console.log('Deploying SignatureVerification');
    //     const SignatureVerificationLib = await ethers.getContractFactory("SignatureVerification");
    //     signatureVerificationLib = await SignatureVerificationLib.deploy();
    //     await signatureVerificationLib.deployed();
    // }
    //
    // console.log(`✅ SignatureVerification deployed`);

    const MockErc721CrossChainV2 = await ethers.getContractFactory(
        "MockErc721CrossChainV2"
        // { libraries: { SignatureVerification: signatureVerificationLib.address }}
    );
    const args = [accessControlSingleton.address, lzEndpoint, token.range[0], token.range[1]];
    console.log(args);
    const mockErc721CrossChainV2 = await upgrades.deployProxy(MockErc721CrossChainV2, args, {
        unsafeAllow: ["external-library-linking"],
    });
    await mockErc721CrossChainV2.deployed();

    console.log(
        `✅ NFT deployed on chain ${network.name} with range ${token.range[0]}-${token.range[1]} with address ${mockErc721CrossChainV2.address}`
    );

    await run("verify:verify", { address: mockErc721CrossChainV2.address, constructorArguments: args });
    console.log("✅ NFT verified");
};
export default func;
func.tags = ["NFT"];
