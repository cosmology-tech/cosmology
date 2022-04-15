import { Coin } from '@cosmjs/amino';
import { SwapAmountInRoute, SwapAmountOutRoute } from '../types';
export declare const messages: {
    createPool: () => never;
    joinPool: ({ sender, poolId, shareOutAmount, tokenInMaxs }: {
        sender: string;
        poolId: string;
        shareOutAmount: string;
        tokenInMaxs: Coin[];
    }) => {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    joinSwapExternAmountIn: ({ sender, poolId, tokenIn, shareOutMinAmount }: {
        sender: string;
        poolId: string;
        tokenIn: Coin;
        shareOutMinAmount: string;
    }) => {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    exitPool: () => never;
    swapExactAmountIn: ({ sender, routes, tokenIn, tokenOutMinAmount }: {
        sender: string;
        routes: SwapAmountInRoute[];
        tokenIn: Coin;
        tokenOutMinAmount: string;
    }) => {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    swapExactAmountOut: ({ sender, routes, tokenOut, tokenInMaxAmount }: {
        sender: string;
        routes: SwapAmountOutRoute[];
        tokenOut: Coin;
        tokenInMaxAmount: string;
    }) => {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    lockTokens: ({ owner, duration, coins }: {
        owner: string;
        duration: string;
        coins: Coin[];
    }) => {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    beginUnlocking: () => never;
    unlockPeriodLock: () => never;
};
