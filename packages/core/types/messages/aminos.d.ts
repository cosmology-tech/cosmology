export namespace aminos {
    namespace createPool {
        function toAmino(): void;
        function fromAmino(): void;
    }
    namespace joinPool {
        export function toAmino_1({ sender, poolId, shareOutAmount, tokenInMaxs }: {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        }): {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        };
        export { toAmino_1 as toAmino };
        export function fromAmino_1({ sender, poolId, shareOutAmount, tokenInMaxs }: {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        }): {
            sender: any;
            poolId: any;
            shareOutAmount: any;
            tokenInMaxs: any;
        };
        export { fromAmino_1 as fromAmino };
    }
    namespace joinSwapExternAmountIn {
        export function toAmino_2(): void;
        export { toAmino_2 as toAmino };
        export function fromAmino_2(): void;
        export { fromAmino_2 as fromAmino };
    }
    namespace exitPool {
        export function toAmino_3(): void;
        export { toAmino_3 as toAmino };
        export function fromAmino_3(): void;
        export { fromAmino_3 as fromAmino };
    }
    namespace swapExactAmountIn {
        export function toAmino_4({ sender, routes, tokenIn, tokenOutMinAmount }: {
            sender: any;
            routes: any;
            tokenIn: any;
            tokenOutMinAmount: any;
        }): {
            sender: any;
            routes: any;
            tokenIn: {
                denom: any;
                amount: any;
            };
            tokenOutMinAmount: any;
        };
        export { toAmino_4 as toAmino };
        export function fromAmino_4({ sender, routes, tokenIn, tokenOutMinAmount }: {
            sender: any;
            routes: any;
            tokenIn: any;
            tokenOutMinAmount: any;
        }): {
            sender: any;
            routes: any;
            tokenIn: any;
            tokenOutMinAmount: any;
        };
        export { fromAmino_4 as fromAmino };
    }
    namespace swapExactAmountOut {
        export function toAmino_5(): void;
        export { toAmino_5 as toAmino };
        export function fromAmino_5(): void;
        export { fromAmino_5 as fromAmino };
    }
    namespace lockTokens {
        export function toAmino_6({ owner, duration, coins }: {
            owner: any;
            duration: any;
            coins: any;
        }): {
            owner: any;
            coins: any;
            duration: string;
        };
        export { toAmino_6 as toAmino };
        export function fromAmino_6({ owner, duration, coins }: {
            owner: any;
            duration: any;
            coins: any;
        }): {
            owner: any;
            coins: any;
            duration: {
                seconds: any;
                nanos: number;
            };
        };
        export { fromAmino_6 as fromAmino };
    }
    namespace beginUnlocking {
        export function toAmino_7(): void;
        export { toAmino_7 as toAmino };
        export function fromAmino_7(): void;
        export { fromAmino_7 as fromAmino };
    }
    namespace unlockPeriodLock {
        export function toAmino_8(): void;
        export { toAmino_8 as toAmino };
        export function fromAmino_8(): void;
        export { fromAmino_8 as fromAmino };
    }
}
