// we can decrease token balance, but not increase due to flash-loan attack
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export const MONTH = 30 * 24 * 60 * 60;
export const BN_1E18 = ethers.BigNumber.from(10).pow(18);
export const BN_1E12 = ethers.BigNumber.from(10).pow(12);
export const BN_1E6 = ethers.BigNumber.from(10).pow(6);
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const createBN1e18 = (value: number | string, decimals = 18) =>
    BigNumber.from(value).mul(BigNumber.from(10).pow(decimals));

export const getSumOfBN = (arr: BigNumber[]) =>
    arr.reduce((acc: BigNumber, v: BigNumber) => v.add(acc), BigNumber.from(0));

// export * from "./time";
export * from "./deploy";
