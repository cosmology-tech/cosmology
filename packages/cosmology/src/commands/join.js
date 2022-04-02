import { chains } from '@cosmology/cosmos-registry';
import { coin } from '@cosmjs/amino';
import { prompt } from '../utils';
import { OsmosisApiClient } from '../clients/osmosis';
import { OsmosisValidatorClient } from '../clients/validator';
import { osmoRestClient } from '../utils';
import {
  calculateShareOutAmount,
  calculateCoinsNeededInPoolForValue,
  calculateMaxCoinsForPool
} from '../utils/osmo';
import { getSigningOsmosisClient } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcast } from '../messages/utils';
import { getPools } from '../utils/prompt';
import { getPricesFromCoinGecko } from '../clients/coingecko';
import {
  printSwap,
  printSwapForPoolAllocation,
  printOsmoTransactionResponse
} from '../utils/print';

const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;

export default async (argv) => {
  const validator = new OsmosisValidatorClient();
  const api = new OsmosisApiClient();
  const { client, wallet: signer } = await osmoRestClient(argv);
  const [account] = await signer.getAccounts();

  const accountBalances = await client.getBalances(account.address);
  const balances = accountBalances.result;
  // get pricing and pools info...
  const prices = await getPricesFromCoinGecko();
  //   const pools = await api.getPoolsPretty();

  const poolList = await getPools(validator, argv);
  const { poolId } = await prompt(
    [
      {
        type: 'fuzzy:objects',
        name: 'poolId',
        message: 'choose pools to invest in',
        choices: poolList
      }
    ],
    argv
  );
  if (Array.isArray(poolId)) throw new Error('only atomic joins right now.');

  const { max } = await prompt(
    [
      {
        type: 'confirm',
        name: 'max',
        message: `join pool with maximum tokens?`
      }
    ],
    argv
  );

  if (max) {
    argv.value = -1;
  }

  const { value } = await prompt(
    [
      {
        type: 'number',
        name: 'value',
        message: `how much to invest in USD?`
      }
    ],
    argv
  );

  const poolInfo = await client.getPoolPretty(poolId);
  let coinsNeeded;
  if (!max) {
    coinsNeeded = calculateCoinsNeededInPoolForValue(prices, poolInfo, value);
  } else {
    coinsNeeded = calculateMaxCoinsForPool(prices, poolInfo, balances);
  }
  const shareOutAmount = calculateShareOutAmount(poolInfo, coinsNeeded);

  const { msg, fee } = messages.joinPool({
    poolId: poolId + '', // string!
    sender: account.address,
    shareOutAmount,
    tokenInMaxs: coinsNeeded.map((c) => {
      return coin(c.amount, c.denom);
    })
  });

  console.log(JSON.stringify(msg, null, 2));

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
