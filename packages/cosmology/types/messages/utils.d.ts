import { SigningStargateClient } from '@cosmjs/stargate';
import { BroadcastTxResponse } from '../types';
export declare const getSigningOsmosisClient: ({ rpcEndpoint, signer }: {
    rpcEndpoint: any;
    signer: any;
}) => Promise<SigningStargateClient>;
export declare const signAndBroadcast: ({ client, chainId, address, msg, fee, memo }: {
    client: any;
    chainId: any;
    address: any;
    msg: any;
    fee: any;
    memo?: string;
}) => Promise<BroadcastTxResponse>;
export declare const signAndBroadcastBatch: ({ client, chainId, address, msgs, fee, memo }: {
    client: any;
    chainId: any;
    address: any;
    msgs: any;
    fee: any;
    memo?: string;
}) => Promise<any>;
export declare const signAndBroadcastTilTxExists: ({ client, cosmos, chainId, address, msg, fee, memo }: {
    client: any;
    cosmos: any;
    chainId: any;
    address: any;
    msg: any;
    fee: any;
    memo?: string;
}) => Promise<unknown>;
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
export declare const estimateOsmoFee: (client: any, address: any, msgs: any, memo: any) => Promise<import("@cosmjs/stargate").StdFee>;
export declare const noDecimals: (num: any) => string;
