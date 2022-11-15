# StableUnit_v2

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![built-with openzeppelin](https://img.shields.io/badge/built%20with-OpenZeppelin-3677FF)](https://docs.openzeppelin.com/)

## Overview
StableUnit - over-collateralized multi-currency stablecoin that yields interest directly to users wallets.
Censorship resistance is achieved by DAO ownership.

The end goal is to expand DAO for the maximum number of people
and implement an open-source monetary system that owned by everyone on the planet
and shares benefit equally for everyone.
Collective ownership would prevent centralized abuse such as overprinting and solves UBI.
[More details](https://www.notion.so/System-details-29fa471948df4353a960e96ca292a830)

DAO is owned and governed by NFT and SuDAO token holders,
to represent both reputation-based and capital-based sources of influence.
This repository contains wip implementation of the system.

[Full documentation](https://www.notion.so/StableUnit-DAO-d49f036e13b1417eac48f5b93c9c20fc)

# Proposal 
My proposal for stableunit community to form onchain org to creating something cool together
init DAO
---
1. create two wallets on bsc and ethereum with the same address
2. ask for $5-10 donations
3. deploy multisig bsc
4. share github with ready to use migration script with
  4.1 deploy suDAO token and transfer ownership to multisig
  4.2 deploy vesting contract
  4.3 put under 1y vesting 0.1% of total supply of suDAO tokens and airdrops it to all donators equally
5. setup snapshot + safeSnap for vested suDAO tokens and add it to multisig
**now we have DAO from the project supporters which is able to deploy any contact on BSC and control the faite of the project**


Oversimplified plan
---
1. we develop contracts which exchange 7% of suDAO for special NFT
2. create a proposal for DAO to issue a 3 types of NFT tokens:
  
    type A for $1000

    type B for $10,000

    type C for $100,000
  
    contract for redeem fNFTs for suDAO over time

    contract which pays to developers in 5 milestones, and DAO can vote NO is dev didn’t reach milestones.
3. dao-multisig sells these NFTs on OPEN
4. build the best stablecoin possible
5. share ownership for every person in the world

# StableUnitDao structure
    snapshot.org for offchain voting on all chains
        controls StableUnitDao-multisig - safe gnosis 
        SafeSnap - oracle to deliver snapshot offchain voting onchains
    StableUnitDao-NFTs
        ogNFT 
        aNFT  
        cNFT  
        kolNFT
    SuDAO.sol - erc20 with voteDelegate
    Distributors
        TokenDistributor_v3.sol - code for friends only, to distribute first suDAO and get initital capital
            tokens get distributed via timelockVault
        TimelockVault.sol - locks suDAO under vesting




# Deployment

## Compile
```
npm install  --legacy-peer-deps
npm audit fix
npx hardhat typechain
npx hardhat compile
```

## Test
We have 3 types of test: unit, integration and deployments.
For clear testing you should delete `.openzeppelin/unknown-31337.json`.

You can run tests by this:
```
npm run test:unit
npm run test:integration
npm run test:deployment
```

To see contracts coverage running all tests run this:
```
npm run coverage
```

## Deploy contracts
if you add new/remove migrations-ts script - please delete all files from js folder so migrations-ts would be recompiled.
```
npm run migrate -- --network rinkeby
```

## Verify
```
npm run verify
```
or
```
truffle run verify GnosisSafeProxy --network rinkeby
truffle run verify StableUnitDAOaNFT --network rinkeby
truffle run verify SuDAO --network rinkeby
truffle run verify VestingToken --network rinkeby 
truffle run verify TokenDistributor_v3s1 --network rinkeby --debug
truffle run verify StableUnitDAOogNFT --network rinkeby

truffle run verify NftMock --network rinkeby
truffle run verify TokenMock --network rinkeby
```

# StableUnit DAO NFTs

Features three options for NFT DAO:
- Og-NFT, original community of 99+ participants
- A-NFT, advisors
- C-NFT, community tokens. Allow inviting new members

## Voting power memo

Voting power in StableUnit DAO is split between StableUnit NFT and suDAO tokens.

StableUnit dao has 2 token vote system: NFT and suDAO

We have 3 NFT tokens:
- Og-NFT - genesis community
- A-NFT - advisors
- C-NFT - future community members

```
1. Og-NFT in total would have f_og(t) suDAO voting power from 100% to 30% at the end of the year
2. A-NFT in total would have f_a(t) suDAO voting power 1/10 from all og-NFT
3. C-NFT in total would have f_c(t) from 0 to 50% (I,.e, same as og-NFT eventually)
```
SuDAO in minted every block like bitcoin-like function and goes to treasury, split into 4 buckets:
1. Capital providers & patrons 15%
2. Development 25 %(+4 year vesting)
3. Farming and other incentives 30%
4. DAO Treasury 30%

Og-NFT got invited by core team. 
Each next invitee has diminishing voting power such that a sum of all NFT powers is finite, like bitcoin mint.

C-NFT token get the same system, can be any amount of members, but each new one gets little less voting power


## Development

### Check contract

```bash
npx hardhat test
```

### Deploy to the network

```bash
npx hardhat run scripts/deploy-nft.ts --network NETWORK_NAME
```

For networks other than Ethereum, provide BSC/POLYGONSCAN API KEY like this:
```bash
ETHERSCAN_API_KEY=your-bsc/polygonscan-api-key npx hardhat run scripts/deploy-nft.ts --network NETWORK_NAME
```

This will deploy contract to the network, verify on Xscan, pause the contract for transferring tokens. **Save the deployed address**

### Mint NFTs to the list of recipients

Place the list of addresses into `airdrop1.csv` files, 20 in each.

Run airdrop like this:

```bash
npx hardhat airdrop --address 0xDEPLOYED_ADDRESS --filename ./airdrop.csv --network NETWORK_NAME
```

### Grant admin access to your account

```bash
npx hardhat grant-role --address 0xDEPLOYED_ADDRESS --network NETWORK_NAME \
    --role ADMIN \
    --account 0xyouraddress
```

Optionally, grant yourself minter and pauser access:

```bash
npx hardhat grant-role --address 0xDEPLOYED_ADDRESS --network NETWORK_NAME \
    --role MINTER \
    --account 0xyouraddress
```

```bash
npx hardhat grant-role --address 0xDEPLOYED_ADDRESS --network NETWORK_NAME \
    --role PAUSER \
    --account 0xyouraddress
```


### Revoke access from deployer account

```bash
npx hardhat renounce-role --address 0xDEPLOYED_ADDRESS --network NETWORK_NAME
```

## Hardhat Guide

This project demonstrates a basic Hardhat use case. 
It comes with a sample contract, a test for that contract, 
a sample script that deploys that contract, and an example of a task implementation, 
which simply lists the available accounts.

Try running some following tasks:
```shell
npm install
npx hardhat accounts
npx hardhat compile
npx hardhat test
```

Deploy & verify (verification might fail)
```shell
npx hardhat run scripts/deploy-nft.ts --network mumbai
```

### Verify

```bash
npx hardhat verify --network mumbai 0x000000006cD799E2cC7A3Fe68ef0D8bfD7f8f477
```

### airdrop NFTs
```bash
npx hardhat airdrop --network mumbai --address 0x000000006cD799E2cC7A3Fe68ef0D8bfD7f8f477 --filename ./airdrop.csv
```

### transfer ownership to another address
```bash
npx hardhat transfer-owner --network mumbai --address 0x000000006cD799E2cC7A3Fe68ef0D8bfD7f8f477 --owner 0xF2A961aF157426953e392F6468B0162F86B2aCBC

```

### renounce the deployer as an owner
```bash
 npx hardhat renounce-role --network mumbai --address 0x000000006cD799E2cC7A3Fe68ef0D8bfD7f8f477
```

### Deploy instructions
1. Generate typechain by `hardhat typechain` (you may need to comment 21-23 lines in hardhat.config.js and after generation uncomment them)
2. deployer run `npm run deploy:goerli` (has only PRIVATE_KEY_TESTNET_DEPLOYER)
3. admin run `npx hardhat setDistributor --verbose --network goerli` (he has also PRIVATE_KEY_TESTNET_ADMIN)
4. admin run `npx hardhat setBonus --verbose --network goerli`
5. admin run `npm run verify:goerli`
6. dao (multisig) run `suDAO.mint(tokenDistributor.address, 1450000000000000000000000)`
7. dao (multisig) run `accessControlSingleton.grantRole(await tokenDistributor.ADMIN_ROLE(), tokenDistributor.address)` from gnosis-safe multisig.
   1. ADMIN_ROLE is `0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775`
   2. tokenDistributor.address you can find in `submodule-artifacts/goerli/TokenDistributorV4.json`

### Upgrade instructions
1. Choose what you need in `scripts/propose-upgrade.ts` in `main` function. 
2. Run `npm run upgrade-proposal:goerli`
   1. If you have `deployment at 0x... address is not registered` error, you have incorrect .openzeppelin/goerli.json. So you need to run forceImport (10 line in propose-upgrade.ts)
3. Go to the url in the log (it's url of created proposal that can see that ProxyAdmin owner is gnosis-safe multisig)
4. In the proposal - addresses, that are in the gnosis-safe multisig, can approve this proposal
5. After that you can execute it.
6. If proposal is executed you can verify contract via `npm run verify:goerli`

### CrossChain NFT

We use Layer-Zero UniversalONFT721 in the base. So for make NFT cross-chain sendable you should:
1. Deploy to chain1 with `npm run deploy-nft:goerli`
2. Deploy to chain2 with `npm run deploy-nft:mumbai`
3. Prepare NFT in chain1 with `hardhat run ./scripts/prepare-lz-nft.ts --network mumbai`
4. Prepare NFT in chain2 with `hardhat run ./scripts/prepare-lz-nft.ts --network goerli`
5. For testing tha all works - run script that send token with id 100 from deployer in mumbai to admin in goerli with `hardhat run ./scripts/send-lz-nft.ts --network mumbai`
