import {
  prompt,
  promptOsmoRestClient,
  promptOsmoSigningClient,
  printOsmoTransactionResponse
} from '../utils';
import { signAndBroadcast } from '@cosmology/core';
import { FEES, osmosis } from 'osmojs';

const {
  lockTokens
} = osmosis.lockup.MessageComposer.withTypeUrl;

export default async (argv) => {
  const { client, signer } = await promptOsmoRestClient(argv);
  const { client: stargateClient } = await promptOsmoSigningClient(argv);
  const [account] = await signer.getAccounts();
  const { address } = account;
  const accountBalances = await client.getBalances(address);

  const gammTokens = accountBalances.result
    .filter((a) => a.denom.startsWith('gamm'))
    .map((obj) => {
      return {
        ...obj,
        poolId: obj.denom.split('/')[2]
      };
    });

  if (!gammTokens.length) {
    return console.log('no gamm tokens to stake');
  }

  const { poolId } = await prompt(
    [
      {
        type: 'list',
        name: 'poolId',
        message: 'choose pools to invest in',
        choices: gammTokens.map((gamm) => {
          return gamm.poolId;
        })
      }
    ],
    argv
  );

  if (Array.isArray(poolId)) throw new Error('only atomic joins right now.');

  let { duration } = await prompt(
    [
      {
        type: 'list',
        name: 'duration',
        message: 'unbonding duration (days)',
        choices: [14, 7, 1]
      }
    ],
    argv
  );

  switch (duration) {
    case 1:
    case '1':
      duration = '86400';
      break;
    case 7:
    case '7':
      duration = '604800';
      break;
    default:
      duration = '1209600';
      break;
  }

  const coins = [gammTokens.find((gamm) => gamm.poolId === poolId)].map(
    ({ denom, amount }) => ({ amount, denom })
  );

  const fee = FEES.osmosis.lockTokens(argv.fee || 'low');
  const msg = lockTokens({
    owner: account.address,
    coins,
    duration
  });

  if (argv.verbose) {
    console.log(JSON.stringify(msg, null, 2));
  }

  const res = await signAndBroadcast({
    client: stargateClient,
    chainId: argv.chainId,
    address,
    msg,
    fee,
    memo: ''
  });

  printOsmoTransactionResponse(res);
};
