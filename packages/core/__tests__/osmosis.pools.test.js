// @ts-nocheck
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
  expect(pairs).toMatchSnapshot();
});
