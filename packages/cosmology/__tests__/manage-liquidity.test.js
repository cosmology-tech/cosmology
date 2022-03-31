// @ts-nocheck
import pricesFixture from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import pairsFixture from '../__fixtures__/validator/pairs/v1/summary/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import cases from 'jest-in-case';
import {
  convertGeckoPricesToDenomPriceHash,
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances
} from '../src/utils/osmo';
import { CoinPretty, Dec, DecUtils, Int, IntPretty } from '@keplr-wallet/unit';

import { prettyPool } from '../src';
import {
  baseUnitsToDollarValue,
  dollarValueToDenomUnits,
  dollarValueToDisplayUnits,
  calculateShareOutAmount,
  displayUnitsToDollarValue,
  calculateMaxCoinsForPool
} from '../src/utils/chain';
import { osmoDenomToSymbol } from '../main/utils/osmo/utils';

const fakePools = [
  {
    '@type': '/osmosis.gamm.v1beta1.Pool',
    address: 'osmo1mw0ac6rwlp5r8wapwk3zs6g29h8fcscxqakdzw9emkne6c8wjp9q0t3v8t',
    id: '1010101',
    poolParams: {
      swapFee: '0.003000000000000000',
      exitFee: '0.000000000000000000',
      smoothWeightChangeParams: null
    },
    future_pool_governor: '24h',
    totalShares: {
      denom: 'gamm/pool/1010101',
      amount: '330228752041469100486167962'
    },
    poolAssets: [
      {
        token: {
          denom:
            'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4',
          amount: '6196127370623'
        },
        weight: '357913941333333'
      },
      {
        token: {
          denom:
            'ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1',
          amount: '24164665575940'
        },
        weight: '357913941333333'
      },
      {
        token: {
          denom: 'uosmo',
          amount: '24164665575940'
        },
        weight: '357913941333333'
      }
    ],
    totalWeight: '1073741824000000'
  }
];

const myCases = [
  {
    name: 'simple',
    balances: [
      {
        // "price": 36.63,
        symbol: 'ATOM',
        amount: 0.29
      },
      {
        // "price": 1.81,
        symbol: 'AKT',
        amount: 3
      }
    ],
    poolId: '4'
  },
  {
    name: 'complex',
    balances: [
      {
        // "price": 1.81,
        symbol: 'AKT',
        amount: 3
      },
      {
        // "price": 0.366689,
        symbol: 'CRO',
        amount: 3
      },
      {
        // "price": 9.1,
        symbol: 'OSMO',
        amount: 3
      }
    ],
    poolId: '1010101'
  }
];

const prices = convertGeckoPricesToDenomPriceHash(pricesFixture);
cases(
  'balances',
  (opts) => {
    const balances = symbolsAndDisplayValuesToCoinsArray(opts.balances);
    expect(balances).toMatchSnapshot();
    expect(
      balances.map((coin) => {
        const symbol = osmoDenomToSymbol(coin.denom);
        return {
          symbol,
          value: baseUnitsToDollarValue(prices, symbol, coin.amount),
          price: prices[coin.denom]
        };
      })
    ).toMatchSnapshot();
  },
  myCases
);

cases(
  'joins',
  (opts) => {
    const balances = symbolsAndDisplayValuesToCoinsArray(opts.balances);
    const pool = poolsFixture.pools
      .concat(fakePools)
      .find((pool) => pool.id == opts.poolId);
    const poolInfo = prettyPool(pool, { includeDetails: true });
    // console.log(JSON.stringify({ poolInfo }, null, 2));
    const info = calculateMaxCoinsForPool(prices, poolInfo, balances);
    expect(info).toMatchSnapshot();
  },
  myCases
);
