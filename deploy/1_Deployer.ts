import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types";
import {
    Bonus,
    MockErc721Extended,
    SuAccessControlSingleton,
    SuDAO,
    TokenDistributorV4,
    VeERC20,
    VeERC721Extension, VotingPower
} from "../typechain";
import deployProxy, {deploy, getDeploymentAddress} from "../test/utils/deploy";
import {expect} from "chai";
import {ethers} from "hardhat";

// TODO: move all mocks deploy in separate deploy script
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const [deployer, admin, dao] = await hre.ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    console.log("Deployer network =  ", network);

    const accessControlSingleton = await deployProxy("SuAccessControlSingleton", [deployer.address, admin.address]) as SuAccessControlSingleton;
    const suDAO = await deployProxy("SuDAO", [accessControlSingleton.address]) as SuDAO;
    const bonus = await deployProxy("Bonus", [accessControlSingleton.address, admin.address]) as Bonus;
    // Unix Timestamp	1685577600 = GMT+0 Thu Jun 01 2023 00:00:00 GMT+0000
    const tgeTimestamp = 1685577600;
    const veERC20 = await deployProxy("VeERC20", [accessControlSingleton.address, suDAO.address, tgeTimestamp]) as VeERC20;
    const tokenDistributor = await deployProxy(
        "TokenDistributorV4",
        [accessControlSingleton.address, suDAO.address, veERC20.address, bonus.address]
    ) as TokenDistributorV4;

    const veErc721ExtensionAddress = await getDeploymentAddress(deployer.address,2);
    const mockErc721Extended = await deploy("MockErc721Extended", ["mock cNFT", "t_cNFT", veErc721ExtensionAddress]) as MockErc721Extended;
    const veErc721Extension = await deployProxy("VeERC721Extension", [accessControlSingleton.address, mockErc721Extended.address, bonus.address]) as VeERC721Extension;
    expect(veErc721ExtensionAddress).to.be.equal(veErc721Extension.address);
    await accessControlSingleton.grantRole(await accessControlSingleton.ADMIN_ROLE(), mockErc721Extended.address);

    // TODO: check that vote power of tokens will be 50%/50% and the sum of weight is 1 (or 100).
    const votingPower = await deployProxy("VotingPower", [accessControlSingleton.address, "StableUnit Voting Power", "vpSuDAO"]) as VotingPower;
    let tx = await votingPower.setTokenWeight(veERC20.address,"1");
    await tx.wait();
    tx = await votingPower.setTokenWeight(veErc721Extension.address,"1");
    await tx.wait();
    const mockErc721 = await deployProxy("MockErc721", ["Mock StableUnit NFT", "t_NFT"]);
};
export default func;
func.tags = ["Deployer"];
