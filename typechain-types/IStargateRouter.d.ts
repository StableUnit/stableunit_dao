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

interface IStargateRouterInterface extends ethers.utils.Interface {
  functions: {
    "addLiquidity(uint256,uint256,address)": FunctionFragment;
    "instantRedeemLocal(uint16,uint256,address)": FunctionFragment;
    "quoteLayerZeroFee(uint16,uint8,bytes,bytes,(uint256,uint256,bytes))": FunctionFragment;
    "redeemLocal(uint16,uint256,uint256,address,uint256,bytes,(uint256,uint256,bytes))": FunctionFragment;
    "redeemRemote(uint16,uint256,uint256,address,uint256,uint256,bytes,(uint256,uint256,bytes))": FunctionFragment;
    "sendCredits(uint16,uint256,uint256,address)": FunctionFragment;
    "swap(uint16,uint256,uint256,address,uint256,uint256,(uint256,uint256,bytes),bytes,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "instantRedeemLocal",
    values: [BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "quoteLayerZeroFee",
    values: [
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike,
      {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemLocal",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish,
      BytesLike,
      {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemRemote",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish,
      BytesLike,
      {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "sendCredits",
    values: [BigNumberish, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish,
      {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      BytesLike,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "instantRedeemLocal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "quoteLayerZeroFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redeemLocal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redeemRemote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sendCredits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;

  events: {};
}

export class IStargateRouter extends BaseContract {
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

  interface: IStargateRouterInterface;

  functions: {
    addLiquidity(
      _poolId: BigNumberish,
      _amountLD: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    instantRedeemLocal(
      _srcPoolId: BigNumberish,
      _amountLP: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    quoteLayerZeroFee(
      _dstChainId: BigNumberish,
      _functionType: BigNumberish,
      _toAddress: BytesLike,
      _transferAndCallPayload: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    redeemLocal(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemRemote(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _minAmountLD: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sendCredits(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swap(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLD: BigNumberish,
      _minAmountLD: BigNumberish,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      _to: BytesLike,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addLiquidity(
    _poolId: BigNumberish,
    _amountLD: BigNumberish,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  instantRedeemLocal(
    _srcPoolId: BigNumberish,
    _amountLP: BigNumberish,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  quoteLayerZeroFee(
    _dstChainId: BigNumberish,
    _functionType: BigNumberish,
    _toAddress: BytesLike,
    _transferAndCallPayload: BytesLike,
    _lzTxParams: {
      dstGasForCall: BigNumberish;
      dstNativeAmount: BigNumberish;
      dstNativeAddr: BytesLike;
    },
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  redeemLocal(
    _dstChainId: BigNumberish,
    _srcPoolId: BigNumberish,
    _dstPoolId: BigNumberish,
    _refundAddress: string,
    _amountLP: BigNumberish,
    _to: BytesLike,
    _lzTxParams: {
      dstGasForCall: BigNumberish;
      dstNativeAmount: BigNumberish;
      dstNativeAddr: BytesLike;
    },
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemRemote(
    _dstChainId: BigNumberish,
    _srcPoolId: BigNumberish,
    _dstPoolId: BigNumberish,
    _refundAddress: string,
    _amountLP: BigNumberish,
    _minAmountLD: BigNumberish,
    _to: BytesLike,
    _lzTxParams: {
      dstGasForCall: BigNumberish;
      dstNativeAmount: BigNumberish;
      dstNativeAddr: BytesLike;
    },
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sendCredits(
    _dstChainId: BigNumberish,
    _srcPoolId: BigNumberish,
    _dstPoolId: BigNumberish,
    _refundAddress: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swap(
    _dstChainId: BigNumberish,
    _srcPoolId: BigNumberish,
    _dstPoolId: BigNumberish,
    _refundAddress: string,
    _amountLD: BigNumberish,
    _minAmountLD: BigNumberish,
    _lzTxParams: {
      dstGasForCall: BigNumberish;
      dstNativeAmount: BigNumberish;
      dstNativeAddr: BytesLike;
    },
    _to: BytesLike,
    _payload: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addLiquidity(
      _poolId: BigNumberish,
      _amountLD: BigNumberish,
      _to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    instantRedeemLocal(
      _srcPoolId: BigNumberish,
      _amountLP: BigNumberish,
      _to: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    quoteLayerZeroFee(
      _dstChainId: BigNumberish,
      _functionType: BigNumberish,
      _toAddress: BytesLike,
      _transferAndCallPayload: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    redeemLocal(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<void>;

    redeemRemote(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _minAmountLD: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<void>;

    sendCredits(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    swap(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLD: BigNumberish,
      _minAmountLD: BigNumberish,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      _to: BytesLike,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addLiquidity(
      _poolId: BigNumberish,
      _amountLD: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    instantRedeemLocal(
      _srcPoolId: BigNumberish,
      _amountLP: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    quoteLayerZeroFee(
      _dstChainId: BigNumberish,
      _functionType: BigNumberish,
      _toAddress: BytesLike,
      _transferAndCallPayload: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemLocal(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemRemote(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _minAmountLD: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sendCredits(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swap(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLD: BigNumberish,
      _minAmountLD: BigNumberish,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      _to: BytesLike,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addLiquidity(
      _poolId: BigNumberish,
      _amountLD: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    instantRedeemLocal(
      _srcPoolId: BigNumberish,
      _amountLP: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    quoteLayerZeroFee(
      _dstChainId: BigNumberish,
      _functionType: BigNumberish,
      _toAddress: BytesLike,
      _transferAndCallPayload: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    redeemLocal(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemRemote(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLP: BigNumberish,
      _minAmountLD: BigNumberish,
      _to: BytesLike,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sendCredits(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swap(
      _dstChainId: BigNumberish,
      _srcPoolId: BigNumberish,
      _dstPoolId: BigNumberish,
      _refundAddress: string,
      _amountLD: BigNumberish,
      _minAmountLD: BigNumberish,
      _lzTxParams: {
        dstGasForCall: BigNumberish;
        dstNativeAmount: BigNumberish;
        dstNativeAddr: BytesLike;
      },
      _to: BytesLike,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}