export * from './gas';
export * from './utils';
export declare const messages: {
    lockTokens(value: import("osmojs/types/proto/osmosis/lockup/tx").MsgLockTokens): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/lockup/tx").MsgLockTokens;
    };
    beginUnlockingAll(value: import("osmojs/types/proto/osmosis/lockup/tx").MsgBeginUnlockingAll): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/lockup/tx").MsgBeginUnlockingAll;
    };
    beginUnlocking(value: import("osmojs/types/proto/osmosis/lockup/tx").MsgBeginUnlocking): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/lockup/tx").MsgBeginUnlocking;
    };
    superfluidDelegate(value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgSuperfluidDelegate): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgSuperfluidDelegate;
    };
    superfluidUndelegate(value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgSuperfluidUndelegate): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgSuperfluidUndelegate;
    };
    superfluidUnbondLock(value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgSuperfluidUnbondLock): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgSuperfluidUnbondLock;
    };
    lockAndSuperfluidDelegate(value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgLockAndSuperfluidDelegate): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/superfluid/tx").MsgLockAndSuperfluidDelegate;
    };
    joinPool(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgJoinPool): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgJoinPool;
    };
    exitPool(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgExitPool): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgExitPool;
    };
    swapExactAmountIn(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgSwapExactAmountIn): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgSwapExactAmountIn;
    };
    swapExactAmountOut(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgSwapExactAmountOut): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgSwapExactAmountOut;
    };
    joinSwapExternAmountIn(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgJoinSwapExternAmountIn): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgJoinSwapExternAmountIn;
    };
    joinSwapShareAmountOut(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgJoinSwapShareAmountOut): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgJoinSwapShareAmountOut;
    };
    exitSwapExternAmountOut(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgExitSwapExternAmountOut): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgExitSwapExternAmountOut;
    };
    exitSwapShareAmountIn(value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgExitSwapShareAmountIn): {
        typeUrl: string;
        value: import("osmojs/types/proto/osmosis/gamm/v1beta1/tx").MsgExitSwapShareAmountIn;
    };
};
import * as telescope from 'osmojs';
export { telescope };
