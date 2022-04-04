import { chains } from '@cosmology/cosmos-registry';
import { prompt } from '../utils';
import { osmoRestClient } from '../utils';
import { getSigningOsmosisClient } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcast } from '../messages/utils';
import {
  printSwap,
  printSwapForPoolAllocation,
  printOsmoTransactionResponse
} from '../utils/print';

const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;

export default async (argv) => {
  const { client, wallet: signer } = await osmoRestClient(argv);
  const [account] = await signer.getAccounts();

  const accountBalances = await client.getBalances(account.address);

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
  const { msg, fee } = messages.lockTokens({
    owner: account.address,
    coins,
    duration
  });

  if (argv.verbose) {
    console.log(JSON.stringify(msg, null, 2));
  }

  const accounts = await signer.getAccounts();
  const osmoAddress = accounts[0].address;
  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  });

  const res = await signAndBroadcast({
    client: stargateClient,
    chainId: osmoChainConfig.chain_id,
    address: osmoAddress,
    msg,
    fee,
    memo: ''
  });

  printOsmoTransactionResponse(res);
};
