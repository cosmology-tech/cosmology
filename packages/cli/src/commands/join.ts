import { coin } from '@cosmjs/amino';
import {
  prompt,
  promptOsmoRestClient,
  promptOsmoSigningClient,
  printOsmoTransactionResponse
} from '../utils';
import {
  calculateShareOutAmount,
  calculateCoinsNeededInPoolForValue,
  calculateMaxCoinsForPool,
  makePoolsPretty,
  makePoolsPrettyValues,
  messages,
  signAndBroadcast,
  getPricesFromCoinGecko
} from '@cosmology/core';

import { FEES } from 'osmojs';

export default async (argv) => {
  const { client, signer } = await promptOsmoRestClient(argv);
  const { client: stargateClient } = await promptOsmoSigningClient(argv);
  const [account] = await signer.getAccounts();
  const { address } = account;
  const prices = await getPricesFromCoinGecko();
  const lcdPools = await client.getPools();
  const prettyPools = makePoolsPretty(prices, lcdPools.pools);
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const poolListValues = makePoolsPrettyValues(
    prettyPools,
    argv['liquidity-limit']
  );

  const accountBalances = await client.getBalances(address);
  const balances = accountBalances.result;

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

  const poolInfo = await client.getPoolPretty(poolId);
  let coinsNeeded;
  if (!max) {
    coinsNeeded = calculateCoinsNeededInPoolForValue(prices, poolInfo, value);
  } else {
    coinsNeeded = calculateMaxCoinsForPool(prices, poolInfo, balances);
  }
  const shareOutAmount = calculateShareOutAmount(poolInfo, coinsNeeded);


  const fee = FEES.osmosis.joinPool(argv.fee || 'low');
  const msg = messages.joinPool({
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
