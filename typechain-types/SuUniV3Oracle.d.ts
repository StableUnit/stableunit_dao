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

interface SuUniV3OracleInterface extends ethers.utils.Interface {
  functions: {
    "ACCESS_CONTROL_SINGLETON()": FunctionFragment;
    "ADMIN_ROLE()": FunctionFragment;
    "ALERTER_ROLE()": FunctionFragment;
    "DAO_ROLE()": FunctionFragment;
    "LIQUIDATION_ACCESS_ROLE()": FunctionFragment;
    "MINT_ACCESS_ROLE()": FunctionFragment;
    "ORACLE()": FunctionFragment;
    "REWARD_ACCESS_ROLE()": FunctionFragment;
    "SYSTEM_ROLE()": FunctionFragment;
    "UNISWAP_FACTORY()": FunctionFragment;
    "USDT()": FunctionFragment;
    "VAULT_ACCESS_ROLE()": FunctionFragment;
    "assetToPool(address)": FunctionFragment;
    "enableAssetPool(address,uint24)": FunctionFragment;
    "getFiatPrice1e18(address)": FunctionFragment;
    "initialize(address,address,address,address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ACCESS_CONTROL_SINGLETON",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ALERTER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "DAO_ROLE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "LIQUIDATION_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MINT_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "ORACLE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "REWARD_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SYSTEM_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "UNISWAP_FACTORY",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "USDT", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "VAULT_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "assetToPool", values: [string]): string;
  encodeFunctionData(
    functionFragment: "enableAssetPool",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getFiatPrice1e18",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "ACCESS_CONTROL_SINGLETON",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ALERTER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "DAO_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "LIQUIDATION_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MINT_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ORACLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "REWARD_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SYSTEM_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "UNISWAP_FACTORY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "USDT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "VAULT_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "assetToPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enableAssetPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFiatPrice1e18",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export type InitializedEvent = TypedEvent<[number] & { version: number }>;

export class SuUniV3Oracle extends BaseContract {
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

  interface: SuUniV3OracleInterface;

  functions: {
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<[string]>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DAO_ROLE(overrides?: CallOverrides): Promise<[string]>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    ORACLE(overrides?: CallOverrides): Promise<[string]>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<[string]>;

    UNISWAP_FACTORY(overrides?: CallOverrides): Promise<[string]>;

    USDT(overrides?: CallOverrides): Promise<[string]>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    assetToPool(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    enableAssetPool(
      _asset: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initialize(
      _authControl: string,
      _UNISWAP_FACTORY: string,
      _USDT: string,
      _ORACLE: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<string>;

  ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  ALERTER_ROLE(overrides?: CallOverrides): Promise<string>;

  DAO_ROLE(overrides?: CallOverrides): Promise<string>;

  LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  ORACLE(overrides?: CallOverrides): Promise<string>;

  REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  SYSTEM_ROLE(overrides?: CallOverrides): Promise<string>;

  UNISWAP_FACTORY(overrides?: CallOverrides): Promise<string>;

  USDT(overrides?: CallOverrides): Promise<string>;

  VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  assetToPool(arg0: string, overrides?: CallOverrides): Promise<string>;

  enableAssetPool(
    _asset: string,
    _fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getFiatPrice1e18(
    asset: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(
    _authControl: string,
    _UNISWAP_FACTORY: string,
    _USDT: string,
    _ORACLE: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<string>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<string>;

    DAO_ROLE(overrides?: CallOverrides): Promise<string>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    ORACLE(overrides?: CallOverrides): Promise<string>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<string>;

    UNISWAP_FACTORY(overrides?: CallOverrides): Promise<string>;

    USDT(overrides?: CallOverrides): Promise<string>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    assetToPool(arg0: string, overrides?: CallOverrides): Promise<string>;

    enableAssetPool(
      _asset: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _authControl: string,
      _UNISWAP_FACTORY: string,
      _USDT: string,
      _ORACLE: string,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "Initialized(uint8)"(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;

    Initialized(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;
  };

  estimateGas: {
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<BigNumber>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DAO_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    ORACLE(overrides?: CallOverrides): Promise<BigNumber>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    UNISWAP_FACTORY(overrides?: CallOverrides): Promise<BigNumber>;

    USDT(overrides?: CallOverrides): Promise<BigNumber>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    assetToPool(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    enableAssetPool(
      _asset: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _authControl: string,
      _UNISWAP_FACTORY: string,
      _USDT: string,
      _ORACLE: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ACCESS_CONTROL_SINGLETON(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DAO_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    LIQUIDATION_ACCESS_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ORACLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    REWARD_ACCESS_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    UNISWAP_FACTORY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    USDT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    assetToPool(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    enableAssetPool(
      _asset: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getFiatPrice1e18(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _authControl: string,
      _UNISWAP_FACTORY: string,
      _USDT: string,
      _ORACLE: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}