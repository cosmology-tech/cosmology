import { getPrices } from '../src/clients/coingecko';

describe('can fetch', () => {
  it('prices', async () => {
    const prices = await getPrices();
    console.log(prices);
  });
});
