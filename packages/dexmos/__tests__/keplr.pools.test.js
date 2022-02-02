import pools from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import prices from '../__fixtures__/coingecko/api/v3/simple/price/data.json';

describe('can read osmosis pool info', () => {
  it('pools', async () => {
    console.log(pools);
  });
  it('prices', async () => {
    console.log(prices);
  });
});
