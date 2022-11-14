// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, getNamedAccounts} from "hardhat";

import {getIdByNetworkName, getLZIdByNetworkName, NETWORK} from "../utils/network";
import {MockErc721CrossChain} from "../typechain";
import {ADDRESS_ZERO} from "../test/utils";
import CROSS_CHAIN_MUMBAI from "../submodule-artifacts/mumbai/MockErc721CrossChain.json";
import CROSS_CHAIN_GOERLI from "../submodule-artifacts/goerli/MockErc721CrossChain.json";

const utf8Encode = new TextEncoder();

async function main() {
  const { nft, deployer, admin } = await getNamedAccounts();
  const adminSigner = await ethers.getSigner(admin);
  const deployerSigner = await ethers.getSigner(deployer);

  const network = await ethers.provider.getNetwork();
  console.log("Current network = ", network.name);

  const mockErc721CrossChain = await ethers.getContract("MockErc721CrossChain") as MockErc721CrossChain;
  await mockErc721CrossChain.connect(deployerSigner).mint();
  await mockErc721CrossChain.connect(adminSigner).mint();
  console.log('✅ Mint success');

  console.log('deployer balance', (await mockErc721CrossChain.balanceOf(deployerSigner.address)).toString());
  console.log('admin balance', (await mockErc721CrossChain.balanceOf(adminSigner.address)).toString());

  switch (network.chainId) {
    case getIdByNetworkName(NETWORK.goerli): {
      console.log(getLZIdByNetworkName(NETWORK.mumbai), CROSS_CHAIN_MUMBAI.address);
      let tx = await mockErc721CrossChain.setTrustedRemoteAddress(getLZIdByNetworkName(NETWORK.mumbai), CROSS_CHAIN_MUMBAI.address);
      await tx.wait();
      console.log('✅ setTrustedRemoteAddress success');
      break;
    }
    case getIdByNetworkName(NETWORK.mumbai): {
      let tx = await mockErc721CrossChain.setTrustedRemoteAddress(getLZIdByNetworkName(NETWORK.goerli), CROSS_CHAIN_GOERLI.address)
      await tx.wait();
      console.log('✅ setTrustedRemoteAddress success');
      break;
    }
  }

  let fee = await mockErc721CrossChain.estimateSendFee(
    getLZIdByNetworkName(NETWORK.mumbai),
    utf8Encode.encode(adminSigner.address),
    2,
    false,
    utf8Encode.encode(""),
  );
  console.log('fee:', fee.nativeFee.toString());

  const tx = await mockErc721CrossChain.sendFrom(
    deployerSigner.address,
    getLZIdByNetworkName(NETWORK.mumbai),
    utf8Encode.encode(adminSigner.address),
    2,
    deployerSigner.address,
    ADDRESS_ZERO,
    utf8Encode.encode(""),
    { value: fee.nativeFee }
  );
  await tx.wait();
  console.log('✅ sendFrom success');

  console.log('deployer balance after send NFT', (await mockErc721CrossChain.balanceOf(deployerSigner.address)).toString());
  console.log('admin balance after send NFT', (await mockErc721CrossChain.balanceOf(adminSigner.address)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
