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

interface SuAuthenticatedNonUpgradeableInterface
  extends ethers.utils.Interface {
  functions: {
    "ACCESS_CONTROL_SINGLETON()": FunctionFragment;
    "ADMIN_ROLE()": FunctionFragment;
    "ALERTER_ROLE()": FunctionFragment;
    "DAO_ROLE()": FunctionFragment;
    "LIQUIDATION_ACCESS_ROLE()": FunctionFragment;
    "MINT_ACCESS_ROLE()": FunctionFragment;
    "REWARD_ACCESS_ROLE()": FunctionFragment;
    "SYSTEM_ROLE()": FunctionFragment;
    "VAULT_ACCESS_ROLE()": FunctionFragment;
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
  encodeFunctionData(
    functionFragment: "REWARD_ACCESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SYSTEM_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "VAULT_ACCESS_ROLE",
    values?: undefined
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
  decodeFunctionResult(
    functionFragment: "REWARD_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SYSTEM_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "VAULT_ACCESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {};
}

export class SuAuthenticatedNonUpgradeable extends BaseContract {
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

  interface: SuAuthenticatedNonUpgradeableInterface;

  functions: {
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<[string]>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DAO_ROLE(overrides?: CallOverrides): Promise<[string]>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<[string]>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<[string]>;

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

  REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

  SYSTEM_ROLE(overrides?: CallOverrides): Promise<string>;

  VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

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

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<string>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<string>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    ACCESS_CONTROL_SINGLETON(overrides?: CallOverrides): Promise<BigNumber>;

    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    ALERTER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DAO_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    LIQUIDATION_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    MINT_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

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

    REWARD_ACCESS_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
