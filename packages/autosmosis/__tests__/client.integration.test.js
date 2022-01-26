import { getPrice } from '../src/clients/coingecko';

describe('can fetch', () => {
  it('prices', async () => {
    const prices = await getPrice();
    console.log(prices);
  });
});
