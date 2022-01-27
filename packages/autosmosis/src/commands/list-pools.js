import { OsmosisApiClient } from '../clients/osmosis';
import { assets } from '../assets';

const assetHashMap = assets.reduce((m, asset) => {
  m[asset.base] = asset;
  return m;
}, {});

export default async (argv) => {
  let pools;
  try {
    const client = new OsmosisApiClient();
    ({ pools } = await client.getPools());
  } catch (e) {
    return console.log('error fetching pools');
  }

  //   console.log(pools[0]);

  const prettyPools = pools.map((pool) => {
    const totalWeight = Number(pool.totalWeight);
    const tokens = pool.poolAssets.map(({ token, weight }) => {
      const symbol = assetHashMap?.[token.denom]?.symbol ?? token.denom;
      const ratio = Number(weight) / totalWeight;
      return {
        symbol,
        amount: token.amount,
        ratio
      };
    });
    return tokens;
  });
  console.log(prettyPools);
};
