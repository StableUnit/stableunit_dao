# StableUnit_v2

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![built-with openzeppelin](https://img.shields.io/badge/built%20with-OpenZeppelin-3677FF)](https://docs.openzeppelin.com/)

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

## fundrasing
---
1. we develop contracts which exchange 7% of suDAO for special NFT
2. create a proposal for DAO to issue a 3 types of NFT token,
  type a for $1000
  type b for $10,000
  type c for $100,000
  contract for redeem them for suDAO over time
  contract which pays to developers in 5 milestones, and DAO can vote NO is dev didn’t reach milestones.
3. multisig sells these NFTs on OPEN
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
        TokenDistributor_v2.sol - code for friends only, to distribute first suDAO and get initital capital
            tokens get distributed via timelockVault
        TimelockVault.sol - locks suDAO under vesting




# Deplopment

## Compile
`
npm install
npm audit fix
truffle compile
`

## Test
`
npx hardhat test
`

## Test coverage
`
npx hardhat coverage
`

## Deploy contracts
`
truffle migrate --network rinkeby
`

## Verify
```
truffle run verify SuDAO --network rinkeby
truffle run verify StableUnitDAOaNFT --network rinkeby
truffle run verify VeToken --network rinkeby 
truffle run verify TokenDistributor_v3 --network rinkeby
truffle run verify NftMock --network rinkeby

truffle run verify GnosisSafeProxy --network rinkeby
truffle run verify TokenMock --network rinkeby
```


