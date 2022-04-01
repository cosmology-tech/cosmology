// @ts-nocheck
import pricesFixture from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import pairsFixture from '../__fixtures__/validator/pairs/v1/summary/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import cases from 'jest-in-case';
import {
  convertGeckoPricesToDenomPriceHash,
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances,
  convertWeightsIntoCoins,
  getFilteredPoolsWithValues,
  getSwaps,
  calculateCoinsTotalBalance
} from '../src/utils/osmo';
import { Dec } from '@keplr-wallet/unit';
const prices = convertGeckoPricesToDenomPriceHash(pricesFixture);
const pools = getFilteredPoolsWithValues({ prices, pools: poolsFixture.pools });

cases(
  'weights',
  async (opts) => {
    const balances = symbolsAndDisplayValuesToCoinsArray(opts.balances);

    const balanceValue = calculateCoinsTotalBalance({
      prices,
      coins: balances
    });
    // - [x] get value of balance
    expect(new Dec(balanceValue).sub(new Dec(opts.total)).isZero());

    const weights = opts.weights;
    const weightCoins = convertWeightsIntoCoins({
      weights,
      pools,
      prices,
      balances
    });
    console.log(weightCoins);

    // - [x] get value of weights into coins/pools
    const poolsValue = weightCoins.pools.reduce((m, v) => {
      return m.add(new Dec(v.value));
    }, new Dec(0));
    const coinsValue = weightCoins.coins.reduce((m, v) => {
      return m.add(new Dec(v.value));
    }, new Dec(0));
    const diff = coinsValue.add(poolsValue).sub(new Dec(opts.total));
    expect(diff.isZero()).toBe(true);

    // - [ ] get value of calculated trades
    const desired = weightCoins.pools[0].coins;
    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });
    const swaps = await getSwaps({ pools, trades, pairs: pairsFixture.data });

    console.log(swaps);

    // - [ ] single weight (not multiple pools)
    // - [ ] only pools weights
    // - [ ] only coins weights
  },
  [
    {
      name: 'simple',
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
      ],
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
    }
  ]
);
