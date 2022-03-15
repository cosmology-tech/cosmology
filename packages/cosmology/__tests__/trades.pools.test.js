// @ts-nocheck
import pricesFixture from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import cases from 'jest-in-case';
import {
    convertGeckoPricesToDenomPriceHash,
    getPoolByGammName,
    getFilteredPoolsWithValues,
    symbolsAndDisplayValuesToCoinsArray,
    getTradesRequiredToGetBalances,
    canonicalizeCoinWeights,
    convertWeightsIntoCoins,
    poolAllocationToCoinsNeeded
} from '../src/utils/osmo';

const prices = convertGeckoPricesToDenomPriceHash(pricesFixture);
const pools = getFilteredPoolsWithValues({ prices, pools: poolsFixture.pools });

cases('getPoolByGammName', opts => {
    const prices = convertGeckoPricesToDenomPriceHash(pricesFixture)
    const pools = getFilteredPoolsWithValues({ prices, pools: poolsFixture.pools })
    expect(getPoolByGammName(pools, opts.name).id).toEqual(opts.poolId);
}, [
    {
        name: 'gamm/pool/1',
        poolId: "1"
    },
    {
        name: 'gamm/pool/600',
        poolId: "600"
    },
    {
        name: 'gamm/pool/606',
        poolId: "606"
    }
]);

cases('canonicalizeCoinWeights', opts => {
    expect(canonicalizeCoinWeights({
        weights: opts.weights, pools, prices
    })).toMatchSnapshot();
}, [
    {
        name: 'many weights',
        weights: [
            {
                weight: 5,
                denom: 'gamm/pool/3'
            },
            {
                weight: 5,
                denom: 'gamm/pool/1'
            },
            {
                weight: 5,
                poolId: '600'
            },
            {
                weight: 5,
                denom: 'gamm/pool/606'
            },
            {
                weight: 2,
                symbol: 'LUNA',
                denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0'
            },
            {
                weight: 10,
                symbol: 'UST',
                denom: 'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC'
            }
        ]
    },
    {
        name: '3 weights',
        weights: [
            {
                weight: 5,
                denom: 'gamm/pool/606'
            },
            {
                weight: 2,
                symbol: 'LUNA'
            },
            {
                weight: 10,
                denom: 'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC'
            }
        ]
    },
    {
        name: 'pools only',
        weights: [
            {
                weight: 5,
                denom: 'gamm/pool/3'
            },
            {
                weight: 5,
                denom: 'gamm/pool/1'
            },
            {
                weight: 5,
                poolId: '600'
            }
        ]
    }
]);

it('allocations', async () => {
    const allocation = poolAllocationToCoinsNeeded({
        pools, prices, weight: {
            "allocation": 0.15625,
            "denom": "gamm/pool/600",
            "name": "ATOM/CMDX",
            "poolId": "600",
            "type": "pool",
            "value": 1994.21875,
            "weight": 5,
        }
    });
    expect(allocation).toMatchSnapshot();
});

describe('pool allocations', () => {
    // CONVERT WEIGHTS of POOLS/COINS into COINS

    const balances = symbolsAndDisplayValuesToCoinsArray(
        [
            {
                symbol: 'ATOM',
                amount: 100
            },
            {
                symbol: 'OSMO',
                amount: 1000
            }
        ]
    );
    
    
    const weights = [
        {
            weight: 5,
            denom: 'gamm/pool/3'
        },
        {
            weight: 5,
            denom: 'gamm/pool/1'
        },
        {
            weight: 5,
            poolId: '600'
        },
        {
            weight: 5,
            denom: 'gamm/pool/606'
        },
        {
            weight: 2,
            symbol: 'LUNA',
            denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0'
        },
        {
            weight: 10,
            symbol: 'UST',
            denom: 'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC'
        }
    ];

    it('determines pool allocations', async () => {
        // - [x] determine value of each allocation
        // - [x] given value of pool allocation, determine amount of coins
        const result = convertWeightsIntoCoins({ weights, pools, prices, balances });
        expect(result).toMatchSnapshot();
    });



    it('pool trades', async () => {
        // - [x] determine trades required for pools
        const result = convertWeightsIntoCoins({ weights, pools, prices, balances });
        for (let i=0; i<result.pools.length; i++) {
            const desired = result.pools[i].coins;
            const trades = getTradesRequiredToGetBalances({ prices, balances, desired })
            const a = {
                name: result.pools[i].name,
                trades
            };
            expect(a).toMatchSnapshot();
        }
    });

    it('determines pool allocations', async () => {
        // - [x] determine trades required for coins
        const result = convertWeightsIntoCoins({ weights, pools, prices, balances });
        const trades = getTradesRequiredToGetBalances({ prices, balances, desired: result.coins })
        expect(trades).toMatchSnapshot();
    });
});
