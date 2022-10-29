import {
  printOsmoTransactionResponse,
  prompt,
  promptChain,
  promptMnemonic,
  promptRpcEndpoint,
} from '../utils';

import { signAndBroadcast, getOfflineSignerAmino } from 'cosmjs-utils';
import { FEES, osmosis, getSigningOsmosisClient } from 'osmojs';

const {
  lockTokens
} = osmosis.lockup.MessageComposer.withTypeUrl;

export default async (argv) => {
  argv.chainToken = 'OSMO';

  const { mnemonic } = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);
  // END PROMPTS

  const client = await osmosis.ClientFactory.createRPCQueryClient({ rpcEndpoint });
  const signer = await getOfflineSignerAmino({ mnemonic, chain });

  const [account] = await signer.getAccounts();
  const { address } = account;
  const accountBalances = await client.cosmos.bank.v1beta1.allBalances({
    address: account.address
  })

  const gammTokens = accountBalances.balances
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

  // don't use ===, instead use == for string or num...
  const coins = [gammTokens.find((gamm) => gamm.poolId == poolId)].map(
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

  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  })

  const res = await signAndBroadcast({
    client: stargateClient,
    chainId: chain.chain_id,
    address,
    msgs: [msg],
    fee,
    memo: ''
  });

  printOsmoTransactionResponse(res);
};
