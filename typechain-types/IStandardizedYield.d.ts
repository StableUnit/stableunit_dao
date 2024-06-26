/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IStandardizedYieldInterface extends ethers.utils.Interface {
  functions: {
    "accruedRewards(address)": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "assetInfo()": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "claimRewards(address)": FunctionFragment;
    "decimals()": FunctionFragment;
    "deposit(address,address,uint256,uint256)": FunctionFragment;
    "exchangeRate()": FunctionFragment;
    "getRewardTokens()": FunctionFragment;
    "getTokensIn()": FunctionFragment;
    "getTokensOut()": FunctionFragment;
    "isValidTokenIn(address)": FunctionFragment;
    "isValidTokenOut(address)": FunctionFragment;
    "name()": FunctionFragment;
    "previewDeposit(address,uint256)": FunctionFragment;
    "previewRedeem(address,uint256)": FunctionFragment;
    "redeem(address,uint256,address,uint256,bool)": FunctionFragment;
    "rewardIndexesCurrent()": FunctionFragment;
    "rewardIndexesStored()": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "yieldToken()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accruedRewards",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "assetInfo", values?: undefined): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "claimRewards",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "exchangeRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRewardTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokensIn",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokensOut",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isValidTokenIn",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidTokenOut",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "previewDeposit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "previewRedeem",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [string, BigNumberish, string, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardIndexesCurrent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardIndexesStored",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "yieldToken",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "accruedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "assetInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "exchangeRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokensIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokensOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidTokenIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidTokenOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "previewDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "previewRedeem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardIndexesCurrent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardIndexesStored",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "yieldToken", data: BytesLike): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ClaimRewards(address,address[],uint256[])": EventFragment;
    "Deposit(address,address,address,uint256,uint256)": EventFragment;
    "Redeem(address,address,address,uint256,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ClaimRewards"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redeem"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber] & {
    owner: string;
    spender: string;
    value: BigNumber;
  }
>;

export type ClaimRewardsEvent = TypedEvent<
  [string, string[], BigNumber[]] & {
    user: string;
    rewardTokens: string[];
    rewardAmounts: BigNumber[];
  }
>;

export type DepositEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber] & {
    caller: string;
    receiver: string;
    tokenIn: string;
    amountDeposited: BigNumber;
    amountSyOut: BigNumber;
  }
>;

export type RedeemEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber] & {
    caller: string;
    receiver: string;
    tokenOut: string;
    amountSyToRedeem: BigNumber;
    amountTokenOut: BigNumber;
  }
>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; value: BigNumber }
>;

