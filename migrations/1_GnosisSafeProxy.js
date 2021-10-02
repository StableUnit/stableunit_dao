const SafeProxy = artifacts.require("GnosisSafeProxy");
const GnosisSafe = artifacts.require("GnosisSafe");
const GnosisSafeL2 = artifacts.require("GnosisSafeL2");

const {RINKEBY} = require("./deployed_addresses");

module.exports = function (deployer, network, accounts) {
    if (network !== "rinkeby") return;
    
    let NETWORK = {};
    if (network === RINKEBY.NAME) NETWORK = RINKEBY;
    
    deployer.then(async () => {
        let safeProxyInstance;
        if (NETWORK.MULTISIG) {
            safeProxyInstance = await SafeProxy.at(NETWORK.MULTISIG);
        } else {
            await deployer.deploy(SafeProxy, NETWORK.GNOSIS_SAFE_MASTERCOPY);
            safeProxyInstance = await SafeProxy.deployed();
            
            // setup according to https://docs.gnosis.io/safe/docs/contracts_deployment/
            //     /// @dev Setup function sets initial storage of contract.
            //     /// @param _owners List of Safe owners.
            //     /// @param _threshold Number of required confirmations for a Safe transaction.
            //     /// @param to Contract address for optional delegate call.
            //     /// @param data Data payload for optional delegate call.
            //     /// @param fallbackHandler Handler for fallback calls to this contract
            //     /// @param paymentToken Token that should be used for the payment (0 is ETH)
            //     /// @param payment Value that should be paid
            //     /// @param paymentReceiver Adddress that should receive the payment (or 0 if tx.origin)
            //     function setup(
            //         address[] calldata _owners,
            //         uint256 _threshold,
            //         address to,
            //         bytes calldata data,
            //         address fallbackHandler,
            //         address paymentToken,
            //         uint256 payment,
            //         address payable paymentReceiver
            // )
            // apply interface of proxy target
            safeProxyInstance = await GnosisSafe.at(safeProxyInstance.address);
            console.log("await safeProxyInstance.setup(...)");
            await safeProxyInstance.setup(
                NETWORK.DEVELOPERS,
                1,
                "0x0000000000000000000000000000000000000000",
                web3.utils.asciiToHex(""),
                NETWORK.GNOSIS_SAFE_FALLBACK,
                "0x0000000000000000000000000000000000000000",
                0,
                "0x0000000000000000000000000000000000000000"
            );
        }
    });
};
