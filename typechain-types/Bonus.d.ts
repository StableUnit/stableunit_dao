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

interface BonusInterface extends ethers.utils.Interface {
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
    "adminInfo(address)": FunctionFragment;
    "communityAdminInfo(address)": FunctionFragment;
    "distributeXp(address,uint256)": FunctionFragment;
    "getAllocation(address)": FunctionFragment;
    "getBonus(address)": FunctionFragment;
    "getLevel(address)": FunctionFragment;
    "getLevelByXP(uint256)": FunctionFragment;
    "getNftAllocation(address)": FunctionFragment;
    "getNftBonus(address)": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "isTokenTransferable(address,uint256)": FunctionFragment;
    "levelMap(uint16)": FunctionFragment;
    "nftInfo(address)": FunctionFragment;
    "setAdmin(address,bool)": FunctionFragment;
    "setCommunityAdmin(address,uint256,uint16)": FunctionFragment;
    "setNftInfo(address,uint256,uint256)": FunctionFragment;
    "setUserInfo(address,uint256,uint256)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "userInfo(address)": FunctionFragment;
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
  encodeFunctionData(functionFragment: "adminInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "communityAdminInfo",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "distributeXp",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllocation",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getBonus", values: [string]): string;
  encodeFunctionData(functionFragment: "getLevel", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getLevelByXP",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getNftAllocation",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getNftBonus", values: [string]): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isTokenTransferable",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "levelMap",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "nftInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setAdmin",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setCommunityAdmin",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setNftInfo",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setUserInfo",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "userInfo", values: [string]): string;

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
  decodeFunctionResult(functionFragment: "adminInfo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "communityAdminInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributeXp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllocation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getBonus", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getLevel", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getLevelByXP",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNftAllocation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNftBonus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTokenTransferable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "levelMap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nftInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCommunityAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setNftInfo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setUserInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "userInfo", data: BytesLike): Result;

  events: {
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export type InitializedEvent = TypedEvent<[number] & { version: number }>;

export class Bonus extends BaseContract {
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

  interface: BonusInterface;

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

    adminInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isAdmin: boolean }>;

    communityAdminInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number] & { xpLimit: BigNumber; levelLimit: number }
    >;

    distributeXp(
      user: string,
      xp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAllocation(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getBonus(user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    getLevel(user: string, overrides?: CallOverrides): Promise<[number]>;

    getLevelByXP(
      xp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getNftAllocation(
      nft: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getNftBonus(nft: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      _accessControlSingleton: string,
      defaultAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isTokenTransferable(
      nft: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    levelMap(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    nftInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        allocation: BigNumber;
        donationBonusRatio: BigNumber;
      }
    >;

    setAdmin(
      admin: string,
      isAdmin: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setCommunityAdmin(
      communityAdmin: string,
      xpLimit: BigNumberish,
      levelLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setNftInfo(
      nft: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setUserInfo(
      user: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        xp: BigNumber;
        allocation: BigNumber;
        donationBonusRatio: BigNumber;
      }
    >;
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

  adminInfo(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  communityAdminInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, number] & { xpLimit: BigNumber; levelLimit: number }>;

  distributeXp(
    user: string,
    xp: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAllocation(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  getBonus(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  getLevel(user: string, overrides?: CallOverrides): Promise<number>;

  getLevelByXP(xp: BigNumberish, overrides?: CallOverrides): Promise<number>;

  getNftAllocation(nft: string, overrides?: CallOverrides): Promise<BigNumber>;

  getNftBonus(nft: string, overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    _accessControlSingleton: string,
    defaultAdmin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isTokenTransferable(
    nft: string,
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  levelMap(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  nftInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      allocation: BigNumber;
      donationBonusRatio: BigNumber;
    }
  >;

  setAdmin(
    admin: string,
    isAdmin: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setCommunityAdmin(
    communityAdmin: string,
    xpLimit: BigNumberish,
    levelLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setNftInfo(
    nft: string,
    allocation: BigNumberish,
    donationBonusRatio: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setUserInfo(
    user: string,
    allocation: BigNumberish,
    donationBonusRatio: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  userInfo(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      xp: BigNumber;
      allocation: BigNumber;
      donationBonusRatio: BigNumber;
    }
  >;

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

    adminInfo(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    communityAdminInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number] & { xpLimit: BigNumber; levelLimit: number }
    >;

    distributeXp(
      user: string,
      xp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getAllocation(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getBonus(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getLevel(user: string, overrides?: CallOverrides): Promise<number>;

    getLevelByXP(xp: BigNumberish, overrides?: CallOverrides): Promise<number>;

    getNftAllocation(
      nft: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNftBonus(nft: string, overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _accessControlSingleton: string,
      defaultAdmin: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isTokenTransferable(
      nft: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    levelMap(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    nftInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        allocation: BigNumber;
        donationBonusRatio: BigNumber;
      }
    >;

    setAdmin(
      admin: string,
      isAdmin: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setCommunityAdmin(
      communityAdmin: string,
      xpLimit: BigNumberish,
      levelLimit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setNftInfo(
      nft: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setUserInfo(
      user: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        xp: BigNumber;
        allocation: BigNumber;
        donationBonusRatio: BigNumber;
      }
    >;
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

    REWARD_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    SYSTEM_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    VAULT_ACCESS_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    adminInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    communityAdminInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    distributeXp(
      user: string,
      xp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAllocation(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getBonus(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getLevel(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getLevelByXP(
      xp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNftAllocation(
      nft: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNftBonus(nft: string, overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _accessControlSingleton: string,
      defaultAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isTokenTransferable(
      nft: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    levelMap(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    nftInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setAdmin(
      admin: string,
      isAdmin: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setCommunityAdmin(
      communityAdmin: string,
      xpLimit: BigNumberish,
      levelLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setNftInfo(
      nft: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setUserInfo(
      user: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    userInfo(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
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

    adminInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    communityAdminInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    distributeXp(
      user: string,
      xp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAllocation(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBonus(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLevel(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLevelByXP(
      xp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNftAllocation(
      nft: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNftBonus(
      nft: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _accessControlSingleton: string,
      defaultAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isTokenTransferable(
      nft: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    levelMap(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nftInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setAdmin(
      admin: string,
      isAdmin: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setCommunityAdmin(
      communityAdmin: string,
      xpLimit: BigNumberish,
      levelLimit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setNftInfo(
      nft: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setUserInfo(
      user: string,
      allocation: BigNumberish,
      donationBonusRatio: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    userInfo(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
