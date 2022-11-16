// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, getNamedAccounts } from "hardhat";

import { getIdByNetworkName, getLZIdByNetworkName, NETWORK } from "../utils/network";
import { MockErc721CrossChain } from "../typechain";
import { ADDRESS_ZERO } from "../test/utils";

const utf8Encode = new TextEncoder();

/** Here we have a script that transfer MockErc721CrossChain between two chains and two users.
 * It should be called after deploying MockErc721CrossChain and running prepare-lz-nft.ts
 * */
async function main() {
    let tx;
    const { deployer, admin } = await getNamedAccounts();
    const adminSigner = await ethers.getSigner(admin);
    const deployerSigner = await ethers.getSigner(deployer);

    const network = await ethers.provider.getNetwork();
    console.log("Current network = ", network.name);

    const mockErc721CrossChain = (await ethers.getContract("MockErc721CrossChain")) as MockErc721CrossChain;

    // tx = await mockErc721CrossChain.connect(deployerSigner).mint();
    // await tx.wait();
    // console.log('✅ Mint for deployer success');

    console.log("deployer balance", (await mockErc721CrossChain.balanceOf(deployerSigner.address)).toString());
    console.log("admin balance", (await mockErc721CrossChain.balanceOf(adminSigner.address)).toString());

    let dstChainId: number;
    let tokenIdToSend: number;

    switch (network.chainId) {
        case getIdByNetworkName(NETWORK.goerli): {
            dstChainId = getLZIdByNetworkName(NETWORK.mumbai);
            tokenIdToSend = 0;
            break;
        }
        case getIdByNetworkName(NETWORK.mumbai): {
            dstChainId = getLZIdByNetworkName(NETWORK.goerli);
            tokenIdToSend = 100;
            break;
        }
        default: {
            tokenIdToSend = 0;
            dstChainId = 0;
        }
    }

    const adapterParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, 2000000]);
    const fee = await mockErc721CrossChain.estimateSendFee(
        dstChainId,
        utf8Encode.encode(adminSigner.address),
        tokenIdToSend,
        false,
        adapterParams
    );
    console.log("fee:", fee.nativeFee.toString());

    // eslint-disable-next-line prefer-const
    tx = await mockErc721CrossChain.sendFrom(
        deployerSigner.address,
        dstChainId,
        adminSigner.address,
        tokenIdToSend,
        deployerSigner.address,
        ADDRESS_ZERO,
        adapterParams,
        { value: fee.nativeFee.mul(2) }
    );
    await tx.wait();
    console.log("✅ sendFrom success", tx);

    console.log(
        "deployer balance after send NFT",
        (await mockErc721CrossChain.balanceOf(deployerSigner.address)).toString()
    );
    console.log("admin balance after send NFT", (await mockErc721CrossChain.balanceOf(adminSigner.address)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
