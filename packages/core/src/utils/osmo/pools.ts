import Long from 'long';
import { osmosis } from 'osmojs';
import { Dec } from '@keplr-wallet/unit';
import { PrettyPair, PrettyPool } from '../../types';
import { getOsmoAssetByDenom, makePoolsPretty } from './utils';
import { getPricesFromCoinGecko, prettyPool } from '../../clients';

export const makePoolPairs = (
    pools: PrettyPool[],
    liquidityLimit = 100_000
): PrettyPair[] => {
    return pools
        .filter(Boolean)
        .filter(pool => new Dec(pool.liquidity).gte(new Dec(liquidityLimit)))

        .filter(pool => pool.tokens.length === 2) // only pairs
        .map((pool) => {

            const assetA = pool.tokens[0];
            const assetAinfo = getOsmoAssetByDenom(assetA.denom);
            const assetB = pool.tokens[1];
            const assetBinfo = getOsmoAssetByDenom(assetB.denom);

            return {
                ...pool,
                pool_address: pool.address,
                base_name: assetAinfo.display,
                base_symbol: assetAinfo.symbol,
                base_address: assetAinfo.base,
                quote_name: assetBinfo.display,
                quote_symbol: assetBinfo.symbol,
                quote_address: assetBinfo.base
            }
        })
};


export const getPoolsDecoded = async (client) => {
    const rpcPools = await client.osmosis.gamm.v1beta1.pools({
        pagination: {
            key: new Uint8Array(),
            offset: Long.fromNumber(0),
            limit: Long.fromNumber(1500),
            countTotal: false,
            reverse: false
        }
    });

    return rpcPools.pools.filter(pool =>
        [
            // '/osmosis.gamm.poolmodels.stableswap.v1beta1.Pool',
            '/osmosis.gamm.v1beta1.Pool'
        ].includes(pool.$typeUrl)
    );
};

export const getBalancerPools = async (client) => {
    const rawPools = await getPoolsDecoded(client);
    const pools = rawPools.map((pool) => prettyPool(pool));
    return pools;
};

export const getPoolsPricesPairs = async (client) => {
    const pools = await getBalancerPools(client);
    const prices = await getPricesFromCoinGecko();
    const prettyPools = makePoolsPretty(prices, pools);
    const pairs = makePoolPairs(prettyPools);
    return {
        pools,
        prices,
        pairs,
        prettyPools
    };
};

