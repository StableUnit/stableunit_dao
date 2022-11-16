import Web3 from "web3";

const RLP = require("rlp");

const DEPLOYER_MIN_BALANCE = Web3.utils.toBN(1e18 * 1);
const ACCOUNT_DUST_THRESHOLD = Web3.utils.toBN(1e18 * 0.00001);

export async function assertZeroNonce(web3: Web3, deployerAddress: string) {
    const nonce = await web3.eth.getTransactionCount(deployerAddress);
    // eslint-disable-next-line no-throw-literal
    if (nonce !== 0) throw "deployer has nonce > 0";
}

export async function prepareVanityAddress(web3: Web3, deployerAcc: string, deployerVanity: string) {
    if ((await web3.eth.getTransactionCount(deployerVanity)) !== 0) {
        await withdrawEther(web3, deployerVanity, deployerAcc);
        // eslint-disable-next-line no-throw-literal
        throw "vanity address already used";
    }
}

export const predictAddress = async (web3: Web3, deployerAddress: string, nonceAdded = 0) => {
    const ownerNonce = (await web3.eth.getTransactionCount(deployerAddress)) + nonceAdded;
    // @ts-ignore
    const governorAddress = `0x${web3.utils
        .sha3(RLP.encode([deployerAddress, ownerNonce]))
        .slice(12)
        .substring(14)}`;
    return governorAddress;
};

export const fundDeployer = async (
    web3: Web3,
    fromAccount: string,
    toAccount: string,
    minBalance = DEPLOYER_MIN_BALANCE
) => {
    if (fromAccount === toAccount) return;
    const toAccountBalance = Number(await web3.eth.getBalance(toAccount));
    if (toAccountBalance > Number(minBalance.toString())) {
        console.log(`account ${toAccount} is already funded with ${toAccountBalance}`);
    } else {
        await web3.eth.sendTransaction({
            from: fromAccount,
            to: toAccount,
            value: DEPLOYER_MIN_BALANCE,
        });
        console.log(`fundDeployer: account funded with ${Number(minBalance.toString()) / 1e18} ETH`);
    }
};

export const withdrawEther = async (web3: Web3, fromAccount: string, toAccount: string) => {
    if (fromAccount === toAccount) return;

    // sometimes fromBalance doesn't count for the last tx, so we have to wait a bit
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const fromBalance = web3.utils.toBN(await web3.eth.getBalance(fromAccount));
    const gasPrice = web3.utils.toBN(await web3.eth.getGasPrice());
    const fromMaxToSend = fromBalance.sub(gasPrice.muln(21000));

    if (fromMaxToSend.gt(ACCOUNT_DUST_THRESHOLD)) {
        console.log(`withdrawEther: fromBalance ${fromBalance} gasPrice=${gasPrice} maxSend = ${fromMaxToSend}`);
        console.log(`withdrawEther: sending ${Number(fromMaxToSend.toString()) / 1e18} ETH from ${toAccount}`);
        // const fromBalance2 = web3.utils.toBN(await web3.eth.getBalance(fromAccount));
        // console.assert(fromBalance === fromBalance2);
        try {
            await web3.eth.sendTransaction({
                from: fromAccount,
                to: toAccount,
                value: fromMaxToSend,
                gasPrice,
            });
            const fromBalanceLeft = await web3.eth.getBalance(fromAccount);
            console.log(`withdrawEther: ${fromAccount} balance left ${Number(fromBalanceLeft.toString()) / 1e18} ETH`);
        } catch (e: any) {
            console.log("withdrawEther error:", e.toString());
        }
    }
};
