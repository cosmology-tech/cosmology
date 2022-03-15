// @ts-nocheck
import pricesFixture from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import cases from 'jest-in-case';

import {
  symbolsAndDisplayValuesToCoinsArray,
  substractCoins,
  convertGeckoPricesToDenomPriceHash,
  getFilteredPoolsWithValues,
  convertCoinsToDisplayValues
} from '../src/utils/osmo';

const prices = convertGeckoPricesToDenomPriceHash(pricesFixture);
const pools = getFilteredPoolsWithValues({ prices, pools: poolsFixture.pools });

it('subtraction', async () => {
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
      symbol: 'ATOM',
      amount: 10
    },
    {
      symbol: 'OSMO',
      amount: 100
    }
  ]);

  expect(substractCoins(balances, desired)).toMatchSnapshot();
});

it('subtraction 2', async () => {
  let balances = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'ATOM',
      amount: 1000
    },
    {
      symbol: 'OSMO',
      amount: 1000
    }
  ]);
  balances = convertCoinsToDisplayValues({ prices, coins: balances });
  let desired = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'ATOM',
      amount: 10
    },
    {
      symbol: 'OSMO',
      amount: 100
    }
  ]);
  desired = convertCoinsToDisplayValues({ prices, coins: desired });

  expect(balances).toMatchSnapshot();
  expect(desired).toMatchSnapshot();
  expect(substractCoins(balances, desired)).toMatchSnapshot();
});

it('subtraction 3', async () => {
  let balances = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'ATOM',
      amount: 1000
    },
    {
      symbol: 'OSMO',
      amount: 1000
    }
  ]);
  balances = convertCoinsToDisplayValues({ prices, coins: balances });
  let desired = symbolsAndDisplayValuesToCoinsArray([
    {
      symbol: 'ATOM',
      amount: 10
    },
    {
      symbol: 'OSMO',
      amount: 100
    },
    {
      symbol: 'OSMO',
      amount: 100
    }
  ]);
  desired = convertCoinsToDisplayValues({ prices, coins: desired });

  expect(balances).toMatchSnapshot();
  expect(desired).toMatchSnapshot();
  expect(substractCoins(balances, desired)).toMatchSnapshot();
});
