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

interface ILayerZeroEndpointInterface extends ethers.utils.Interface {
  functions: {
    "estimateFees(uint16,address,bytes,bool,bytes)": FunctionFragment;
    "forceResumeReceive(uint16,bytes)": FunctionFragment;
    "getChainId()": FunctionFragment;
    "getConfig(uint16,uint16,address,uint256)": FunctionFragment;
    "getInboundNonce(uint16,bytes)": FunctionFragment;
    "getOutboundNonce(uint16,address)": FunctionFragment;
    "getReceiveLibraryAddress(address)": FunctionFragment;
    "getReceiveVersion(address)": FunctionFragment;
    "getSendLibraryAddress(address)": FunctionFragment;
    "getSendVersion(address)": FunctionFragment;
    "hasStoredPayload(uint16,bytes)": FunctionFragment;
    "isReceivingPayload()": FunctionFragment;
    "isSendingPayload()": FunctionFragment;
    "receivePayload(uint16,bytes,address,uint64,uint256,bytes)": FunctionFragment;
    "retryPayload(uint16,bytes,bytes)": FunctionFragment;
    "send(uint16,bytes,bytes,address,address,bytes)": FunctionFragment;
    "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
    "setReceiveVersion(uint16)": FunctionFragment;
    "setSendVersion(uint16)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "estimateFees",
    values: [BigNumberish, string, BytesLike, boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "forceResumeReceive",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getChainId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getConfig",
    values: [BigNumberish, BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getInboundNonce",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getOutboundNonce",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getReceiveLibraryAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getReceiveVersion",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getSendLibraryAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getSendVersion",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasStoredPayload",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isReceivingPayload",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isSendingPayload",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "receivePayload",
    values: [
      BigNumberish,
      BytesLike,
      string,
      BigNumberish,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "retryPayload",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "send",
    values: [BigNumberish, BytesLike, BytesLike, string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setConfig",
    values: [BigNumberish, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setReceiveVersion",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setSendVersion",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "estimateFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "forceResumeReceive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getInboundNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOutboundNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReceiveLibraryAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReceiveVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSendLibraryAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSendVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasStoredPayload",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isReceivingPayload",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isSendingPayload",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receivePayload",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retryPayload",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "send", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setReceiveVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSendVersion",
    data: BytesLike
  ): Result;

  events: {};
}

export class ILayerZeroEndpoint extends BaseContract {
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

  interface: ILayerZeroEndpointInterface;

  functions: {
    estimateFees(
      _dstChainId: BigNumberish,
      _userApplication: string,
      _payload: BytesLike,
      _payInZRO: boolean,
      _adapterParam: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getChainId(overrides?: CallOverrides): Promise<[number]>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _userApplication: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getInboundNonce(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getOutboundNonce(
      _dstChainId: BigNumberish,
      _srcAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getReceiveLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getReceiveVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getSendLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getSendVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    hasStoredPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isReceivingPayload(overrides?: CallOverrides): Promise<[boolean]>;

    isSendingPayload(overrides?: CallOverrides): Promise<[boolean]>;

    receivePayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _dstAddress: string,
      _nonce: BigNumberish,
      _gasLimit: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    retryPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    send(
      _dstChainId: BigNumberish,
      _destination: BytesLike,
      _payload: BytesLike,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
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
  };

  estimateFees(
    _dstChainId: BigNumberish,
    _userApplication: string,
    _payload: BytesLike,
    _payInZRO: boolean,
    _adapterParam: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
  >;

  forceResumeReceive(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getChainId(overrides?: CallOverrides): Promise<number>;

  getConfig(
    _version: BigNumberish,
    _chainId: BigNumberish,
    _userApplication: string,
    _configType: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getInboundNonce(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getOutboundNonce(
    _dstChainId: BigNumberish,
    _srcAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getReceiveLibraryAddress(
    _userApplication: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getReceiveVersion(
    _userApplication: string,
    overrides?: CallOverrides
  ): Promise<number>;

  getSendLibraryAddress(
    _userApplication: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getSendVersion(
    _userApplication: string,
    overrides?: CallOverrides
  ): Promise<number>;

  hasStoredPayload(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isReceivingPayload(overrides?: CallOverrides): Promise<boolean>;

  isSendingPayload(overrides?: CallOverrides): Promise<boolean>;

  receivePayload(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _dstAddress: string,
    _nonce: BigNumberish,
    _gasLimit: BigNumberish,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  retryPayload(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  send(
    _dstChainId: BigNumberish,
    _destination: BytesLike,
    _payload: BytesLike,
    _refundAddress: string,
    _zroPaymentAddress: string,
    _adapterParams: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setConfig(
    _version: BigNumberish,
    _chainId: BigNumberish,
    _configType: BigNumberish,
    _config: BytesLike,
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

  callStatic: {
    estimateFees(
      _dstChainId: BigNumberish,
      _userApplication: string,
      _payload: BytesLike,
      _payInZRO: boolean,
      _adapterParam: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    getChainId(overrides?: CallOverrides): Promise<number>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _userApplication: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getInboundNonce(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOutboundNonce(
      _dstChainId: BigNumberish,
      _srcAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReceiveLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getReceiveVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<number>;

    getSendLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getSendVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<number>;

    hasStoredPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isReceivingPayload(overrides?: CallOverrides): Promise<boolean>;

    isSendingPayload(overrides?: CallOverrides): Promise<boolean>;

    receivePayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _dstAddress: string,
      _nonce: BigNumberish,
      _gasLimit: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    retryPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    send(
      _dstChainId: BigNumberish,
      _destination: BytesLike,
      _payload: BytesLike,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    estimateFees(
      _dstChainId: BigNumberish,
      _userApplication: string,
      _payload: BytesLike,
      _payInZRO: boolean,
      _adapterParam: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getChainId(overrides?: CallOverrides): Promise<BigNumber>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _userApplication: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInboundNonce(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOutboundNonce(
      _dstChainId: BigNumberish,
      _srcAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReceiveLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReceiveVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSendLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSendVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasStoredPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isReceivingPayload(overrides?: CallOverrides): Promise<BigNumber>;

    isSendingPayload(overrides?: CallOverrides): Promise<BigNumber>;

    receivePayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _dstAddress: string,
      _nonce: BigNumberish,
      _gasLimit: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    retryPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    send(
      _dstChainId: BigNumberish,
      _destination: BytesLike,
      _payload: BytesLike,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
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
  };

  populateTransaction: {
    estimateFees(
      _dstChainId: BigNumberish,
      _userApplication: string,
      _payload: BytesLike,
      _payInZRO: boolean,
      _adapterParam: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _userApplication: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInboundNonce(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOutboundNonce(
      _dstChainId: BigNumberish,
      _srcAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReceiveLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReceiveVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSendLibraryAddress(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSendVersion(
      _userApplication: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasStoredPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isReceivingPayload(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSendingPayload(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    receivePayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _dstAddress: string,
      _nonce: BigNumberish,
      _gasLimit: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    retryPayload(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    send(
      _dstChainId: BigNumberish,
      _destination: BytesLike,
      _payload: BytesLike,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
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
  };
}
