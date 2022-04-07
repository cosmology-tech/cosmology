// @ts-nocheck
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import geckoPricesFixtures from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import cases from 'jest-in-case';
import {
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances,
  getSwaps,
  convertGeckoPricesToDenomPriceHash,
  calculateCoinsTotalBalance,
  convertWeightsIntoCoins,
  makePoolPairs,
  makePoolsPretty,
} from '../src/utils/osmo';
import { prettyPool } from '../src/clients/osmosis';
import { LcdPool } from '../src/types';
import { Dec } from '@keplr-wallet/unit';

const prices = convertGeckoPricesToDenomPriceHash(geckoPricesFixtures);
const lcdPools: LcdPool[] = poolsFixture.pools;
const prettyPools = makePoolsPretty(prices, lcdPools);
const pairs = makePoolPairs(prettyPools);
const pools = lcdPools.map((pool) => prettyPool(pool));

const bank = {
  total: '9647.3',
  balances: [
    {
      // 36.63
      symbol: 'ATOM',
      amount: 10
    },
    {
      // 1.81
      symbol: 'AKT',
      amount: 100
    },
    {
      // 9.1
      symbol: 'OSMO',
      amount: 1000
    }
  ]
};

cases(
  'weights',
  async (opts) => {
    const balances = symbolsAndDisplayValuesToCoinsArray(opts.balances);

    const balanceValue = calculateCoinsTotalBalance({
      prices,
      coins: balances
    });
    expect(new Dec(balanceValue).sub(new Dec(opts.total)).isZero());

    const weights = opts.weights;
    const weightCoins = convertWeightsIntoCoins({
      weights,
      pools,
      prices,
      balances
    });

    const poolsValue = weightCoins.pools.reduce((m, v) => {
      return m.add(new Dec(v.value));
    }, new Dec(0));
    const coinsValue = weightCoins.coins.reduce((m, v) => {
      return m.add(new Dec(v.value));
    }, new Dec(0));
    const allocations = weightCoins.weights.reduce((m, v) => {
      return m.add(new Dec(v.allocation));
    }, new Dec(0));
    expect(Math.round(allocations)).toBe(1);

    // diff is zero or SUPER close to zero
    const diff = coinsValue.add(poolsValue).sub(new Dec(opts.total));
    expect(diff.isZero() || (diff.gt(new Dec(0)) && diff.lt(new Dec(0.0000001)))).toBe(true);
    expect(weightCoins).toMatchSnapshot();
  },
  [
    {
      name: 'simple',
      ...bank,
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
          symbol: 'LUNA'
        },
        {
          weight: 10,
          symbol: 'UST'
        }
      ]
    },
    {
      name: 'coins-only',
      ...bank,
      weights: [
        {
          weight: 90,
          symbol: 'OSMO'
        },
        {
          weight: 2,
          symbol: 'LUNA'
        },
        {
          weight: 10,
          symbol: 'UST'
        }
      ]
    },
    {
      name: 'pools-only',
      ...bank,
      weights: [
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
        }
      ]
    },
    {
      name: 'single',
      ...bank,
      weights: [
        {
          weight: 5,
          denom: 'gamm/pool/3'
        }
      ]
    }
  ]
);
