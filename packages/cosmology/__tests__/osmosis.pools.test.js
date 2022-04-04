// @ts-nocheck
import validatorPricesFixture from '../__fixtures__/validator/tokens/v2/all/data.json';
import pairsFixture from '../__fixtures__/validator/pairs/v1/summary/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import lockedPoolsFixture from '../__fixtures__/lcd/osmosis/lockup/v1beta1/account_locked_coins/osmo1/data.json';
import pricesFixture from '../__fixtures__/coingecko/api/v3/simple/price/data.json';

import {
  makeLcdPoolPretty,
  convertGeckoPricesToDenomPriceHash,
  makePoolPairs
} from '../src/utils/osmo';
import { OsmosisApiClient } from '../__fixtures__/clients/api';

const api = new OsmosisApiClient();
const prices = convertGeckoPricesToDenomPriceHash(pricesFixture);

it('pools', async () => {
  const lcdPools = await api.getPools();
  const pretty = makeLcdPoolPretty(prices, lcdPools.pools[0]);
  expect(pretty).toMatchSnapshot();
});

it('pairs', async () => {
  const lcdPools = await api.getPools();
  const pretty = makeLcdPoolPretty(prices, lcdPools.pools[0]);
  const pairs = makePoolPairs([pretty]);
  console.log(pairs);
});
