import { BroadcastTxResponse, PoolAllocation, Swap } from '../types';
export declare const printSwapForPoolAllocation: (pool: PoolAllocation) => void;
export declare const printSwap: (swap: Swap) => void;
export declare const printOsmoTransactionResponse: (res: BroadcastTxResponse) => void;
export declare const printTransactionResponse: (res: BroadcastTxResponse, chain: any) => void;
