import { PrettyPair, PrettyPool } from '../../types';
export declare const makePoolPairs: (pools: PrettyPool[], liquidityLimit?: number) => PrettyPair[];
export declare const getPoolsDecoded: (client: any) => Promise<any>;
export declare const getBalancerPools: (client: any) => Promise<any>;
export declare const getPoolsPricesPairs: (client: any) => Promise<{
    pools: any;
    prices: import("../../types").PriceHash;
    pairs: PrettyPair[];
    prettyPools: PrettyPool[];
}>;
