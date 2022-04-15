export namespace messages {
    function createPool(): void;
    function joinPool({ sender, poolId, shareOutAmount, tokenInMaxs }: {
        sender: string;
        poolId: string;
        shareOutAmount: string;
        tokenInMaxs: Coin[];
    }): {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    function joinSwapExternAmountIn({ sender, poolId, tokenIn, shareOutMinAmount }: {
        sender: string;
        poolId: string;
        tokenIn: Coin;
        shareOutMinAmount: string;
    }): {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    function exitPool(): void;
    function swapExactAmountIn({ sender, routes, tokenIn, tokenOutMinAmount }: {
        sender: string;
        routes: Route[];
        tokenIn: Coin;
        tokenOutMinAmount: string;
    }): {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    function swapExactAmountOut(): void;
    function lockTokens({ owner, duration, coins }: {
        owner: string;
        duration: string;
        coins: Coin[];
    }): {
        fee: {
            amount: Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    function beginUnlocking(): void;
    function unlockPeriodLock(): void;
}
import { Coin } from "@cosmjs/amino";
import { Route } from "../types";
