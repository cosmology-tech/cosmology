import { osmoRpcClient } from '../utils';
import { signAndBroadcast, messages } from '../messages';

export default async (argv) => {
  const { client, wallet } = await osmoRpcClient(argv);
  const [account] = await wallet.getAccounts();

  try {
    const address = account.address;
    const { msg, fee } = messages.swapExactAmountIn({
      sender: address,
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

    console.log({ chainId: argv.chainId, address, msg, fee });
    const res = await signAndBroadcast({ client, chainId: argv.chainId, address, msg, fee });

    console.log(res);
  } catch (e) {
    console.log('error ' + e);
  }
};
