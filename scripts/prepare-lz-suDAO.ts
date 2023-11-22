// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, getNamedAccounts } from "hardhat";

import { getIdByNetworkName, NETWORK } from "../utils/network";
import { SomeTokenDAO } from "../typechain";
import SU_DAO_MUMBAI from "../submodule-artifacts/mumbai/SomeTokenDAO.json";
import SU_DAO_GOERLI from "../submodule-artifacts/goerli/SomeTokenDAO.json";
import { lzChainId } from "../utils/endpoint";
import { createBN1e18 } from "../test/utils";

/** Here we have a script that make all preparations,
 * set all needed data for transfer SuDAO between two chains and two users.
 * */
async function main() {
    let tx;
    const { deployer } = await getNamedAccounts();
    const deployerSigner = await ethers.getSigner(deployer);

    const network = await ethers.provider.getNetwork();
    console.log("Current network:", network.name);

    const suDAO = (await ethers.getContract("SomeTokenDAO")) as SomeTokenDAO;
    tx = await suDAO.connect(deployerSigner).mint(deployerSigner.address, createBN1e18(100));
    await tx.wait();
    console.log("✅ Mint for deployer success");

    let dstChainId: number;
    let localContractAddress: string;
    let dstContractAddress: string;

    switch (network.chainId) {
        case getIdByNetworkName(NETWORK.goerli): {
            dstChainId = lzChainId[NETWORK.mumbai];
            localContractAddress = SU_DAO_GOERLI.address;
            dstContractAddress = SU_DAO_MUMBAI.address;
            break;
        }
        case getIdByNetworkName(NETWORK.mumbai): {
            dstChainId = lzChainId[NETWORK.goerli];
            localContractAddress = SU_DAO_MUMBAI.address;
            dstContractAddress = SU_DAO_GOERLI.address;
            break;
        }
        default: {
            dstChainId = 0;
            localContractAddress = "";
            dstContractAddress = "";
        }
    }

    tx = await suDAO.trustAddress(dstContractAddress);
    await tx.wait();
    console.log("✅ trustAddress success");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
