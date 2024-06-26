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

interface IComposableOFTInterface extends ethers.utils.Interface {
  functions: {
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "circulatingSupply()": FunctionFragment;
    "estimateSendAndCallFee(uint16,bytes,uint256,bytes,uint64,bool,bytes)": FunctionFragment;
    "estimateSendFee(uint16,bytes,uint256,bool,bytes)": FunctionFragment;
    "retryOFTReceived(uint16,bytes,uint64,bytes,address,uint256,bytes)": FunctionFragment;
    "sendAndCall(address,uint16,bytes,uint256,bytes,uint64,address,address,bytes)": FunctionFragment;
    "sendFrom(address,uint16,bytes,uint256,address,address,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "token()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "circulatingSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "estimateSendAndCallFee",
    values: [
      BigNumberish,
      BytesLike,
      BigNumberish,
      BytesLike,
      BigNumberish,
      boolean,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateSendFee",
    values: [BigNumberish, BytesLike, BigNumberish, boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "retryOFTReceived",
    values: [
      BigNumberish,
      BytesLike,
      BigNumberish,
      BytesLike,
      string,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "sendAndCall",
    values: [
      string,
      BigNumberish,
      BytesLike,
      BigNumberish,
      BytesLike,
      BigNumberish,
      string,
      string,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "sendFrom",
    values: [
      string,
      BigNumberish,
      BytesLike,
      BigNumberish,
      string,
      string,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
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

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "circulatingSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateSendAndCallFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateSendFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retryOFTReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sendAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendFrom", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "CallOFTReceivedFailure(uint16,bytes,uint64,bytes,address,uint256,bytes,bytes)": EventFragment;
    "CallOFTReceivedSuccess(uint16,bytes,uint64,bytes32)": EventFragment;
    "NonContractAddress(address)": EventFragment;
    "ReceiveFromChain(uint16,address,uint256)": EventFragment;
    "RetryOFTReceivedSuccess(bytes32)": EventFragment;
    "SendToChain(uint16,address,bytes,uint256)": EventFragment;
    "SetUseCustomAdapterParams(bool)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CallOFTReceivedFailure"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CallOFTReceivedSuccess"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NonContractAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReceiveFromChain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RetryOFTReceivedSuccess"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SendToChain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetUseCustomAdapterParams"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber] & {
    owner: string;
    spender: string;
    value: BigNumber;
  }
>;

export type CallOFTReceivedFailureEvent = TypedEvent<
  [number, string, BigNumber, string, string, BigNumber, string, string] & {
    _srcChainId: number;
    _srcAddress: string;
    _nonce: BigNumber;
    _from: string;
    _to: string;
    _amount: BigNumber;
    _payload: string;
    _reason: string;
  }
>;

export type CallOFTReceivedSuccessEvent = TypedEvent<
  [number, string, BigNumber, string] & {
    _srcChainId: number;
    _srcAddress: string;
    _nonce: BigNumber;
    _hash: string;
  }
>;

export type NonContractAddressEvent = TypedEvent<
  [string] & { _address: string }
>;

export type ReceiveFromChainEvent = TypedEvent<
  [number, string, BigNumber] & {
    _srcChainId: number;
    _to: string;
    _amount: BigNumber;
  }
>;

export type RetryOFTReceivedSuccessEvent = TypedEvent<
  [string] & { _messageHash: string }
>;

export type SendToChainEvent = TypedEvent<
  [number, string, string, BigNumber] & {
    _dstChainId: number;
    _from: string;
    _toAddress: string;
    _amount: BigNumber;
  }
>;

export type SetUseCustomAdapterParamsEvent = TypedEvent<
  [boolean] & { _useCustomAdapterParams: boolean }
>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; value: BigNumber }
>;

export class IComposableOFT extends BaseContract {
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

  interface: IComposableOFTInterface;

  functions: {
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

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    circulatingSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    estimateSendAndCallFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    retryOFTReceived(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _from: BytesLike,
      _to: string,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sendAndCall(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    token(overrides?: CallOverrides): Promise<[string]>;

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
  };

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

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  circulatingSupply(overrides?: CallOverrides): Promise<BigNumber>;

  estimateSendAndCallFee(
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _amount: BigNumberish,
    _payload: BytesLike,
    _dstGasForCall: BigNumberish,
    _useZro: boolean,
    _adapterParams: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
  >;

  estimateSendFee(
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _amount: BigNumberish,
    _useZro: boolean,
    _adapterParams: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
  >;

  retryOFTReceived(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _nonce: BigNumberish,
    _from: BytesLike,
    _to: string,
    _amount: BigNumberish,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sendAndCall(
    _from: string,
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _amount: BigNumberish,
    _payload: BytesLike,
    _dstGasForCall: BigNumberish,
    _refundAddress: string,
    _zroPaymentAddress: string,
    _adapterParams: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sendFrom(
    _from: string,
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _amount: BigNumberish,
    _refundAddress: string,
    _zroPaymentAddress: string,
    _adapterParams: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  token(overrides?: CallOverrides): Promise<string>;

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

  callStatic: {
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

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    circulatingSupply(overrides?: CallOverrides): Promise<BigNumber>;

    estimateSendAndCallFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    retryOFTReceived(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _from: BytesLike,
      _to: string,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    sendAndCall(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    token(overrides?: CallOverrides): Promise<string>;

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

    "CallOFTReceivedFailure(uint16,bytes,uint64,bytes,address,uint256,bytes,bytes)"(
      _srcChainId?: BigNumberish | null,
      _srcAddress?: null,
      _nonce?: null,
      _from?: null,
      _to?: string | null,
      _amount?: null,
      _payload?: null,
      _reason?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string, string, BigNumber, string, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _from: string;
        _to: string;
        _amount: BigNumber;
        _payload: string;
        _reason: string;
      }
    >;

    CallOFTReceivedFailure(
      _srcChainId?: BigNumberish | null,
      _srcAddress?: null,
      _nonce?: null,
      _from?: null,
      _to?: string | null,
      _amount?: null,
      _payload?: null,
      _reason?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string, string, BigNumber, string, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _from: string;
        _to: string;
        _amount: BigNumber;
        _payload: string;
        _reason: string;
      }
    >;

    "CallOFTReceivedSuccess(uint16,bytes,uint64,bytes32)"(
      _srcChainId?: BigNumberish | null,
      _srcAddress?: null,
      _nonce?: null,
      _hash?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _hash: string;
      }
    >;

    CallOFTReceivedSuccess(
      _srcChainId?: BigNumberish | null,
      _srcAddress?: null,
      _nonce?: null,
      _hash?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _hash: string;
      }
    >;

    "NonContractAddress(address)"(
      _address?: null
    ): TypedEventFilter<[string], { _address: string }>;

    NonContractAddress(
      _address?: null
    ): TypedEventFilter<[string], { _address: string }>;

    "ReceiveFromChain(uint16,address,uint256)"(
      _srcChainId?: BigNumberish | null,
      _to?: string | null,
      _amount?: null
    ): TypedEventFilter<
      [number, string, BigNumber],
      { _srcChainId: number; _to: string; _amount: BigNumber }
    >;

    ReceiveFromChain(
      _srcChainId?: BigNumberish | null,
      _to?: string | null,
      _amount?: null
    ): TypedEventFilter<
      [number, string, BigNumber],
      { _srcChainId: number; _to: string; _amount: BigNumber }
    >;

    "RetryOFTReceivedSuccess(bytes32)"(
      _messageHash?: null
    ): TypedEventFilter<[string], { _messageHash: string }>;

    RetryOFTReceivedSuccess(
      _messageHash?: null
    ): TypedEventFilter<[string], { _messageHash: string }>;

    "SendToChain(uint16,address,bytes,uint256)"(
      _dstChainId?: BigNumberish | null,
      _from?: string | null,
      _toAddress?: null,
      _amount?: null
    ): TypedEventFilter<
      [number, string, string, BigNumber],
      {
        _dstChainId: number;
        _from: string;
        _toAddress: string;
        _amount: BigNumber;
      }
    >;

    SendToChain(
      _dstChainId?: BigNumberish | null,
      _from?: string | null,
      _toAddress?: null,
      _amount?: null
    ): TypedEventFilter<
      [number, string, string, BigNumber],
      {
        _dstChainId: number;
        _from: string;
        _toAddress: string;
        _amount: BigNumber;
      }
    >;

    "SetUseCustomAdapterParams(bool)"(
      _useCustomAdapterParams?: null
    ): TypedEventFilter<[boolean], { _useCustomAdapterParams: boolean }>;

    SetUseCustomAdapterParams(
      _useCustomAdapterParams?: null
    ): TypedEventFilter<[boolean], { _useCustomAdapterParams: boolean }>;

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

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    circulatingSupply(overrides?: CallOverrides): Promise<BigNumber>;

    estimateSendAndCallFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    retryOFTReceived(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _from: BytesLike,
      _to: string,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sendAndCall(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

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
  };

  populateTransaction: {
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

    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    circulatingSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    estimateSendAndCallFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    retryOFTReceived(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _from: BytesLike,
      _to: string,
      _amount: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sendAndCall(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _payload: BytesLike,
      _dstGasForCall: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _amount: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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
  };
}
