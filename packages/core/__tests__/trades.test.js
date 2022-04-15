// @ts-nocheck
import pricesFixture from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import cases from 'jest-in-case';
import {
  convertGeckoPricesToDenomPriceHash,
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances
} from '../src/utils/osmo';

cases(
  'trades',
  (opts) => {
    const prices = convertGeckoPricesToDenomPriceHash(pricesFixture);
    const balances = symbolsAndDisplayValuesToCoinsArray(opts.balances);
    const desired = symbolsAndDisplayValuesToCoinsArray(opts.desired);
    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });
    expect(trades).toMatchSnapshot();
  },
  [
    {
      name: 'simple',
      balances: [
        {
          symbol: 'ATOM',
          amount: 10
        },
        {
          symbol: 'AKT',
          amount: 1000
        },
        {
          symbol: 'OSMO',
          amount: 100
        }
      ],
      desired: [
        {
          symbol: 'AKT',
          amount: 1050
        },
        {
          symbol: 'OSMO',
          amount: 100
        }
      ]
    },
    {
      name: 'desired is less but should not need to sell',
      balances: [
        {
          symbol: 'ATOM',
          amount: 10
        },
        {
          symbol: 'AKT',
          amount: 1000
        },
        {
          symbol: 'OSMO',
          amount: 101
        }
      ],
      desired: [
        {
          symbol: 'AKT',
          amount: 1050
        },
        {
          symbol: 'OSMO',
          amount: 100
        }
      ]
    },
    {
      name: 'needs two coins',
      balances: [
        {
          symbol: 'ATOM',
          amount: 10
        },
        {
          symbol: 'AKT',
          amount: 1000
        },
        {
          symbol: 'OSMO',
          amount: 100
        }
      ],
      desired: [
        {
          symbol: 'AKT',
          amount: 1050
        },
        {
          symbol: 'OSMO',
          amount: 102
        }
      ]
    },
    {
      name: 'trade3',
      balances: [
        {
          symbol: 'ATOM',
          amount: 100
        },
        {
          symbol: 'CMDX',
          amount: 1000
        },
        {
          symbol: 'OSMO',
          amount: 1000
        },
        {
          symbol: 'STARS',
          amount: 10000
        }
      ],
      desired: [
        {
          symbol: 'ATOM',
          amount: 500
        }
      ]
    },
    {
      name: 'trade3 diff order',
      balances: [
        {
          symbol: 'STARS',
          amount: 10000
        },
        {
          symbol: 'ATOM',
          amount: 100
        },
        {
          symbol: 'CMDX',
          amount: 1000
        },
        {
          symbol: 'OSMO',
          amount: 1000
        }
      ],
      desired: [
        {
          symbol: 'ATOM',
          amount: 500
        }
      ]
    }
  ]
);