export class IStandardizedYield extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IStandardizedYieldInterface;

  functions: {
    accruedRewards(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { rewardAmounts: BigNumber[] }>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    assetInfo(
      overrides?: CallOverrides
    ): Promise<
      [number, string, number] & {
        assetType: number;
        assetAddress: string;
        assetDecimals: number;
      }
    >;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    claimRewards(
      user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    deposit(
      receiver: string,
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      minSharesOut: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exchangeRate(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { res: BigNumber }>;

    getRewardTokens(overrides?: CallOverrides): Promise<[string[]]>;

    getTokensIn(
      overrides?: CallOverrides
    ): Promise<[string[]] & { res: string[] }>;

    getTokensOut(
      overrides?: CallOverrides
    ): Promise<[string[]] & { res: string[] }>;

    isValidTokenIn(
      token: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isValidTokenOut(
      token: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    previewDeposit(
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amountSharesOut: BigNumber }>;

    previewRedeem(
      tokenOut: string,
      amountSharesToRedeem: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amountTokenOut: BigNumber }>;

    redeem(
      receiver: string,
      amountSharesToRedeem: BigNumberish,
      tokenOut: string,
      minTokenOut: BigNumberish,
      burnFromInternalBalance: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardIndexesCurrent(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardIndexesStored(
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { indexes: BigNumber[] }>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    yieldToken(overrides?: CallOverrides): Promise<[string]>;
  };

  accruedRewards(user: string, overrides?: CallOverrides): Promise<BigNumber[]>;

  allowance(
    owner: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  assetInfo(
    overrides?: CallOverrides
  ): Promise<
    [number, string, number] & {
      assetType: number;
      assetAddress: string;
      assetDecimals: number;
    }
  >;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  claimRewards(
    user: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  decimals(overrides?: CallOverrides): Promise<number>;

  deposit(
    receiver: string,
    tokenIn: string,
    amountTokenToDeposit: BigNumberish,
    minSharesOut: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exchangeRate(overrides?: CallOverrides): Promise<BigNumber>;

  getRewardTokens(overrides?: CallOverrides): Promise<string[]>;

  getTokensIn(overrides?: CallOverrides): Promise<string[]>;

  getTokensOut(overrides?: CallOverrides): Promise<string[]>;

  isValidTokenIn(token: string, overrides?: CallOverrides): Promise<boolean>;

  isValidTokenOut(token: string, overrides?: CallOverrides): Promise<boolean>;

  name(overrides?: CallOverrides): Promise<string>;

  previewDeposit(
    tokenIn: string,
    amountTokenToDeposit: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  previewRedeem(
    tokenOut: string,
    amountSharesToRedeem: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  redeem(
    receiver: string,
    amountSharesToRedeem: BigNumberish,
    tokenOut: string,
    minTokenOut: BigNumberish,
    burnFromInternalBalance: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardIndexesCurrent(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardIndexesStored(overrides?: CallOverrides): Promise<BigNumber[]>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  yieldToken(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    accruedRewards(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    assetInfo(
      overrides?: CallOverrides
    ): Promise<
      [number, string, number] & {
        assetType: number;
        assetAddress: string;
        assetDecimals: number;
      }
    >;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    claimRewards(user: string, overrides?: CallOverrides): Promise<BigNumber[]>;

    decimals(overrides?: CallOverrides): Promise<number>;

    deposit(
      receiver: string,
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      minSharesOut: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exchangeRate(overrides?: CallOverrides): Promise<BigNumber>;

    getRewardTokens(overrides?: CallOverrides): Promise<string[]>;

    getTokensIn(overrides?: CallOverrides): Promise<string[]>;

    getTokensOut(overrides?: CallOverrides): Promise<string[]>;

    isValidTokenIn(token: string, overrides?: CallOverrides): Promise<boolean>;

    isValidTokenOut(token: string, overrides?: CallOverrides): Promise<boolean>;

    name(overrides?: CallOverrides): Promise<string>;

    previewDeposit(
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewRedeem(
      tokenOut: string,
      amountSharesToRedeem: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeem(
      receiver: string,
      amountSharesToRedeem: BigNumberish,
      tokenOut: string,
      minTokenOut: BigNumberish,
      burnFromInternalBalance: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardIndexesCurrent(overrides?: CallOverrides): Promise<BigNumber[]>;

    rewardIndexesStored(overrides?: CallOverrides): Promise<BigNumber[]>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    yieldToken(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; spender: string; value: BigNumber }
    >;

    Approval(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; spender: string; value: BigNumber }
    >;

    "ClaimRewards(address,address[],uint256[])"(
      user?: string | null,
      rewardTokens?: null,
      rewardAmounts?: null
    ): TypedEventFilter<
      [string, string[], BigNumber[]],
      { user: string; rewardTokens: string[]; rewardAmounts: BigNumber[] }
    >;

    ClaimRewards(
      user?: string | null,
      rewardTokens?: null,
      rewardAmounts?: null
    ): TypedEventFilter<
      [string, string[], BigNumber[]],
      { user: string; rewardTokens: string[]; rewardAmounts: BigNumber[] }
    >;

    "Deposit(address,address,address,uint256,uint256)"(
      caller?: string | null,
      receiver?: string | null,
      tokenIn?: string | null,
      amountDeposited?: null,
      amountSyOut?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        caller: string;
        receiver: string;
        tokenIn: string;
        amountDeposited: BigNumber;
        amountSyOut: BigNumber;
      }
    >;

    Deposit(
      caller?: string | null,
      receiver?: string | null,
      tokenIn?: string | null,
      amountDeposited?: null,
      amountSyOut?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        caller: string;
        receiver: string;
        tokenIn: string;
        amountDeposited: BigNumber;
        amountSyOut: BigNumber;
      }
    >;

    "Redeem(address,address,address,uint256,uint256)"(
      caller?: string | null,
      receiver?: string | null,
      tokenOut?: string | null,
      amountSyToRedeem?: null,
      amountTokenOut?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        caller: string;
        receiver: string;
        tokenOut: string;
        amountSyToRedeem: BigNumber;
        amountTokenOut: BigNumber;
      }
    >;

    Redeem(
      caller?: string | null,
      receiver?: string | null,
      tokenOut?: string | null,
      amountSyToRedeem?: null,
      amountTokenOut?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, BigNumber],
      {
        caller: string;
        receiver: string;
        tokenOut: string;
        amountSyToRedeem: BigNumber;
        amountTokenOut: BigNumber;
      }
    >;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;

    Transfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; value: BigNumber }
    >;
  };

  estimateGas: {
    accruedRewards(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    assetInfo(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    claimRewards(
      user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      receiver: string,
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      minSharesOut: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exchangeRate(overrides?: CallOverrides): Promise<BigNumber>;

    getRewardTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getTokensIn(overrides?: CallOverrides): Promise<BigNumber>;

    getTokensOut(overrides?: CallOverrides): Promise<BigNumber>;

    isValidTokenIn(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isValidTokenOut(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    previewDeposit(
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewRedeem(
      tokenOut: string,
      amountSharesToRedeem: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeem(
      receiver: string,
      amountSharesToRedeem: BigNumberish,
      tokenOut: string,
      minTokenOut: BigNumberish,
      burnFromInternalBalance: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardIndexesCurrent(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardIndexesStored(overrides?: CallOverrides): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    yieldToken(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    accruedRewards(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    assetInfo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimRewards(
      user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      receiver: string,
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      minSharesOut: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exchangeRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRewardTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokensIn(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokensOut(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isValidTokenIn(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidTokenOut(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    previewDeposit(
      tokenIn: string,
      amountTokenToDeposit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    previewRedeem(
      tokenOut: string,
      amountSharesToRedeem: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    redeem(
      receiver: string,
      amountSharesToRedeem: BigNumberish,
      tokenOut: string,
      minTokenOut: BigNumberish,
      burnFromInternalBalance: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardIndexesCurrent(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardIndexesStored(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    yieldToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
