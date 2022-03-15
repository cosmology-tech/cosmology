import { osmoRpcClient, prompt } from '../utils';
import { signAndBroadcast, messages } from '../messages';
import { coin } from '@cosmjs/amino';

export default async (argv) => {
  const { client, wallet } = await osmoRpcClient(argv);
  const [account] = await wallet.getAccounts();

  // TODO add to Osmo Client
  // https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations

  // {
  //   "lockable_durations": [
  //     "86400s",
  //     "604800s",
  //     "1209600s"
  //   ]
  // }

  const durations = [
    { name: '1 Day', value: '86400' },
    { name: '7 Days', value: '604800' },
    { name: '14 Days', value: '1209600' }
  ];

  try {
    const questions = [
      {
        type: 'list',
        name: 'duration',
        message: 'duration',
        choices: durations
      }
    ];
    let { duration } = await prompt(questions, argv);
    duration = Number(duration);
    const address = account.address;
    const { msg, fee } = messages.lockTokens({
      owner: address,
      coins: [coin('1096260487950196000000', 'gamm/pool/606')],
      duration
    });

    console.log({ chainId: argv.chainId, address, msg, fee });
    console.log(JSON.stringify({ msg }, null, 2));
    const res = await signAndBroadcast({
      client,
      chainId: argv.chainId,
      address,
      msg,
      fee
    });

    console.log(res);
  } catch (e) {
    console.log('error ' + e);
  }
};
