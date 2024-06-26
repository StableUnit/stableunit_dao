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

interface SimpleFlashLoanOracleCrvTestInterface extends ethers.utils.Interface {
  functions: {
    "ORACLE()": FunctionFragment;
    "checkLPOnFlashLoanAttack(address,address,address,uint256,address)": FunctionFragment;
    "executeOperation(address,uint256,uint256,address,bytes)": FunctionFragment;
    "getPriceAfterFlashLoan()": FunctionFragment;
    "getUnsafePriceAfterFlashLoan()": FunctionFragment;
    "priceAfterFlashLoan()": FunctionFragment;
    "priceUnsafeAfterFlashLoan()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "ORACLE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "checkLPOnFlashLoanAttack",
    values: [string, string, string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "executeOperation",
    values: [string, BigNumberish, BigNumberish, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceAfterFlashLoan",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUnsafePriceAfterFlashLoan",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "priceAfterFlashLoan",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "priceUnsafeAfterFlashLoan",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "ORACLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "checkLPOnFlashLoanAttack",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeOperation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceAfterFlashLoan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUnsafePriceAfterFlashLoan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceAfterFlashLoan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceUnsafeAfterFlashLoan",
    data: BytesLike
  ): Result;

  events: {};
}

export class SimpleFlashLoanOracleCrvTest extends BaseContract {
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

  interface: SimpleFlashLoanOracleCrvTestInterface;

  functions: {
    ORACLE(overrides?: CallOverrides): Promise<[string]>;

    checkLPOnFlashLoanAttack(
      lpToken: string,
      lpPool: string,
      assetToLoan: string,
      amountToLoan: BigNumberish,
      adapter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    executeOperation(
      asset: string,
      amount: BigNumberish,
      fee: BigNumberish,
      sender: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getPriceAfterFlashLoan(overrides?: CallOverrides): Promise<[BigNumber]>;

    getUnsafePriceAfterFlashLoan(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    priceAfterFlashLoan(overrides?: CallOverrides): Promise<[BigNumber]>;

    priceUnsafeAfterFlashLoan(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  ORACLE(overrides?: CallOverrides): Promise<string>;

  checkLPOnFlashLoanAttack(
    lpToken: string,
    lpPool: string,
    assetToLoan: string,
    amountToLoan: BigNumberish,
    adapter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  executeOperation(
    asset: string,
    amount: BigNumberish,
    fee: BigNumberish,
    sender: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getPriceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

  getUnsafePriceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

  priceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

  priceUnsafeAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    ORACLE(overrides?: CallOverrides): Promise<string>;

    checkLPOnFlashLoanAttack(
      lpToken: string,
      lpPool: string,
      assetToLoan: string,
      amountToLoan: BigNumberish,
      adapter: string,
      overrides?: CallOverrides
    ): Promise<void>;

    executeOperation(
      asset: string,
      amount: BigNumberish,
      fee: BigNumberish,
      sender: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getPriceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

    getUnsafePriceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

    priceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

    priceUnsafeAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    ORACLE(overrides?: CallOverrides): Promise<BigNumber>;

    checkLPOnFlashLoanAttack(
      lpToken: string,
      lpPool: string,
      assetToLoan: string,
      amountToLoan: BigNumberish,
      adapter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    executeOperation(
      asset: string,
      amount: BigNumberish,
      fee: BigNumberish,
      sender: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getPriceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

    getUnsafePriceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

    priceAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;

    priceUnsafeAfterFlashLoan(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    ORACLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    checkLPOnFlashLoanAttack(
      lpToken: string,
      lpPool: string,
      assetToLoan: string,
      amountToLoan: BigNumberish,
      adapter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    executeOperation(
      asset: string,
      amount: BigNumberish,
      fee: BigNumberish,
      sender: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getPriceAfterFlashLoan(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUnsafePriceAfterFlashLoan(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    priceAfterFlashLoan(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    priceUnsafeAfterFlashLoan(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
