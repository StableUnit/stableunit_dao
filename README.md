# StableUnit Prove of the Concept v2

## Modules Description

There are 8 main modules:

### 1) Lending Module
This module has two sub-mobules: vault and manager.

Vault stores user's collateral deposits

The manager gives ability to borrow/withdraw/repay/deposit. It's trustless and admin doesn't have any acess to user's funds.

### 2) Liquidation Module
Module, responsible for liquidation bad CDPs.

If CDP is able to be liquidated, so [liquidation bot](https://github.com/StableUnit/liquidation-bot) use this module to liquidate position and get some profit

To work with vault we have all support functions in Manager and bot don't have any access to user's funds.

### 3) Oracle Module
We use ChainLink and UniSwap to get correct token price.

### 4) Reward Module
Module to get profit from lending, liquidations, laasModule and forex.

All profit distributes between StablePro users.

### 5) StablePro Module
Our main token with ability to get profit every block without any user actions. It can be USDPro, EURPro and so on.

### 6) Access Module
Simple module that check access for function calls. Other modules should inherit to be authenticated and has all access modifiers

### 7) LAAS Module
Here we use external lending protocol to have profit from collaterals.

After that we distribute all profit between StablePro users using Reward Module.

### 8) Guard Module
To have a stable price of StablePro = 1 Fiat Currency (USD, EUR and so on) we must have protection against a big drop in demand, too large price drops and other black swans in the market.

In this module we have such guard mechanisms.

### Diagram of StableUnit protocol:

![StableUnit.png](StableUnit.png)

## Tech

### repo structure
The `master` branch has the latest working version.

Branches such as `workable_repo` have work in progress for the current SCRUM task with corresponding name.

git `submodule-artifacts` is being used to store contract artifacts deployed in each network
and can be import in other repos such as front-ends, liquidation scripts, or documentation.

### Quick Start

#### First, clone repository to your local machine:

```
git clone git@github.com:StableUnit/stableunit-poc-v2.git
cd stableunit-poc-v2
git submodule update --init --recursive
```

#### Then, install dependencies

```
yarn
```

We are using dev environment based on hardhat framework.

#### compile contracts

```
hardhat typechain
hardhat compile
```

#### lint contracts (we use solhint)

```
npm run solhint
```

### Testing
#### [IMPORTANT] All tests runs on mainnet fork (check ./hardhat.config.ts), so chainlink and univ3 oracles gets real prices, that are used in lending module, liquidation and so on.
#### We need that to be sure, that our code works with real prices and can be easily deployed to mainnet.
#### But for exchange module to be able to change prices fast and easy we use goerli.

#### [IMPORTANT] Before running tests, create your INCH_API_KEY here: https://portal.1inch.dev/applications

Description of types of tests read in **test/TESTS_ARCHITECTURE.md**

#### execute tests

```
npm run test
```

or you can do it by parts:

- **unit** tests

```
npm run test:unit
```

- **integration** tests

```
npm run test:integration
```

- **deployment** tests

```
npm run test:deployment
```

To run **live** tests (tests that need blockchain in real time) you should run on one terminal
```
npm run node:live
```
and on another
```
npm run test:live
```

### Update test mocks
For some tests we call 1INCH API to get data for the swaps in ArbitrageHelpers. For example we call it, when we need to exchange LP-tokens.

1INCH API return real-time responses, but we use constant blockNumber in hardhat.config.ts to fork mainnet for tests.

To resolve that we store this responses from API in utils/mockedResponses.json.
As default, we use this mocks in each test. But if you need to update the blockNumber and tests => you need to update constants in contracts/periphery/test/constants.ts and utils/1inch.ts:
- MOCK_BLOCK_NUMBER - number of new block you want to fork from
- NEED_TO_UPDATE
   - true, if you need to call 1inch API and store it for the block №{MOCK_BLOCK_NUMBER}
   - false, if you need to use 1inch API mocks in the block №{MOCK_BLOCK_NUMBER}

So, the most common case will to update mocks - just update MOCK_BLOCK_NUMBER and set NEED_TO_UPDATE to true and run
```
npm run test:integration
```
Before merge, don't forget to set NEED_TO_UPDATE back to false.

## Testnet deployment

#### configure .env file

- For internal deployment: use `git secret reveal`.

- For extremal deployment: it's necessary to specify private keys of deployment wallets, APIs etc.

Please follow instructions and format specified in  `.env.example` file

#### TLDR
```
npm run deploy:goerli
npm run verify:goerli
```

#### deploy main contracts to external network

```
npx hardhat deploy --tags DeployContracts --network goerli
```

#### deploy mock collateral assets to test network

```
npx hardhat deploy --tags Mock --network goerli
```

Note, these contracts will be reused unless they had any changes in the code.

After mock tokens are deployed, the script also will configure oracle and collaterals manager to support them.

Also, you can also run config scripts and do it all in one command:
```
npm run deploy:goerli
```

#### upgrade contracts
Upgrade main contracts with changes in goerli testnet:
```
npm run upgrade:goerli
```
#### verify source code on etherscan

We are using hardhat-etherscan package to verify source code on etherscan.

Be sure that ETHERSCAN_API_KEY is set up .env file

Then execute command to verify deployed contracts

It will take addresses and arguments from the artifacts

```
npm run verify:goerli
```

If you want to verify Exchange Module contracts, then run

```
npm run verify-exchange:goerli
```

#### commit deployment artifacts

Deployment artifacts are saved into "submodule-artifacts" directory, which is also initialized as git submodule.
To use it in other git repositories such as client, be sure you push the latest changes to the repo.

```
cd submodule-artifacts
git commit -m "deployed" && git push
```

#### code before git-commit code will be automatically verified

```
  "pre-commit": [
    "clean-cache",
    "lint-staged",
    "lint:fix",
    "solhint",
    "test:integration",
    "test:unit"
  ],
```
