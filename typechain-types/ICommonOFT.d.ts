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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ICommonOFTInterface extends ethers.utils.Interface {
  functions: {
    "circulatingSupply()": FunctionFragment;
    "estimateSendAndCallFee(uint16,bytes32,uint256,bytes,uint64,bool,bytes)": FunctionFragment;
    "estimateSendFee(uint16,bytes32,uint256,bool,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "token()": FunctionFragment;
  };

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
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;

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
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;

  events: {};
}

export class ICommonOFT extends BaseContract {
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

  interface: ICommonOFTInterface;

  functions: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    token(overrides?: CallOverrides): Promise<[string]>;
  };

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

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  token(overrides?: CallOverrides): Promise<string>;

  callStatic: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    token(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
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

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
