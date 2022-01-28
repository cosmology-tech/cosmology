import { osmoRpcClient } from '../utils';
import { signAndBroadcast, messages } from '../messages';
import { coin } from '@cosmjs/amino';

export default async (argv) => {
  const { client, wallet } = await osmoRpcClient(argv);
  const [account] = await wallet.getAccounts();

  try {

    const address = account.address;
    // const { msg, fee } = messages.joinPool({
    //   poolId: '1',
    //   sender: address,
    //   shareOutAmount: "13157466224975180883",
    //   tokenInMaxs: [
    //     coin("256259", 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'),
    //     coin("976907", 'uosmo')
    //   ]
    // });
    const { msg, fee } = messages.joinPool({
      poolId: '606',
      sender: address,
      shareOutAmount: '101010101',
      tokenInMaxs: [
        coin(10248, 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'),
        coin(64837969, 'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228')
      ]
    });

    console.log({ chainId: argv.chainId, address, msg, fee });
    console.log(JSON.stringify({ msg }, null, 2));
    const res = await signAndBroadcast({ client, chainId:argv.chainId, address, msg, fee });

    console.log(res);
  } catch (e) {
    console.log('error ' + e);
  }
};
