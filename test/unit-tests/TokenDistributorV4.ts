import { ethers } from "hardhat";
import { expect } from "chai";
import {SuAccessControlSingleton} from "../../typechain";

describe("TokenDistributorV4", () => {
    beforeEach(async () => {
        const AccessControlFactory = await ethers.getContractFactory("SuAccessControlSingleton");
        const TokenDistributorV4Factory = await ethers.getContractFactory("TokenDistributorV4");

    })
});
