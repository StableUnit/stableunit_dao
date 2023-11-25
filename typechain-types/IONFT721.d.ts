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

interface IONFT721Interface extends ethers.utils.Interface {
  functions: {
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "estimateSendBatchFee(uint16,bytes,uint256[],bool,bytes)": FunctionFragment;
    "estimateSendFee(uint16,bytes,uint256,bool,bytes)": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "sendBatchFrom(address,uint16,bytes,uint256[],address,address,bytes)": FunctionFragment;
    "sendFrom(address,uint16,bytes,uint256,address,address,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "estimateSendBatchFee",
    values: [BigNumberish, BytesLike, BigNumberish[], boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateSendFee",
    values: [BigNumberish, BytesLike, BigNumberish, boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sendBatchFrom",
    values: [
      string,
      BigNumberish,
      BytesLike,
      BigNumberish[],
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
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "estimateSendBatchFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateSendFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sendBatchFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendFrom", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "CreditCleared(bytes32)": EventFragment;
    "CreditStored(bytes32,bytes)": EventFragment;
    "ReceiveFromChain(uint16,bytes,address,uint256[])": EventFragment;
    "SendToChain(uint16,address,bytes,uint256[])": EventFragment;
    "SetDstChainIdToBatchLimit(uint16,uint256)": EventFragment;
    "SetDstChainIdToTransferGas(uint16,uint256)": EventFragment;
    "SetMinGasToTransferAndStore(uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreditCleared"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreditStored"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReceiveFromChain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SendToChain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDstChainIdToBatchLimit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDstChainIdToTransferGas"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "SetMinGasToTransferAndStore"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber] & {
    owner: string;
    approved: string;
    tokenId: BigNumber;
  }
>;

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean] & {
    owner: string;
    operator: string;
    approved: boolean;
  }
>;

export type CreditClearedEvent = TypedEvent<
  [string] & { _hashedPayload: string }
>;

export type CreditStoredEvent = TypedEvent<
  [string, string] & { _hashedPayload: string; _payload: string }
>;

export type ReceiveFromChainEvent = TypedEvent<
  [number, string, string, BigNumber[]] & {
    _srcChainId: number;
    _srcAddress: string;
    _toAddress: string;
    _tokenIds: BigNumber[];
  }
>;

export type SendToChainEvent = TypedEvent<
  [number, string, string, BigNumber[]] & {
    _dstChainId: number;
    _from: string;
    _toAddress: string;
    _tokenIds: BigNumber[];
  }
>;

export type SetDstChainIdToBatchLimitEvent = TypedEvent<
  [number, BigNumber] & {
    _dstChainId: number;
    _dstChainIdToBatchLimit: BigNumber;
  }
>;

export type SetDstChainIdToTransferGasEvent = TypedEvent<
  [number, BigNumber] & {
    _dstChainId: number;
    _dstChainIdToTransferGas: BigNumber;
  }
>;

export type SetMinGasToTransferAndStoreEvent = TypedEvent<
  [BigNumber] & { _minGasToTransferAndStore: BigNumber }
>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber] & { from: string; to: string; tokenId: BigNumber }
>;

export class IONFT721 extends BaseContract {
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

  interface: IONFT721Interface;

  functions: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { balance: BigNumber }>;

    estimateSendBatchFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { operator: string }>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { owner: string }>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sendBatchFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  estimateSendBatchFee(
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _tokenIds: BigNumberish[],
    _useZro: boolean,
    _adapterParams: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
  >;

  estimateSendFee(
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _tokenId: BigNumberish,
    _useZro: boolean,
    _adapterParams: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
  >;

  getApproved(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sendBatchFrom(
    _from: string,
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _tokenIds: BigNumberish[],
    _refundAddress: string,
    _zroPaymentAddress: string,
    _adapterParams: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sendFrom(
    _from: string,
    _dstChainId: BigNumberish,
    _toAddress: BytesLike,
    _tokenId: BigNumberish,
    _refundAddress: string,
    _zroPaymentAddress: string,
    _adapterParams: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    estimateSendBatchFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { nativeFee: BigNumber; zroFee: BigNumber }
    >;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    sendBatchFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; approved: string; tokenId: BigNumber }
    >;

    Approval(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; approved: string; tokenId: BigNumber }
    >;

    "ApprovalForAll(address,address,bool)"(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { owner: string; operator: string; approved: boolean }
    >;

    ApprovalForAll(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { owner: string; operator: string; approved: boolean }
    >;

    "CreditCleared(bytes32)"(
      _hashedPayload?: null
    ): TypedEventFilter<[string], { _hashedPayload: string }>;

    CreditCleared(
      _hashedPayload?: null
    ): TypedEventFilter<[string], { _hashedPayload: string }>;

    "CreditStored(bytes32,bytes)"(
      _hashedPayload?: null,
      _payload?: null
    ): TypedEventFilter<
      [string, string],
      { _hashedPayload: string; _payload: string }
    >;

    CreditStored(
      _hashedPayload?: null,
      _payload?: null
    ): TypedEventFilter<
      [string, string],
      { _hashedPayload: string; _payload: string }
    >;

    "ReceiveFromChain(uint16,bytes,address,uint256[])"(
      _srcChainId?: BigNumberish | null,
      _srcAddress?: BytesLike | null,
      _toAddress?: string | null,
      _tokenIds?: null
    ): TypedEventFilter<
      [number, string, string, BigNumber[]],
      {
        _srcChainId: number;
        _srcAddress: string;
        _toAddress: string;
        _tokenIds: BigNumber[];
      }
    >;

    ReceiveFromChain(
      _srcChainId?: BigNumberish | null,
      _srcAddress?: BytesLike | null,
      _toAddress?: string | null,
      _tokenIds?: null
    ): TypedEventFilter<
      [number, string, string, BigNumber[]],
      {
        _srcChainId: number;
        _srcAddress: string;
        _toAddress: string;
        _tokenIds: BigNumber[];
      }
    >;

    "SendToChain(uint16,address,bytes,uint256[])"(
      _dstChainId?: BigNumberish | null,
      _from?: string | null,
      _toAddress?: BytesLike | null,
      _tokenIds?: null
    ): TypedEventFilter<
      [number, string, string, BigNumber[]],
      {
        _dstChainId: number;
        _from: string;
        _toAddress: string;
        _tokenIds: BigNumber[];
      }
    >;

    SendToChain(
      _dstChainId?: BigNumberish | null,
      _from?: string | null,
      _toAddress?: BytesLike | null,
      _tokenIds?: null
    ): TypedEventFilter<
      [number, string, string, BigNumber[]],
      {
        _dstChainId: number;
        _from: string;
        _toAddress: string;
        _tokenIds: BigNumber[];
      }
    >;

    "SetDstChainIdToBatchLimit(uint16,uint256)"(
      _dstChainId?: null,
      _dstChainIdToBatchLimit?: null
    ): TypedEventFilter<
      [number, BigNumber],
      { _dstChainId: number; _dstChainIdToBatchLimit: BigNumber }
    >;

    SetDstChainIdToBatchLimit(
      _dstChainId?: null,
      _dstChainIdToBatchLimit?: null
    ): TypedEventFilter<
      [number, BigNumber],
      { _dstChainId: number; _dstChainIdToBatchLimit: BigNumber }
    >;

    "SetDstChainIdToTransferGas(uint16,uint256)"(
      _dstChainId?: null,
      _dstChainIdToTransferGas?: null
    ): TypedEventFilter<
      [number, BigNumber],
      { _dstChainId: number; _dstChainIdToTransferGas: BigNumber }
    >;

    SetDstChainIdToTransferGas(
      _dstChainId?: null,
      _dstChainIdToTransferGas?: null
    ): TypedEventFilter<
      [number, BigNumber],
      { _dstChainId: number; _dstChainIdToTransferGas: BigNumber }
    >;

    "SetMinGasToTransferAndStore(uint256)"(
      _minGasToTransferAndStore?: null
    ): TypedEventFilter<[BigNumber], { _minGasToTransferAndStore: BigNumber }>;

    SetMinGasToTransferAndStore(
      _minGasToTransferAndStore?: null
    ): TypedEventFilter<[BigNumber], { _minGasToTransferAndStore: BigNumber }>;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; tokenId: BigNumber }
    >;

    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; tokenId: BigNumber }
    >;
  };

  estimateGas: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    estimateSendBatchFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sendBatchFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    estimateSendBatchFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    estimateSendFee(
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _useZro: boolean,
      _adapterParams: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sendBatchFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenIds: BigNumberish[],
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sendFrom(
      _from: string,
      _dstChainId: BigNumberish,
      _toAddress: BytesLike,
      _tokenId: BigNumberish,
      _refundAddress: string,
      _zroPaymentAddress: string,
      _adapterParams: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}