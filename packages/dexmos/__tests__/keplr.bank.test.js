import prices from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import bank from '../__fixtures__/keplr/bank/balances/osmo1x/data.json';

describe('can read osmosis pool info', () => {
  it('bank', async () => {
    console.log(prices);
    console.log(bank);
  });
});
