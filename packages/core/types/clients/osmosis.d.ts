import { CosmosApiClient } from './cosmos';
import { LcdPool, Pool, PoolDisplay, PoolPretty } from '../types';
export interface PoolsResponse {
    pools: LcdPool[];
    pagination: object;
}
export declare class OsmosisApiClient extends CosmosApiClient {
    constructor({ url }?: {
        url?: string;
    });
    getPools(): Promise<PoolsResponse>;
    getPool(poolId: any): Promise<unknown>;
    getAccountLockedLongerDuration(address: any): Promise<unknown>;
    getAccountLockedCoins(address: any): Promise<unknown>;
    getEpochProvision(): Promise<unknown>;
    getEpochs(): Promise<unknown>;
    getDistrInfo(): Promise<unknown>;
    getParams(): Promise<unknown>;
    getLockableDurations(): Promise<unknown>;
    getGauges(): Promise<unknown>;
    getActiveGauges(): Promise<unknown>;
    getGauge(gaugeId: any): Promise<unknown>;
    getIncentivizedPools(): Promise<unknown>;
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
