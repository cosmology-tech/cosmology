// @ts-nocheck
import validatorPricesFixture from '../__fixtures__/validator/tokens/v2/all/data.json';
import bankFixture from '../__fixtures__/lcd/bank/balances/osmo1x/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import lockedPoolsFixture from '../__fixtures__/lcd/osmosis/lockup/v1beta1/account_locked_coins/osmo1/data.json';
import { Token } from '../src/model/Token';
import { assets, chains } from '@cosmology/cosmos-registry';
import { assets as osmosisAssets } from '../src/assets';
import cases from 'jest-in-case';
import {
  displayUnitsToDenomUnits,
  baseUnitsToDisplayUnits,
  getOsmosisSymbolIbcName
} from '../src/utils';
import Long from 'long';
import {
  getCoinGeckoIdForSymbol,
  getSymbolForCoinGeckoId,
  osmoDenomToSymbol,
  symbolToOsmoDenom,
  OsmosisToken,
  convertCoinToDisplayValues,
  convertCoinsToDisplayValues,
  calculateCoinsTotalBalance,
  convertValidatorPricesToDenomPriceHash,
  getPoolByGammName,
  getUserPools,
  convertPoolToDisplayValues,
  convertPoolsToDisplayValues,
  getFilteredPoolsWithValues,
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances
} from '../src/utils/osmo';

cases(
  'displayUnitsToDenomUnits',
  (opts) => {
    expect(displayUnitsToDenomUnits(opts.name, opts.amount)).toEqual(
      opts.value
    );
  },
  [
    { name: 'ATOM', amount: 10, value: '10000000.0000000000000000' },
    { name: 'AKT', amount: 0.6, value: '600000.0000000000000000' },
    { name: 'OSMO', amount: 10, value: '10000000.0000000000000000' }
  ]
);

cases(
  'osmoDenomToSymbol',
  (opts) => {
    expect(osmoDenomToSymbol(opts.denom)).toBe(opts.name);
  },
  [
    {
      name: 'ATOM',
      denom:
        'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
    },
    {
      name: 'AKT',
      denom:
        'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4'
    },
    { name: 'OSMO', denom: 'uosmo' }
  ]
);

cases(
  'symbolToOsmoDenom',
  (opts) => {
    expect(symbolToOsmoDenom(opts.name)).toBe(opts.denom);
  },
  [
    {
      name: 'ATOM',
      denom:
        'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
    },
    {
      name: 'AKT',
      denom:
        'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4'
    },
    { name: 'OSMO', denom: 'uosmo' }
  ]
);

cases(
  'convertValidatorPricesToDenomPriceHash',
  (opts) => {
    expect(convertValidatorPricesToDenomPriceHash(opts.tokens)).toEqual(
      opts.hash
    );
  },
  [
    {
      name: 'test1',
      tokens: [
        {
          denom:
            'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4',
          price: 100
        },
        {
          denom:
            'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
          price: 20
        }
      ],
      hash: {
        'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4': 100,
        'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2': 20
      }
    }
  ]
);

cases(
  'getPoolByGammName',
  (opts) => {
    // const prices = convertValidatorPricesToDenomPriceHash(validatorPricesFixture)
    const prices = convertValidatorPricesToDenomPriceHash(
      validatorPricesFixture
    );
    const pools = getFilteredPoolsWithValues({
      prices,
      pools: poolsFixture.pools
    });
    expect(getPoolByGammName(pools, opts.name).id).toEqual(opts.poolId);
  },
  [
    {
      name: 'gamm/pool/1',
      poolId: '1'
    },
    {
      name: 'gamm/pool/600',
      poolId: '600'
    },
    {
      name: 'gamm/pool/606',
      poolId: '606'
    }
  ]
);

describe('basic portfolio', () => {
  const coins = symbolsAndDisplayValuesToCoinsArray([
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
  ]);

  const prices = convertValidatorPricesToDenomPriceHash(validatorPricesFixture);

  it('calculate portfolio value (balances)', () => {
    const value = calculateCoinsTotalBalance({ prices, coins });
    expect(value).toBe('2622.486070510000000000');
  });

  it('calculate pool value (global)', () => {
    const values = getFilteredPoolsWithValues({
      prices,
      pools: poolsFixture.pools
    });
    const [first, second] = values;
    expect(first).toMatchSnapshot();
    expect(second).toMatchSnapshot();
  });

  it('calculate pool value (user LP)', () => {
    const pools = getFilteredPoolsWithValues({
      prices,
      pools: poolsFixture.pools
    });
    const result = getUserPools({
      pools,
      lockedPools: lockedPoolsFixture.coins
    });
    expect(result).toMatchSnapshot();
  });
});

describe('user actions', () => {
  const balances = symbolsAndDisplayValuesToCoinsArray([
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
  ]);

  const prices = convertValidatorPricesToDenomPriceHash(validatorPricesFixture);

  it('cannot desire more value than current', async () => {
    const desired = symbolsAndDisplayValuesToCoinsArray([
      {
        symbol: 'ATOM',
        amount: 100000
      }
    ]);
    let failed = false;
    try {
      getTradesRequiredToGetBalances({ prices, balances, desired });
    } catch (e) {
      failed = true;
    }
    expect(failed).toBe(true);
  });

  it('no trades required', async () => {
    const desired = symbolsAndDisplayValuesToCoinsArray([
      {
        symbol: 'ATOM',
        amount: 10
      },
      {
        symbol: 'OSMO',
        amount: 10
      }
    ]);
    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });
    expect(trades.length).toBe(0);
  });

  it('trades required', async () => {
    const desired = symbolsAndDisplayValuesToCoinsArray([
      {
        symbol: 'AKT',
        amount: 1050
      },
      {
        symbol: 'OSMO',
        amount: 100
      }
    ]);
    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });
    console.log(JSON.stringify(trades, null, 2));
  });
});

it('convertCoinToDisplayValues', async () => {
  const prices = convertValidatorPricesToDenomPriceHash(validatorPricesFixture);
  const a = convertCoinToDisplayValues({
    prices,
    coin: {
      denom: 'uosmo',
      amount: '10000'
    }
  });
  console.log(a);
});
