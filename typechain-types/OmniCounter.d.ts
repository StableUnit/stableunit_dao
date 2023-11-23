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

interface OmniCounterInterface extends ethers.utils.Interface {
  functions: {
    "DEFAULT_PAYLOAD_SIZE_LIMIT()": FunctionFragment;
    "PAYLOAD()": FunctionFragment;
    "counter()": FunctionFragment;
    "estimateFee(uint16,bool,bytes)": FunctionFragment;
    "failedMessages(uint16,bytes,uint64)": FunctionFragment;
    "forceResumeReceive(uint16,bytes)": FunctionFragment;
    "getConfig(uint16,uint16,address,uint256)": FunctionFragment;
    "getOracle(uint16)": FunctionFragment;
    "getTrustedRemoteAddress(uint16)": FunctionFragment;
    "incrementCounter(uint16)": FunctionFragment;
    "isTrustedRemote(uint16,bytes)": FunctionFragment;
    "lzEndpoint()": FunctionFragment;
    "lzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
    "minDstGasLookup(uint16,uint16)": FunctionFragment;
    "nonblockingLzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
    "owner()": FunctionFragment;
    "payloadSizeLimitLookup(uint16)": FunctionFragment;
    "precrime()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "retryMessage(uint16,bytes,uint64,bytes)": FunctionFragment;
    "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
    "setMinDstGas(uint16,uint16,uint256)": FunctionFragment;
    "setOracle(uint16,address)": FunctionFragment;
    "setPayloadSizeLimit(uint16,uint256)": FunctionFragment;
    "setPrecrime(address)": FunctionFragment;
    "setReceiveVersion(uint16)": FunctionFragment;
    "setSendVersion(uint16)": FunctionFragment;
    "setTrustedRemote(uint16,bytes)": FunctionFragment;
    "setTrustedRemoteAddress(uint16,bytes)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "trustedRemoteLookup(uint16)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DEFAULT_PAYLOAD_SIZE_LIMIT",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "PAYLOAD", values?: undefined): string;
  encodeFunctionData(functionFragment: "counter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "estimateFee",
    values: [BigNumberish, boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "failedMessages",
    values: [BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "forceResumeReceive",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getConfig",
    values: [BigNumberish, BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getOracle",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTrustedRemoteAddress",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "incrementCounter",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedRemote",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lzEndpoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lzReceive",
    values: [BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "minDstGasLookup",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "nonblockingLzReceive",
    values: [BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "payloadSizeLimitLookup",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "precrime", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retryMessage",
    values: [BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setConfig",
    values: [BigNumberish, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setMinDstGas",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracle",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPayloadSizeLimit",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setPrecrime", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setReceiveVersion",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setSendVersion",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTrustedRemote",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setTrustedRemoteAddress",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "trustedRemoteLookup",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "DEFAULT_PAYLOAD_SIZE_LIMIT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "PAYLOAD", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "counter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "estimateFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "failedMessages",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "forceResumeReceive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getOracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTrustedRemoteAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "incrementCounter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedRemote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lzEndpoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lzReceive", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "minDstGasLookup",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nonblockingLzReceive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "payloadSizeLimitLookup",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "precrime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retryMessage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMinDstGas",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOracle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setPayloadSizeLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPrecrime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReceiveVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSendVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTrustedRemote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTrustedRemoteAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "trustedRemoteLookup",
    data: BytesLike
  ): Result;

  events: {
    "MessageFailed(uint16,bytes,uint64,bytes,bytes)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RetryMessageSuccess(uint16,bytes,uint64,bytes32)": EventFragment;
    "SetMinDstGas(uint16,uint16,uint256)": EventFragment;
    "SetPrecrime(address)": EventFragment;
    "SetTrustedRemote(uint16,bytes)": EventFragment;
    "SetTrustedRemoteAddress(uint16,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MessageFailed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RetryMessageSuccess"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetMinDstGas"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetPrecrime"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTrustedRemote"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTrustedRemoteAddress"): EventFragment;
}

export type MessageFailedEvent = TypedEvent<
  [number, string, BigNumber, string, string] & {
    _srcChainId: number;
    _srcAddress: string;
    _nonce: BigNumber;
    _payload: string;
    _reason: string;
  }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type RetryMessageSuccessEvent = TypedEvent<
  [number, string, BigNumber, string] & {
    _srcChainId: number;
    _srcAddress: string;
    _nonce: BigNumber;
    _payloadHash: string;
  }
>;

export type SetMinDstGasEvent = TypedEvent<
  [number, number, BigNumber] & {
    _dstChainId: number;
    _type: number;
    _minDstGas: BigNumber;
  }
>;

export type SetPrecrimeEvent = TypedEvent<[string] & { precrime: string }>;

export type SetTrustedRemoteEvent = TypedEvent<
  [number, string] & { _remoteChainId: number; _path: string }
>;

export type SetTrustedRemoteAddressEvent = TypedEvent<
  [number, string] & { _remoteChainId: number; _remoteAddress: string }
>;

export class OmniCounter extends BaseContract {
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

  interface: OmniCounterInterface;

  functions: {
    DEFAULT_PAYLOAD_SIZE_LIMIT(overrides?: CallOverrides): Promise<[BigNumber]>;

    PAYLOAD(overrides?: CallOverrides): Promise<[string]>;

    counter(overrides?: CallOverrides): Promise<[BigNumber]>;

    estimateFee(
      _dstChainId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getOracle(
      remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { _oracle: string }>;

    getTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    incrementCounter(
      _dstChainId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    lzEndpoint(overrides?: CallOverrides): Promise<[string]>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    minDstGasLookup(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    nonblockingLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    payloadSizeLimitLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    precrime(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    retryMessage(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMinDstGas(
      _dstChainId: BigNumberish,
      _packetType: BigNumberish,
      _minGas: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOracle(
      dstChainId: BigNumberish,
      oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPayloadSizeLimit(
      _dstChainId: BigNumberish,
      _size: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPrecrime(
      _precrime: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTrustedRemote(
      _remoteChainId: BigNumberish,
      _path: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      _remoteAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  DEFAULT_PAYLOAD_SIZE_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

  PAYLOAD(overrides?: CallOverrides): Promise<string>;

  counter(overrides?: CallOverrides): Promise<BigNumber>;

  estimateFee(
    _dstChainId: BigNumberish,
    _useZro: boolean,
    _adapterParams: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
  >;

  failedMessages(
    arg0: BigNumberish,
    arg1: BytesLike,
    arg2: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  forceResumeReceive(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getConfig(
    _version: BigNumberish,
    _chainId: BigNumberish,
    arg2: string,
    _configType: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getOracle(
    remoteChainId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getTrustedRemoteAddress(
    _remoteChainId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  incrementCounter(
    _dstChainId: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isTrustedRemote(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  lzEndpoint(overrides?: CallOverrides): Promise<string>;

  lzReceive(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _nonce: BigNumberish,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  minDstGasLookup(
    arg0: BigNumberish,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  nonblockingLzReceive(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _nonce: BigNumberish,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  payloadSizeLimitLookup(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  precrime(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  retryMessage(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _nonce: BigNumberish,
    _payload: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setConfig(
    _version: BigNumberish,
    _chainId: BigNumberish,
    _configType: BigNumberish,
    _config: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMinDstGas(
    _dstChainId: BigNumberish,
    _packetType: BigNumberish,
    _minGas: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOracle(
    dstChainId: BigNumberish,
    oracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPayloadSizeLimit(
    _dstChainId: BigNumberish,
    _size: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPrecrime(
    _precrime: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setReceiveVersion(
    _version: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSendVersion(
    _version: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTrustedRemote(
    _remoteChainId: BigNumberish,
    _path: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTrustedRemoteAddress(
    _remoteChainId: BigNumberish,
    _remoteAddress: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  trustedRemoteLookup(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    DEFAULT_PAYLOAD_SIZE_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    PAYLOAD(overrides?: CallOverrides): Promise<string>;

    counter(overrides?: CallOverrides): Promise<BigNumber>;

    estimateFee(
      _dstChainId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getOracle(
      remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    incrementCounter(
      _dstChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    lzEndpoint(overrides?: CallOverrides): Promise<string>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    minDstGasLookup(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nonblockingLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    payloadSizeLimitLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    precrime(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    retryMessage(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setMinDstGas(
      _dstChainId: BigNumberish,
      _packetType: BigNumberish,
      _minGas: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setOracle(
      dstChainId: BigNumberish,
      oracle: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setPayloadSizeLimit(
      _dstChainId: BigNumberish,
      _size: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPrecrime(_precrime: string, overrides?: CallOverrides): Promise<void>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTrustedRemote(
      _remoteChainId: BigNumberish,
      _path: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      _remoteAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "MessageFailed(uint16,bytes,uint64,bytes,bytes)"(
      _srcChainId?: null,
      _srcAddress?: null,
      _nonce?: null,
      _payload?: null,
      _reason?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _payload: string;
        _reason: string;
      }
    >;

    MessageFailed(
      _srcChainId?: null,
      _srcAddress?: null,
      _nonce?: null,
      _payload?: null,
      _reason?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _payload: string;
        _reason: string;
      }
    >;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "RetryMessageSuccess(uint16,bytes,uint64,bytes32)"(
      _srcChainId?: null,
      _srcAddress?: null,
      _nonce?: null,
      _payloadHash?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _payloadHash: string;
      }
    >;

    RetryMessageSuccess(
      _srcChainId?: null,
      _srcAddress?: null,
      _nonce?: null,
      _payloadHash?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _payloadHash: string;
      }
    >;

    "SetMinDstGas(uint16,uint16,uint256)"(
      _dstChainId?: null,
      _type?: null,
      _minDstGas?: null
    ): TypedEventFilter<
      [number, number, BigNumber],
      { _dstChainId: number; _type: number; _minDstGas: BigNumber }
    >;

    SetMinDstGas(
      _dstChainId?: null,
      _type?: null,
      _minDstGas?: null
    ): TypedEventFilter<
      [number, number, BigNumber],
      { _dstChainId: number; _type: number; _minDstGas: BigNumber }
    >;

    "SetPrecrime(address)"(
      precrime?: null
    ): TypedEventFilter<[string], { precrime: string }>;

    SetPrecrime(
      precrime?: null
    ): TypedEventFilter<[string], { precrime: string }>;

    "SetTrustedRemote(uint16,bytes)"(
      _remoteChainId?: null,
      _path?: null
    ): TypedEventFilter<
      [number, string],
      { _remoteChainId: number; _path: string }
    >;

    SetTrustedRemote(
      _remoteChainId?: null,
      _path?: null
    ): TypedEventFilter<
      [number, string],
      { _remoteChainId: number; _path: string }
    >;

    "SetTrustedRemoteAddress(uint16,bytes)"(
      _remoteChainId?: null,
      _remoteAddress?: null
    ): TypedEventFilter<
      [number, string],
      { _remoteChainId: number; _remoteAddress: string }
    >;

    SetTrustedRemoteAddress(
      _remoteChainId?: null,
      _remoteAddress?: null
    ): TypedEventFilter<
      [number, string],
      { _remoteChainId: number; _remoteAddress: string }
    >;
  };

  estimateGas: {
    DEFAULT_PAYLOAD_SIZE_LIMIT(overrides?: CallOverrides): Promise<BigNumber>;

    PAYLOAD(overrides?: CallOverrides): Promise<BigNumber>;

    counter(overrides?: CallOverrides): Promise<BigNumber>;

    estimateFee(
      _dstChainId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOracle(
      remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    incrementCounter(
      _dstChainId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lzEndpoint(overrides?: CallOverrides): Promise<BigNumber>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    minDstGasLookup(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nonblockingLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    payloadSizeLimitLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    precrime(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    retryMessage(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMinDstGas(
      _dstChainId: BigNumberish,
      _packetType: BigNumberish,
      _minGas: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOracle(
      dstChainId: BigNumberish,
      oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPayloadSizeLimit(
      _dstChainId: BigNumberish,
      _size: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPrecrime(
      _precrime: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTrustedRemote(
      _remoteChainId: BigNumberish,
      _path: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      _remoteAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DEFAULT_PAYLOAD_SIZE_LIMIT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    PAYLOAD(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    counter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    estimateFee(
      _dstChainId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOracle(
      remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    incrementCounter(
      _dstChainId: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lzEndpoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    minDstGasLookup(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nonblockingLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    payloadSizeLimitLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    precrime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    retryMessage(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMinDstGas(
      _dstChainId: BigNumberish,
      _packetType: BigNumberish,
      _minGas: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOracle(
      dstChainId: BigNumberish,
      oracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPayloadSizeLimit(
      _dstChainId: BigNumberish,
      _size: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPrecrime(
      _precrime: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTrustedRemote(
      _remoteChainId: BigNumberish,
      _path: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTrustedRemoteAddress(
      _remoteChainId: BigNumberish,
      _remoteAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
