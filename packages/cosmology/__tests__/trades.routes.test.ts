// @ts-nocheck
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import geckoPricesFixtures from '../__fixtures__/coingecko/api/v3/simple/price/data.json';

import {
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances,
  getSwaps,
  convertGeckoPricesToDenomPriceHash,
  makePoolPairs,
  makePoolsPretty,
} from '../src/utils/osmo';
import { prettyPool } from '../src/clients/osmosis';
import { LcdPool } from '../src/types';

const prices = convertGeckoPricesToDenomPriceHash(geckoPricesFixtures);
const lcdPools: LcdPool[] = poolsFixture.pools;
const prettyPools = makePoolsPretty(prices, lcdPools);
const pairs = makePoolPairs(prettyPools);
const pools = lcdPools.map((pool) => prettyPool(pool));


it('single route swaps', async () => {
  const balances = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'ATOM',
      amount: 1000
    },
    {
      symbol: 'OSMO',
      amount: 1000
    }
  ]);
  const desired = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'STARS',
      amount: 1000
    },
    {
      symbol: 'CMDX',
      amount: 100
    },
    {
      symbol: 'HUAHUA',
      amount: 10000
    }
  ]);
  const trades = getTradesRequiredToGetBalances({ prices, balances, desired });

  const swaps = getSwaps({
    prices,
    pools,
    trades,
    pairs
  });
  swaps.forEach((swap) => {
    expect(swap.routes.length).toBe(1);
  });
  expect(swaps).toMatchSnapshot();
});

it('multi-hop route swaps', async () => {
  const balances = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'STARS',
      amount: 1000000
    },
    {
      symbol: 'HUAHUA',
      amount: 10000000000
    }
  ]);
  const desired = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'CMDX',
      amount: 100
    },
    {
      symbol: 'LUNA',
      amount: 100
    }
  ]);
  const trades = getTradesRequiredToGetBalances({ prices, balances, desired });

  const swaps = getSwaps({
    prices,
    pools,
    trades,
    pairs
  });
  swaps.forEach((swap) => {
    expect(swap.routes.length).toBe(2);
  });
  expect(swaps).toMatchSnapshot();
});
