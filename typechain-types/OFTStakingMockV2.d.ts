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

interface OFTStakingMockV2Interface extends ethers.utils.Interface {
  functions: {
    "DST_GAS_FOR_CALL()": FunctionFragment;
    "PT_DEPOSIT_TO_REMOTE_CHAIN()": FunctionFragment;
    "balances(address)": FunctionFragment;
    "deposit(uint256)": FunctionFragment;
    "depositToDstChain(uint16,bytes,uint256,bytes)": FunctionFragment;
    "oft()": FunctionFragment;
    "onOFTReceived(uint16,bytes,uint64,bytes32,uint256,bytes)": FunctionFragment;
    "paused()": FunctionFragment;
    "quoteForDeposit(uint16,bytes,uint256,bytes)": FunctionFragment;
    "remoteStakingContracts(uint16)": FunctionFragment;
    "setPaused(bool)": FunctionFragment;
    "setRemoteStakingContract(uint16,bytes32)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
    "withdrawTo(uint256,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DST_GAS_FOR_CALL",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "PT_DEPOSIT_TO_REMOTE_CHAIN",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "balances", values: [string]): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositToDstChain",
    values: [BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "oft", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "onOFTReceived",
    values: [
      BigNumberish,
      BytesLike,
      BigNumberish,
      BytesLike,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "quoteForDeposit",
    values: [BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "remoteStakingContracts",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setPaused", values: [boolean]): string;
  encodeFunctionData(
    functionFragment: "setRemoteStakingContract",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTo",
    values: [BigNumberish, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "DST_GAS_FOR_CALL",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "PT_DEPOSIT_TO_REMOTE_CHAIN",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositToDstChain",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oft", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onOFTReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "quoteForDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "remoteStakingContracts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPaused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRemoteStakingContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;

  events: {
    "Deposit(address,uint256)": EventFragment;
    "DepositToDstChain(address,uint16,bytes,uint256)": EventFragment;
    "Withdrawal(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DepositToDstChain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawal"): EventFragment;
}

export type DepositEvent = TypedEvent<
  [string, BigNumber] & { from: string; amount: BigNumber }
>;

export type DepositToDstChainEvent = TypedEvent<
  [string, number, string, BigNumber] & {
    from: string;
    dstChainId: number;
    to: string;
    amountOut: BigNumber;
  }
>;

export type WithdrawalEvent = TypedEvent<
  [string, BigNumber] & { to: string; amount: BigNumber }
>;

export class OFTStakingMockV2 extends BaseContract {
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

  interface: OFTStakingMockV2Interface;

  functions: {
    DST_GAS_FOR_CALL(overrides?: CallOverrides): Promise<[BigNumber]>;

    PT_DEPOSIT_TO_REMOTE_CHAIN(overrides?: CallOverrides): Promise<[number]>;

    balances(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    deposit(
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositToDstChain(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    oft(overrides?: CallOverrides): Promise<[string]>;

    onOFTReceived(
      _srcChainId: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      _from: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    quoteForDeposit(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    remoteStakingContracts(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setPaused(
      _paused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRemoteStakingContract(
      _chainId: BigNumberish,
      _stakingContract: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawTo(
      _amount: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  DST_GAS_FOR_CALL(overrides?: CallOverrides): Promise<BigNumber>;

  PT_DEPOSIT_TO_REMOTE_CHAIN(overrides?: CallOverrides): Promise<number>;

  balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    _amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositToDstChain(
    _dstChainId: BigNumberish,
    _to: BytesLike,
    _amount: BigNumberish,
    _adapterParams: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  oft(overrides?: CallOverrides): Promise<string>;

  onOFTReceived(
    _srcChainId: BigNumberish,
    arg1: BytesLike,
    arg2: BigNumberish,
    _from: BytesLike,
    _amount: BigNumberish,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  quoteForDeposit(
    _dstChainId: BigNumberish,
    _to: BytesLike,
    _amount: BigNumberish,
    _adapterParams: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
  >;

  remoteStakingContracts(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  setPaused(
    _paused: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRemoteStakingContract(
    _chainId: BigNumberish,
    _stakingContract: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawTo(
    _amount: BigNumberish,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DST_GAS_FOR_CALL(overrides?: CallOverrides): Promise<BigNumber>;

    PT_DEPOSIT_TO_REMOTE_CHAIN(overrides?: CallOverrides): Promise<number>;

    balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    deposit(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    depositToDstChain(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    oft(overrides?: CallOverrides): Promise<string>;

    onOFTReceived(
      _srcChainId: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      _from: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    quoteForDeposit(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    remoteStakingContracts(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    setPaused(_paused: boolean, overrides?: CallOverrides): Promise<void>;

    setRemoteStakingContract(
      _chainId: BigNumberish,
      _stakingContract: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdrawTo(
      _amount: BigNumberish,
      _to: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Deposit(address,uint256)"(
      from?: null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { from: string; amount: BigNumber }
    >;

    Deposit(
      from?: null,
      amount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { from: string; amount: BigNumber }
    >;

    "DepositToDstChain(address,uint16,bytes,uint256)"(
      from?: null,
      dstChainId?: null,
      to?: null,
      amountOut?: null
    ): TypedEventFilter<
      [string, number, string, BigNumber],
      { from: string; dstChainId: number; to: string; amountOut: BigNumber }
    >;

    DepositToDstChain(
      from?: null,
      dstChainId?: null,
      to?: null,
      amountOut?: null
    ): TypedEventFilter<
      [string, number, string, BigNumber],
      { from: string; dstChainId: number; to: string; amountOut: BigNumber }
    >;

    "Withdrawal(address,uint256)"(
      to?: null,
      amount?: null
    ): TypedEventFilter<[string, BigNumber], { to: string; amount: BigNumber }>;

    Withdrawal(
      to?: null,
      amount?: null
    ): TypedEventFilter<[string, BigNumber], { to: string; amount: BigNumber }>;
  };

  estimateGas: {
    DST_GAS_FOR_CALL(overrides?: CallOverrides): Promise<BigNumber>;

    PT_DEPOSIT_TO_REMOTE_CHAIN(overrides?: CallOverrides): Promise<BigNumber>;

    balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositToDstChain(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    oft(overrides?: CallOverrides): Promise<BigNumber>;

    onOFTReceived(
      _srcChainId: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      _from: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    quoteForDeposit(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    remoteStakingContracts(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPaused(
      _paused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRemoteStakingContract(
      _chainId: BigNumberish,
      _stakingContract: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawTo(
      _amount: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DST_GAS_FOR_CALL(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PT_DEPOSIT_TO_REMOTE_CHAIN(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balances(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposit(
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositToDstChain(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    oft(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    onOFTReceived(
      _srcChainId: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      _from: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    quoteForDeposit(
      _dstChainId: BigNumberish,
      _to: BytesLike,
      _amount: BigNumberish,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    remoteStakingContracts(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPaused(
      _paused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRemoteStakingContract(
      _chainId: BigNumberish,
      _stakingContract: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTo(
      _amount: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
