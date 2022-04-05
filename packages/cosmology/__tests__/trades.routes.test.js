// @ts-nocheck
import validatorPricesFixture from '../__fixtures__/validator/tokens/v2/all/data.json';
import pairsFixture from '../__fixtures__/validator/pairs/v1/summary/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import lockedPoolsFixture from '../__fixtures__/lcd/osmosis/lockup/v1beta1/account_locked_coins/osmo1/data.json';

import {
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances,
  getSwaps,
  getFilteredPoolsWithValues,
  convertValidatorPricesToDenomPriceHash
} from '../src/utils/osmo';

const prices = convertValidatorPricesToDenomPriceHash(validatorPricesFixture);
const pools = getFilteredPoolsWithValues({ prices, pools: poolsFixture.pools });

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
    pairs: pairsFixture.data
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
    pairs: pairsFixture.data
  });
  swaps.forEach((swap) => {
    expect(swap.routes.length).toBe(2);
  });
  expect(swaps).toMatchSnapshot();
});
