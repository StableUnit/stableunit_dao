import { DeployFunction } from "hardhat-deploy/types";
import { ethers, getNamedAccounts } from "hardhat";
import { getNetworkNameById, NETWORK } from "../utils/network";
import {SuAccessControlSingleton} from "../typechain-types";

const func: DeployFunction = async () => {
    const accessControlSingleton = (await ethers.getContract("SuAccessControlSingleton")) as SuAccessControlSingleton;

    const TOKENS = {
        [NETWORK.goerli]: { range: [0, 99] },
        [NETWORK.mumbai]: { range: [100, 199] },
        [NETWORK.sepolia]: { range: [200, 299] },
        [NETWORK.polygon]: { range: [300, 399] },
        [NETWORK.unsupported]: { range: [0, 99] },
    };

    const { nft } = await getNamedAccounts();
    const network = await ethers.provider.getNetwork();
    const token = TOKENS[getNetworkNameById(network.chainId)];

    let signatureVerificationLib = (await ethers.getContractOrNull("SignatureVerification"));
    if (!signatureVerificationLib) {
        console.log('Deploying SignatureVerification');
        const SignatureVerificationLib = await ethers.getContractFactory("SignatureVerification");
        signatureVerificationLib = await SignatureVerificationLib.deploy();
        await signatureVerificationLib.deployed();
    }

    console.log(`✅ SignatureVerification deployed`);

    const MockErc721CrossChainV2 = await ethers.getContractFactory(
        "MockErc721CrossChainV2",
        // { libraries: { SignatureVerification: signatureVerificationLib.address }}
    );
    const args = [accessControlSingleton.address, nft, token.range[0], token.range[1]];
    console.log(args)
    // const mockErc721CrossChainV2 = await upgrades.deployProxy(MockErc721CrossChainV2, args, { unsafeAllow: ['external-library-linking'] });
    // await mockErc721CrossChainV2.deployed();
    //
    // console.log(
    //     `✅ NFT deployed on chain ${network.name} with range ${token.range[0]}-${token.range[1]} with address ${mockErc721CrossChainV2.address}`
    // );

    // await run("verify:verify", { address: tx.address, constructorArguments: args });
    console.log("✅ NFT verified");
};
export default func;
func.tags = ["NFT"];
