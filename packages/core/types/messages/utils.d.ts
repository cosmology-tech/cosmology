import { SigningStargateClient } from '@cosmjs/stargate';
import { BroadcastTxResponse } from '../types';
import { OfflineSigner } from '@cosmjs/proto-signing';
export declare const getSigningOsmosisClient: ({ rpcEndpoint, signer }: {
    rpcEndpoint: string;
    signer: OfflineSigner;
}) => Promise<SigningStargateClient>;
export declare const signAndBroadcast: ({ client, chainId, address, msg, fee, memo }: {
    client: SigningStargateClient;
    chainId: string;
    address: string;
    msg: any;
    fee: any;
    memo: string;
}) => Promise<BroadcastTxResponse>;
export declare const signAndBroadcastBatch: ({ client, chainId, address, msgs, fee, memo }: {
    client: SigningStargateClient;
    chainId: string;
    address: string;
    msgs: any[];
    fee: any;
    memo: string;
}) => Promise<import("@cosmjs/stargate").DeliverTxResponse>;
export declare const generateOsmoMessage: (name: any, msg: any) => {
    fee: {
        amount: import("@cosmjs/stargate").Coin[];
        gas: string;
    };
    msg: {
        typeUrl: any;
        value: any;
    };
};
export declare const estimateOsmoFee: (client: SigningStargateClient, address: string, msgs: any[], memo: string) => Promise<import("@cosmjs/stargate").StdFee>;
export declare const noDecimals: (num: any) => string;
