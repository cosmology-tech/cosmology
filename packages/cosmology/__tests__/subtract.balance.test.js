// @ts-nocheck
import pricesFixture from '../__fixtures__/coingecko/api/v3/simple/price/data.json';

import {
  symbolsAndDisplayValuesToCoinsArray,
  substractCoins,
  convertGeckoPricesToDenomPriceHash,
  convertCoinsToDisplayValues
} from '../src/utils/osmo';

const prices = convertGeckoPricesToDenomPriceHash(pricesFixture);

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
