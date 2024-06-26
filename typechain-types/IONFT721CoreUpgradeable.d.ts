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
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IONFT721CoreUpgradeableInterface extends ethers.utils.Interface {
  functions: {
    "estimateSendBatchFee(uint16,bytes,uint256[],bool,bytes)": FunctionFragment;
    "estimateSendFee(uint16,bytes,uint256,bool,bytes)": FunctionFragment;
    "sendBatchFrom(address,uint16,bytes,uint256[],address,address,bytes)": FunctionFragment;
    "sendFrom(address,uint16,bytes,uint256,address,address,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "estimateSendBatchFee",
    values: [BigNumberish, BytesLike, BigNumberish[], boolean, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateSendFee",
    values: [BigNumberish, BytesLike, BigNumberish, boolean, BytesLike]
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
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "estimateSendBatchFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateSendFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sendBatchFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendFrom", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "CreditCleared(bytes32)": EventFragment;
    "CreditStored(bytes32,bytes)": EventFragment;
    "ReceiveFromChain(uint16,bytes,address,uint256[])": EventFragment;
    "SendToChain(uint16,address,bytes,uint256[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CreditCleared"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreditStored"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReceiveFromChain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SendToChain"): EventFragment;
}

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

export class IONFT721CoreUpgradeable extends BaseContract {
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

  interface: IONFT721CoreUpgradeableInterface;

  functions: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

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

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
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
  };

  estimateGas: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
