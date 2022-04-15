import {
  getPoolAprs,
  OsmosisValidatorClient,
  OsmosisApiClient
} from '@cosmology/core';
import { prompt } from '../utils';

const validator = new OsmosisValidatorClient();
const api = new OsmosisApiClient();

const getPools = async (argv) => {
  if (argv.poolId) return [];
  const pools = await validator.getPools();
  return Object.keys(pools)
    .map((poolId) => {
      if (pools[poolId][0].liquidity > argv['liquidity-limit']) {
        return {
          name: pools[poolId].map((a) => a.symbol).join('/'),
          value: poolId
        };
      }
    })
    .filter(Boolean);
};

export default async (argv) => {
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  if (!argv['lockup']) argv['lockup'] = '14';

  const pools = await getPools(argv);
  let { poolId } = await prompt(
    [
      {
        type: 'checkbox',
        name: 'poolId',
        message: 'poolId',
        choices: pools
      }
    ],
    argv
  );

  if (!Array.isArray(poolId)) {
    poolId = [poolId];
  }

  const results = await getPoolAprs({
    api,
    validator,
    poolIds: poolId,
    liquidityLimit: argv['liquidity-limit'],
    lockup: argv['lockup']
  });

  results.forEach((item) => {
    const {
      poolId,
      osmoIncentives,
      externalIncentives,
      futureIncentives,
      totalIncentives,
      gauge
    } = item;

    console.log(`POOL ${poolId}`);
    console.log(
      JSON.stringify(
        {
          osmoIncentives,
          externalIncentives,
          futureIncentives,
          totalIncentives,
          gauge
        },
        null,
        2
      )
    );
  });
};
