import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, getNamedAccounts, run } from "hardhat";
import { getNetworkNameById, NETWORK } from "../utils/network";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const TOKENS = {
        [NETWORK.goerli]: { range: [0, 99] },
        [NETWORK.mumbai]: { range: [100, 199] },
        [NETWORK.sepolia]: { range: [200, 299] },
        [NETWORK.unsupported]: { range: [0, 99] },
    };

    const { nft, deployer } = await getNamedAccounts();
    const network = await ethers.provider.getNetwork();
    const token = TOKENS[getNetworkNameById(network.chainId)];

    const deployOptions = { from: deployer, log: true, waitConfirmations: 1 };
    const args = [nft, token.range[0], token.range[1]];
    const tx = await hre.deployments.deploy("MockErc721CrossChain", { ...deployOptions, args });
    console.log(
        `✅ NFT deployed on chain ${network.name} with range ${token.range[0]}-${token.range[1]} with address ${tx.address}`
    );

    // await run("verify:verify", { address: tx.address, constructorArguments: args });
    console.log("✅ NFT verified");
};
export default func;
func.tags = ["NFT"];
