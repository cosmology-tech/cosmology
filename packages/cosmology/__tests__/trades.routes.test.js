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

// {
//     "type": "osmosis/gamm/swap-exact-amount-in",
//     "value": {
//       "sender": "osmo1mn7ltv80e0vnr9zsy2ukuxaqk0yr4n9em87wsf",
//       "routes": [
//         {
//           "poolId": "611",
//           "tokenOutDenom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
//         },
//         {
//           "poolId": "600",
//           "tokenOutDenom": "ibc/EA3E1640F9B1532AB129A571203A0B9F789A7F14BB66E350DCBFA18E1A1931F0"
//         }
//       ],
//       "tokenIn": {
//         "denom": "ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4",
//         "amount": "1000000"
//       },
//       "tokenOutMinAmount": "268878"
//     }
//   }

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
