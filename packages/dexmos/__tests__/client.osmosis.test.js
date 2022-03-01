import { OsmosisClient, OsmosisApiClient } from '../src/clients/osmosis';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

import { Secp256k1HdWallet } from '@cosmjs/launchpad';

const TEST_ADDR1 = 'osmo18scnpvh8vkdwhura6r8372v9halwmy34evxr2e';
// const client = new OsmosisClient('http://10.0.0.15:1317');

let client;
xdescribe('can fetch', () => {
  beforeAll(async () => {
    const wallet = await Secp256k1HdWallet.generate(12, { prefix: 'osmo' });
    const [{ address }] = await wallet.getAccounts();
    console.log('Address:', address);
    client = new OsmosisClient({
      wallet
    });
    await client.init();
  });
  //   xit('balances', async () => {
  //     const balances = await api.getBalances(TEST_ADDR1);
  //     console.log(balances);
  //   });
  //   xit('getPools', async () => {
  //     const pools = await api.getPools();
  //     console.log(pools);
  //   });
  it('swapExactAmountIn', async () => {
    const obj = await client.swapExactAmountIn({
      osmosisAddress: TEST_ADDR1,
      routes: [
        {
          poolId: '606',
          tokenOutDenom:
            'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
        }
      ],
      tokenIn: {
        denom:
          'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
        amount: '4091500000'
      },
      tokenOutMinAmount: '733197'
    });

    const signed = await client.sign(obj);

    console.log('obj transaction:', signed);
  });
});
