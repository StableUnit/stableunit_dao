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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ISuChainlinkOracleInterface extends ethers.utils.Interface {
  functions: {
    "assetToFeed(address)": FunctionFragment;
    "assetToFeedDecimals(address)": FunctionFragment;
    "getFiatPrice1e18(address)": FunctionFragment;
    "setAssetFeed(address,address,uint8)": FunctionFragment;
    "setPriceBase(address,bool)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "assetToFeed", values: [string]): string;
  encodeFunctionData(
    functionFragment: "assetToFeedDecimals",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getFiatPrice1e18",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setAssetFeed",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPriceBase",
    values: [string, boolean]
  ): string;

  decodeFunctionResult(
    functionFragment: "assetToFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "assetToFeedDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFiatPrice1e18",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAssetFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPriceBase",
    data: BytesLike
  ): Result;

  events: {};
}

export class ISuChainlinkOracle extends BaseContract {
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

  interface: ISuChainlinkOracleInterface;

  functions: {
    assetToFeed(asset: string, overrides?: CallOverrides): Promise<[string]>;

    assetToFeedDecimals(
      asset: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setAssetFeed(
      asset: string,
      chainlinkDataFeed: string,
      chainlinkDataFeedDecimals: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPriceBase(
      asset: string,
      _isPriceInETH: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  assetToFeed(asset: string, overrides?: CallOverrides): Promise<string>;

  assetToFeedDecimals(
    asset: string,
    overrides?: CallOverrides
  ): Promise<number>;

  getFiatPrice1e18(
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setAssetFeed(
    asset: string,
    chainlinkDataFeed: string,
    chainlinkDataFeedDecimals: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPriceBase(
    asset: string,
    _isPriceInETH: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    assetToFeed(asset: string, overrides?: CallOverrides): Promise<string>;

    assetToFeedDecimals(
      asset: string,
      overrides?: CallOverrides
    ): Promise<number>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAssetFeed(
      asset: string,
      chainlinkDataFeed: string,
      chainlinkDataFeedDecimals: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPriceBase(
      asset: string,
      _isPriceInETH: boolean,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    assetToFeed(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    assetToFeedDecimals(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAssetFeed(
      asset: string,
      chainlinkDataFeed: string,
      chainlinkDataFeedDecimals: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPriceBase(
      asset: string,
      _isPriceInETH: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    assetToFeed(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    assetToFeedDecimals(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setAssetFeed(
      asset: string,
      chainlinkDataFeed: string,
      chainlinkDataFeedDecimals: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPriceBase(
      asset: string,
      _isPriceInETH: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}