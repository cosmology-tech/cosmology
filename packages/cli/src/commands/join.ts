import { coin } from '@cosmjs/amino';
import {
  prompt,
  printOsmoTransactionResponse,
  promptMnemonic,
  promptChain,
  promptRestEndpoint,
  promptRpcEndpoint
} from '../utils';
import {
  calculateShareOutAmount,
  calculateCoinsNeededInPoolForValue,
  calculateMaxCoinsForPool,
  makePoolsPretty,
  makePoolsPrettyValues,
  signAndBroadcast,
  getPricesFromCoinGecko,
  prettyPool
} from '@cosmology/core';

import { FEES, osmosis, getSigningOsmosisClient } from 'osmojs';
import { getOfflineSignerAmino } from 'cosmjs-utils';

const {
  joinPool
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

export default async (argv) => {
  argv.chainToken = 'OSMO';

  const { mnemonic } = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);
  // END PROMPTS

  const client = await osmosis.ClientFactory.createLCDClient({ restEndpoint });
  const signer = await getOfflineSignerAmino({ mnemonic, chain });

  const [account] = await signer.getAccounts();
  const { address } = account;
  const prices = await getPricesFromCoinGecko();
  const lcdPools = await client.osmosis.gamm.v1beta1.pools()

  const prettyPools = makePoolsPretty(prices, lcdPools.pools);
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const poolListValues = makePoolsPrettyValues(
    prettyPools,
    argv['liquidity-limit']
  );

  const accountBalances = await client.cosmos.bank.v1beta1.allBalances({
    address
  })
  const balances = accountBalances.balances;

  const { poolId } = await prompt(
    [
      {
        type: 'fuzzy:objects',
        name: 'poolId',
        message: 'choose pools to invest in',
        choices: poolListValues
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

  const pool = await client.osmosis.gamm.v1beta1.pool({
    poolId
  })
  const poolInfo = prettyPool(pool.pool, { includeDetails: false });
  let coinsNeeded;
  if (!max) {
    coinsNeeded = calculateCoinsNeededInPoolForValue(prices, poolInfo, value);
  } else {
    coinsNeeded = calculateMaxCoinsForPool(prices, poolInfo, balances);
  }
  const shareOutAmount = calculateShareOutAmount(poolInfo, coinsNeeded);


  const fee = FEES.osmosis.joinPool(argv.fee || 'low');
  const msg = joinPool({
    poolId: poolId + '', // string!
    sender: account.address,
    shareOutAmount,
    tokenInMaxs: coinsNeeded.map((c) => {
      return coin(c.amount, c.denom);
    })
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
    msg,
    fee,
    memo: ''
  });

  printOsmoTransactionResponse(res);
};
