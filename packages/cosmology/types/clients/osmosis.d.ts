import { CosmosApiClient } from './cosmos';
import { LcdPool, Pool, PoolDisplay, PoolPretty } from '../..';
export interface PoolsResponse {
    pools: LcdPool[];
    pagination: object;
}
export declare class OsmosisApiClient extends CosmosApiClient {
    constructor({ url }?: {
        url?: string;
    });
    getPools(): Promise<PoolsResponse>;
    getPool(poolId: any): Promise<any>;
    getAccountLockedLongerDuration(address: any): Promise<any>;
    getAccountLockedCoins(address: any): Promise<any>;
    getEpochProvision(): Promise<any>;
    getEpochs(): Promise<any>;
    getDistrInfo(): Promise<any>;
    getParams(): Promise<any>;
    getLockableDurations(): Promise<any>;
    getGauges(): Promise<any>;
    getActiveGauges(): Promise<any>;
    getGauge(gaugeId: any): Promise<any>;
    getIncentivizedPools(): Promise<any>;
    getPoolsPretty({ includeDetails }?: {
        includeDetails?: boolean;
    }): Promise<PoolPretty[]>;
    getPoolPretty(poodId: any, { includeDetails }?: {
        includeDetails?: boolean;
    }): Promise<PoolPretty>;
}
export declare const prettyPool: (pool: LcdPool | Pool | PoolDisplay, { includeDetails }?: {
    includeDetails?: boolean;
}) => PoolPretty;
