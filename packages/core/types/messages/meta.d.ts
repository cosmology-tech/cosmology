import { osmosis } from '../proto/generated/codecimpl';
export declare const meta: {
    createPool: {
        osmosis: typeof osmosis.gamm.v1beta1.MsgCreatePool;
        amino: string;
        type: string;
        gas: number;
    };
    joinPool: {
        osmosis: typeof osmosis.gamm.v1beta1.MsgJoinPool;
        amino: string;
        type: string;
        gas: number;
        shareCoinDecimals: number;
    };
    joinSwapExternAmountIn: {
        osmosis: typeof osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn;
        amino: string;
        type: string;
        gas: number;
        shareCoinDecimals: number;
    };
    exitPool: {
        osmosis: typeof osmosis.gamm.v1beta1.MsgExitPool;
        amino: string;
        type: string;
        gas: number;
        shareCoinDecimals: number;
    };
    swapExactAmountIn: {
        osmosis: typeof osmosis.gamm.v1beta1.MsgSwapExactAmountIn;
        amino: string;
        type: string;
        gas: number;
    };
    swapExactAmountOut: {
        osmosis: typeof osmosis.gamm.v1beta1.MsgSwapExactAmountOut;
        amino: string;
        type: string;
        gas: number;
    };
    lockTokens: {
        osmosis: typeof osmosis.lockup.MsgLockTokens;
        amino: string;
        type: string;
        gas: number;
    };
    beginUnlocking: {
        osmosis: typeof osmosis.lockup.MsgBeginUnlocking;
        amino: string;
        type: string;
        gas: number;
    };
    unlockPeriodLock: {
        type: string;
        gas: number;
    };
};
