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

interface IveERC20v2Interface extends ethers.utils.Interface {
  functions: {
    "alreadyWithdrawn(address)": FunctionFragment;
    "availableToClaim(address)": FunctionFragment;
    "burn(uint256)": FunctionFragment;
    "claim()": FunctionFragment;
    "lockUnderVesting(address,uint256)": FunctionFragment;
    "rescue(address)": FunctionFragment;
    "totalClaimed(address)": FunctionFragment;
    "totalDeposited(address)": FunctionFragment;
    "updateTimestamps(uint32,uint32,uint32,uint64,uint32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "alreadyWithdrawn",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "availableToClaim",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "burn", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "claim", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "lockUnderVesting",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "rescue", values: [string]): string;
  encodeFunctionData(
    functionFragment: "totalClaimed",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalDeposited",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTimestamps",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "alreadyWithdrawn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "availableToClaim",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lockUnderVesting",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rescue", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalClaimed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalDeposited",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTimestamps",
    data: BytesLike
  ): Result;

  events: {
    "Claimed(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Claimed"): EventFragment;
}

export type ClaimedEvent = TypedEvent<
  [string, BigNumber] & { account: string; claimAmount: BigNumber }
>;

export class IveERC20v2 extends BaseContract {
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

  interface: IveERC20v2Interface;

  functions: {
    alreadyWithdrawn(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amountAlreadyWithdrawn: BigNumber }>;

    availableToClaim(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    lockUnderVesting(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rescue(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalClaimed(user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalDeposited(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    updateTimestamps(
      newTgeTimestamp: BigNumberish,
      newCliffSeconds: BigNumberish,
      newVestingSeconds: BigNumberish,
      newTgeUnlockRatio: BigNumberish,
      newVestingFrequencySeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  alreadyWithdrawn(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  availableToClaim(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  burn(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claim(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  lockUnderVesting(
    account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rescue(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalClaimed(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  totalDeposited(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  updateTimestamps(
    newTgeTimestamp: BigNumberish,
    newCliffSeconds: BigNumberish,
    newVestingSeconds: BigNumberish,
    newTgeUnlockRatio: BigNumberish,
    newVestingFrequencySeconds: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    alreadyWithdrawn(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    availableToClaim(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claim(overrides?: CallOverrides): Promise<void>;

    lockUnderVesting(
      account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    rescue(token: string, overrides?: CallOverrides): Promise<void>;

    totalClaimed(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalDeposited(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    updateTimestamps(
      newTgeTimestamp: BigNumberish,
      newCliffSeconds: BigNumberish,
      newVestingSeconds: BigNumberish,
      newTgeUnlockRatio: BigNumberish,
      newVestingFrequencySeconds: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Claimed(address,uint256)"(
      account?: null,
      claimAmount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { account: string; claimAmount: BigNumber }
    >;

    Claimed(
      account?: null,
      claimAmount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { account: string; claimAmount: BigNumber }
    >;
  };

  estimateGas: {
    alreadyWithdrawn(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    availableToClaim(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    lockUnderVesting(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rescue(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalClaimed(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalDeposited(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    updateTimestamps(
      newTgeTimestamp: BigNumberish,
      newCliffSeconds: BigNumberish,
      newVestingSeconds: BigNumberish,
      newTgeUnlockRatio: BigNumberish,
      newVestingFrequencySeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    alreadyWithdrawn(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    availableToClaim(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    lockUnderVesting(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rescue(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalClaimed(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalDeposited(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    updateTimestamps(
      newTgeTimestamp: BigNumberish,
      newCliffSeconds: BigNumberish,
      newVestingSeconds: BigNumberish,
      newTgeUnlockRatio: BigNumberish,
      newVestingFrequencySeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
