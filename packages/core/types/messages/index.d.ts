/// <reference types="long" />
export * from './meta';
export * from './aminos';
export * from './utils';
export declare const messages: {
    transfer: ({ sourcePort, sourceChannel, token, sender, receiver, timeoutHeight, timeoutTimestamp }: {
        sourcePort: string;
        sourceChannel: string;
        token: import("@cosmjs/amino").Coin;
        sender: string;
        receiver: string;
        timeoutHeight: {
            revisionHeight: import("long").Long;
            revisionNumber: import("long").Long;
        };
        timeoutTimestamp: import("long").Long;
    }) => {
        typeUrl: string;
        value: {
            sourcePort: string;
            sourceChannel: string;
            token: import("@cosmjs/amino").Coin;
            sender: string;
            receiver: string;
            timeoutHeight: {
                revisionHeight: import("long").Long;
                revisionNumber: import("long").Long;
            };
            timeoutTimestamp: import("long").Long;
        };
    };
    send: ({ toAddress, fromAddress, amount }: {
        toAddress: string;
        fromAddress: string;
        amount: import("@cosmjs/amino").Coin[];
    }) => {
        typeUrl: string;
        value: {
            toAddress: string;
            fromAddress: string;
            amount: import("@cosmjs/amino").Coin[];
        };
    };
    withdrawDelegatorReward: ({ delegatorAddress, validatorAddress }: {
        delegatorAddress: string;
        validatorAddress: string;
    }) => {
        typeUrl: string;
        value: import("cosmjs-types/cosmos/distribution/v1beta1/tx").MsgWithdrawDelegatorReward;
    };
    delegate: ({ delegatorAddress, validatorAddress, amount, denom }: {
        delegatorAddress: string;
        validatorAddress: string;
        amount: string;
        denom: string;
    }) => {
        typeUrl: string;
        value: import("cosmjs-types/cosmos/staking/v1beta1/tx").MsgDelegate;
    };
    vote: ({ voter, proposalId, option }: {
        voter: string;
        proposalId: import("long").Long;
        option: number;
    }) => {
        typeUrl: string;
        value: import("cosmjs-types/cosmos/gov/v1beta1/tx").MsgVote;
    };
    createPool: () => never;
    joinPool: ({ sender, poolId, shareOutAmount, tokenInMaxs }: {
        sender: string;
        poolId: string;
        shareOutAmount: string;
        tokenInMaxs: import("@cosmjs/amino").Coin[];
    }) => {
        fee: {
            amount: import("@cosmjs/amino").Coin[];
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
        tokenIn: import("@cosmjs/amino").Coin;
        shareOutMinAmount: string;
    }) => {
        fee: {
            amount: import("@cosmjs/amino").Coin[];
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
        routes: import("..").SwapAmountInRoute[];
        tokenIn: import("@cosmjs/amino").Coin;
        tokenOutMinAmount: string;
    }) => {
        fee: {
            amount: import("@cosmjs/amino").Coin[];
            gas: string;
        };
        msg: {
            typeUrl: any;
            value: any;
        };
    };
    swapExactAmountOut: ({ sender, routes, tokenOut, tokenInMaxAmount }: {
        sender: string;
        routes: import("..").SwapAmountOutRoute[];
        tokenOut: import("@cosmjs/amino").Coin;
        tokenInMaxAmount: string;
    }) => {
        fee: {
            amount: import("@cosmjs/amino").Coin[];
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
        coins: import("@cosmjs/amino").Coin[];
    }) => {
        fee: {
            amount: import("@cosmjs/amino").Coin[];
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
import { osmosis } from '../proto/generated/codecimpl';
export { osmosis };
