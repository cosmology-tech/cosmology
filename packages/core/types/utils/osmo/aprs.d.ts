export function getPoolAprs({ api, validator, poolIds, liquidityLimit, lockup }: {
    api: any;
    validator: any;
    poolIds: any;
    liquidityLimit?: number;
    lockup?: string;
}): Promise<{
    poolId: any;
    osmoIncentives: any;
    externalIncentives: any;
    futureIncentives: any;
    totalIncentives: any;
    gauge: any;
}[]>;
