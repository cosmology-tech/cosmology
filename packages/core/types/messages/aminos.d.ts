export declare const aminos: {
    createPool: {
        toAmino: () => void;
        fromAmino: () => void;
    };
    joinPool: {
        toAmino: ({ sender, poolId, shareOutAmount, tokenInMaxs }: {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        }) => {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        };
        fromAmino: ({ sender, poolId, shareOutAmount, tokenInMaxs }: {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        }) => {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        };
    };
    joinSwapExternAmountIn: {
        toAmino: () => void;
        fromAmino: () => void;
    };
    exitPool: {
        toAmino: () => void;
        fromAmino: () => void;
    };
    swapExactAmountIn: {
        toAmino: ({ sender, routes, tokenIn, tokenOutMinAmount }: {
            sender: any;
            routes: any;
            tokenIn: any;
            tokenOutMinAmount: any;
        }) => {
            sender: any;
            routes: any;
            tokenIn: {
                denom: any;
                amount: any;
            };
            tokenOutMinAmount: any;
        };
        fromAmino: ({ sender, routes, tokenIn, tokenOutMinAmount }: {
            sender: any;
            routes: any;
            tokenIn: any;
            tokenOutMinAmount: any;
        }) => {
            sender: any;
            routes: any;
            tokenIn: any;
            tokenOutMinAmount: any;
        };
    };
    swapExactAmountOut: {
        toAmino: ({ sender, routes, tokenOut, tokenInMaxAmount }: {
            sender: any;
            routes: any;
            tokenOut: any;
            tokenInMaxAmount: any;
        }) => {
            sender: any;
            routes: any;
            tokenOut: {
                denom: any;
                amount: any;
            };
            tokenInMaxAmount: any;
        };
        fromAmino: ({ sender, routes, tokenOut, tokenInMaxAmount }: {
            sender: any;
            routes: any;
            tokenOut: any;
            tokenInMaxAmount: any;
        }) => {
            sender: any;
            routes: any;
            tokenOut: any;
            tokenInMaxAmount: any;
        };
    };
    lockTokens: {
        toAmino: ({ owner, duration, coins }: {
            owner: any;
            duration: any;
            coins: any;
        }) => {
            owner: any;
            coins: any;
            duration: string;
        };
        fromAmino: ({ owner, duration, coins }: {
            owner: any;
            duration: any;
            coins: any;
        }) => {
            owner: any;
            coins: any;
            duration: {
                seconds: any;
                nanos: number;
            };
        };
    };
    beginUnlocking: {
        toAmino: () => void;
        fromAmino: () => void;
    };
    unlockPeriodLock: {
        toAmino: () => void;
        fromAmino: () => void;
    };
};
