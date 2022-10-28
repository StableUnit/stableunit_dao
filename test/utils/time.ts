const { ethers } = require("hardhat");

const { BigNumber } = ethers;

export const BLOCKS_IN_MINUTE = 4;
export const BLOCKS_IN_HOUR = BLOCKS_IN_MINUTE * 60;
export const BLOCKS_IN_DAY = BLOCKS_IN_HOUR * 24;

export async function advanceBlock() {
  return ethers.provider.send("evm_mine", []);
}

export async function waitNBlocks(blockNumber: number) {
  for (let i = 0; i < blockNumber; i++) {
    // eslint-disable-next-line no-await-in-loop
    await advanceBlock();
  }
}

export async function increaseTime(value: number) {
  await ethers.provider.send("evm_increaseTime", [value]);
  await advanceBlock();
}

export async function latest() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

export async function getLastBlock() {
  return ethers.provider.getBlock("latest");
}

export async function advanceTime(time: number) {
  await ethers.provider.send("evm_increaseTime", [time]);
}

export async function advanceTimeAndBlock(time: number) {
  await advanceTime(time);
  await advanceBlock();
}

export const duration = {
  seconds(val: string) {
    return BigNumber.from(val);
  },
  minutes(val: string) {
    return BigNumber.from(val).mul(this.seconds("60"));
  },
  hours(val: string) {
    return BigNumber.from(val).mul(this.minutes("60"));
  },
  days(val: string) {
    return BigNumber.from(val).mul(this.hours("24"));
  },
  weeks(val: string) {
    return BigNumber.from(val).mul(this.days("7"));
  },
  years(val: string) {
    return BigNumber.from(val).mul(this.days("365"));
  },
};
