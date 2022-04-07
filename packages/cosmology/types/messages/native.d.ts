/// <reference types="long" />
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { Coin } from '@cosmjs/amino';
export interface Route {
    poolId: string;
    tokenOutDenom: string;
}
export declare const messages: {
    transfer: ({ sourcePort, sourceChannel, token, sender, receiver, timeoutHeight, timeoutTimestamp }: {
        sourcePort: string;
        sourceChannel: string;
        token: Coin;
        sender: string;
        receiver: string;
        timeoutHeight: {
            revisionHeight: Long;
            revisionNumber: Long;
        };
        timeoutTimestamp: Long;
    }) => {
        typeUrl: string;
        value: {
            sourcePort: string;
            sourceChannel: string;
            token: Coin;
            sender: string;
            receiver: string;
            timeoutHeight: {
                revisionHeight: Long;
                revisionNumber: Long;
            };
            timeoutTimestamp: import("long").Long;
        };
    };
    send: ({ toAddress, fromAddress, amount }: {
        toAddress: string;
        fromAddress: string;
        amount: Coin[];
    }) => {
        typeUrl: string;
        value: {
            toAddress: string;
            fromAddress: string;
            amount: Coin[];
        };
    };
    withdrawDelegatorReward: ({ delegatorAddress, validatorAddress }: {
        delegatorAddress: string;
        validatorAddress: string;
    }) => {
        typeUrl: string;
        value: MsgWithdrawDelegatorReward;
    };
    delegate: ({ delegatorAddress, validatorAddress, amount, denom }: {
        delegatorAddress: string;
        validatorAddress: string;
        amount: string;
        denom: string;
    }) => {
        typeUrl: string;
        value: MsgDelegate;
    };
    vote: ({ voter, proposalId, option }: {
        voter: string;
        proposalId: Long;
        option: number;
    }) => {
        typeUrl: string;
        value: MsgVote;
    };
};
