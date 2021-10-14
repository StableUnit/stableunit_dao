import {SuDAOInstance} from "../types/truffle-contracts";

const truffleAssert = require('truffle-assertions');
// @ts-ignore
import {assert, web3, artifacts} from "hardhat";

// @ts-ignore
const suDAO = artifacts.require("SuDAO");
// @ts-ignore
const Token = artifacts.require("TokenMock");
const bn1e18 = web3.utils.toBN(1e18);

describe("SuDAO", () => {
    let accounts: string[];
    let user: string;
    let suDAOInstance: SuDAOInstance;

    const suDAOTotalSupply = bn1e18.muln(1000);
    const mintAmount = bn1e18.muln(10);
    const MAX_SUPPLY = bn1e18.muln(21000000);
    const ethAmount = bn1e18.muln(2);
    const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000';

    async function mint(account = accounts[1], amount = mintAmount, from = accounts[0]) {
        let balanceBefore = await suDAOInstance.balanceOf(account);
        await suDAOInstance.mint(account, amount, {from});
        let balanceAfter = await suDAOInstance.balanceOf(account);

        assert.isTrue(amount.eq(balanceAfter.sub(balanceBefore)));
    }

    beforeEach(async function () {
        accounts = await web3.eth.getAccounts();
        user = accounts[1];

        suDAOInstance = await suDAO.new(suDAOTotalSupply);
    });

    describe("mint", function () {
        it("Should be able to mint", async () => {
            await mint(user);
        });

        it("Should be able to mint MAX_SUPPLY", async () => {
            await mint(user, MAX_SUPPLY.sub(suDAOTotalSupply));
        });

        it("Should not be able to mint MAX_SUPPLY + 1 after burn", async () => {
            await mint(user, MAX_SUPPLY.sub(suDAOTotalSupply));
            await suDAOInstance.burn(MAX_SUPPLY.divn(2), {from: user});

            await truffleAssert.reverts(
                mint(user, MAX_SUPPLY.divn(2).addn(1)),
                "max supply is exceeded"
            );
        });

        it("Should not be able to mint > MAX_SUPPLY", async () => {
            await truffleAssert.reverts(
                suDAOInstance.mint(user, MAX_SUPPLY),
                "max supply is exceeded"
            );
        });

        it("Should not be able to mint due to caller is not a minter", async () => {
            await truffleAssert.reverts(
                suDAOInstance.mint(user, mintAmount, {from: user})
                // , "caller is not a minter"
            );
        });
    });

    describe("Access control", function () {
        it("Should be able to transfer ownership", async () => {
            await suDAOInstance.transferOwnership(user);
        });
        it("Should be able to set minter", async () => {
            await suDAOInstance.setMinter(user, true);
            await mint(user, mintAmount, user);
        });

        it("Should be able to unset minter", async () => {
            await suDAOInstance.setMinter(user, true);
            await mint(user, mintAmount, user);

            await suDAOInstance.setMinter(user, false);
            await truffleAssert.reverts(
                suDAOInstance.mint(user, mintAmount, {from: user})
                // , "caller is not a minter"
            );
        });

        it("Should not be able to set minter due to caller is not an owner", async () => {
            await truffleAssert.reverts(
                suDAOInstance.setMinter(user, true, {from: user})
                // , "Ownable: caller is not the owner"
            );
        });
    });


    describe("rescueTokens", function () {
        it("Should rescue eth successfully", async () => {
            const user = accounts[0];
            await web3.eth.sendTransaction({to: suDAOInstance.address, value: ethAmount, from: user});

            let balanceBefore = await web3.eth.getBalance(user);
            await suDAOInstance.rescueTokens(GENESIS_ADDRESS
                // , user, ethAmount
            );
            let balanceAfter = await web3.eth.getBalance(user);

            // assert.isTrue(ethAmount.eq(web3.utils.toBN(balanceAfter).sub(web3.utils.toBN(balanceBefore))));
            assert.isTrue(Number(balanceBefore.toString()) < Number(balanceAfter.toString()));
        });

        // it("Should rescue eth successfully with incorrect amount provided", async () => {
        //     const user = accounts[0];
        //     await web3.eth.sendTransaction({to: suDAOInstance.address, value: ethAmount, from: user});
        //
        //     let balanceBefore = await web3.eth.getBalance(user);
        //     await suDAOInstance.rescueTokens(GENESIS_ADDRESS
        //         // , user, ethAmount.add(bn1e18)
        //     );
        //     let balanceAfter = await web3.eth.getBalance(user);
        //
        //     assert.isTrue(ethAmount.eq(web3.utils.toBN(balanceAfter).sub(web3.utils.toBN(balanceBefore))));
        // });

        // it("Should rescue eth successfully with less amount provided", async () => {
        //     const user = accounts[0];
        //     await web3.eth.sendTransaction({to: suDAOInstance.address, value: ethAmount, from: user});
        //
        //     let balanceBefore = await web3.eth.getBalance(user);
        //     await suDAOInstance.rescueTokens(GENESIS_ADDRESS
        //         // , user, ethAmount.sub(bn1e18)
        //     );
        //     let balanceAfter = await web3.eth.getBalance(user);
        //
        //     assert.isTrue(ethAmount.sub(bn1e18).eq(web3.utils.toBN(balanceAfter).sub(web3.utils.toBN(balanceBefore))));
        // });

        it("Should rescue tokens successfully", async () => {
            const user = accounts[0];
            let testTokenInstance = await Token.new('Test Token', 'TST', '18');
            await testTokenInstance.mint(suDAOInstance.address, mintAmount);

            let balanceBefore = await testTokenInstance.balanceOf(user);
            await suDAOInstance.rescueTokens(testTokenInstance.address
                // , user, mintAmount
            );
            let balanceAfter = await testTokenInstance.balanceOf(user);

            assert.isTrue(mintAmount.eq(web3.utils.toBN(balanceAfter).sub(web3.utils.toBN(balanceBefore))));
        });

        // it("Should rescue tokens successfully with incorrect amount provided", async () => {
        //     let testTokenInstance = await Token.new('Test Token', 'TST', '18');
        //     await testTokenInstance.mint(suDAOInstance.address, mintAmount);
        //
        //     let balanceBefore = await testTokenInstance.balanceOf(user);
        //     await suDAOInstance.rescueTokens(testTokenInstance.address, user, mintAmount.add(bn1e18));
        //     let balanceAfter = await testTokenInstance.balanceOf(user);
        //
        //     assert.isTrue(mintAmount.eq(web3.utils.toBN(balanceAfter).sub(web3.utils.toBN(balanceBefore))));
        // });

        // it("Should rescue tokens successfully with less amount provided", async () => {
        //     let testTokenInstance = await Token.new('Test Token', 'TST', '18');
        //     await testTokenInstance.mint(suDAOInstance.address, mintAmount);
        //
        //     let balanceBefore = await testTokenInstance.balanceOf(user);
        //     await suDAOInstance.rescueTokens(testTokenInstance.address, user, mintAmount.sub(bn1e18));
        //     let balanceAfter = await testTokenInstance.balanceOf(user);
        //
        //     assert.isTrue(mintAmount.sub(bn1e18).eq(web3.utils.toBN(balanceAfter).sub(web3.utils.toBN(balanceBefore))));
        // });

        // it("Should not be able to rescue tokens due to trying to send 0 balance", async () => {
        //     let testTokenInstance = await Token.new('Test Token', 'TST', '18');
        //
        //     await truffleAssert.reverts(
        //         suDAOInstance.rescueTokens(testTokenInstance.address, user, mintAmount),
        //         "suDAO: trying to send 0 balance"
        //     );
        // });

        // it("Should not be able to rescue eth due to can not send to zero address", async () => {
        //     await web3.eth.sendTransaction({to: suDAOInstance.address, value: ethAmount, from: user});
        //
        //     await truffleAssert.reverts(
        //         suDAOInstance.rescueTokens(GENESIS_ADDRESS
        //             // , GENESIS_ADDRESS, ethAmount
        //         ),
        //         "suDAO: can not send to zero address"
        //     );
        // });

        it("Should not be able to rescue eth due to caller is not an owner", async () => {
            await web3.eth.sendTransaction({to: suDAOInstance.address, value: ethAmount, from: user});

            await truffleAssert.reverts(
                suDAOInstance.rescueTokens(GENESIS_ADDRESS
                    // , user, ethAmount
                    , {from: user}
                )
                // , "Ownable: caller is not the owner"
            );
        });
    });

});



