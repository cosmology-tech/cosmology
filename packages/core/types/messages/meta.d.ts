export namespace meta {
    namespace createPool {
        const osmosis: typeof import("../proto/generated/codecimpl").osmosis.gamm.v1beta1.MsgCreatePool;
        const amino: string;
        const type: string;
        const gas: number;
    }
    namespace joinPool {
        const osmosis_2: typeof import("../proto/generated/codecimpl").osmosis.gamm.v1beta1.MsgJoinPool;
        export { osmosis_2 as osmosis };
        const amino_1: string;
        export { amino_1 as amino };
        const type_1: string;
        export { type_1 as type };
        const gas_1: number;
        export { gas_1 as gas };
        export const shareCoinDecimals: number;
    }
    namespace joinSwapExternAmountIn {
        const osmosis_3: typeof import("../proto/generated/codecimpl").osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn;
        export { osmosis_3 as osmosis };
        const amino_2: string;
        export { amino_2 as amino };
        const type_2: string;
        export { type_2 as type };
        const gas_2: number;
        export { gas_2 as gas };
        const shareCoinDecimals_1: number;
        export { shareCoinDecimals_1 as shareCoinDecimals };
    }
    namespace exitPool {
        const osmosis_4: typeof import("../proto/generated/codecimpl").osmosis.gamm.v1beta1.MsgExitPool;
        export { osmosis_4 as osmosis };
        const amino_3: string;
        export { amino_3 as amino };
        const type_3: string;
        export { type_3 as type };
        const gas_3: number;
        export { gas_3 as gas };
        const shareCoinDecimals_2: number;
        export { shareCoinDecimals_2 as shareCoinDecimals };
    }
    namespace swapExactAmountIn {
        const osmosis_5: typeof import("../proto/generated/codecimpl").osmosis.gamm.v1beta1.MsgSwapExactAmountIn;
        export { osmosis_5 as osmosis };
        const amino_4: string;
        export { amino_4 as amino };
        const type_4: string;
        export { type_4 as type };
        const gas_4: number;
        export { gas_4 as gas };
    }
    namespace swapExactAmountOut {
        const osmosis_6: typeof import("../proto/generated/codecimpl").osmosis.gamm.v1beta1.MsgSwapExactAmountOut;
        export { osmosis_6 as osmosis };
        const amino_5: string;
        export { amino_5 as amino };
        const type_5: string;
        export { type_5 as type };
        const gas_5: number;
        export { gas_5 as gas };
    }
    namespace lockTokens {
        const osmosis_7: typeof import("../proto/generated/codecimpl").osmosis.lockup.MsgLockTokens;
        export { osmosis_7 as osmosis };
        const amino_6: string;
        export { amino_6 as amino };
        const type_6: string;
        export { type_6 as type };
        const gas_6: number;
        export { gas_6 as gas };
    }
    namespace beginUnlocking {
        const osmosis_8: typeof import("../proto/generated/codecimpl").osmosis.lockup.MsgBeginUnlocking;
        export { osmosis_8 as osmosis };
        const amino_7: string;
        export { amino_7 as amino };
        const type_7: string;
        export { type_7 as type };
        const gas_7: number;
        export { gas_7 as gas };
    }
    namespace unlockPeriodLock {
        const type_8: string;
        export { type_8 as type };
        const gas_8: number;
        export { gas_8 as gas };
    }
}
