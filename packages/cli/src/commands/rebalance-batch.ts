import { coins } from '@cosmjs/amino';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import {
  prompt,
  promptOsmoRestClient,
  promptOsmoSigningClient
} from '../utils';
import {
  baseUnitsToDisplayUnits,
  noDecimals,
  signAndBroadcastBatch,
  convertWeightsIntoCoins,
  osmoDenomToSymbol,
  convertCoinsToDisplayValues,
  getTradesRequiredToGetBalances,
  getSwaps,
  substractCoins,
  calculateAmountWithSlippage,
  getSellableBalance,
  makePoolPairs,
  makePoolsPretty,
  makePoolsPrettyValues,
  getPricesFromCoinGecko,
  prettyPool
} from '@cosmology/core';

import {
  printSwap,
  printSwapForPoolAllocation,
  printOsmoTransactionResponse
} from '../utils/print';

import { osmosis } from 'osmojs';

const {
  swapExactAmountIn
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

export default async (argv) => {
  const { client, signer } = await promptOsmoRestClient(argv);
  const { client: stargateClient } = await promptOsmoSigningClient(argv);
  const prices = await getPricesFromCoinGecko();
  const lcdPools = await client.getPools();
  const prettyPools = makePoolsPretty(prices, lcdPools.pools);
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const poolListValues = makePoolsPrettyValues(
    prettyPools,
    argv['liquidity-limit']
  );

  const [account] = await signer.getAccounts();
  const { address } = account;
  const accountBalances = await client.getBalances(address);
  const display = accountBalances.result
    .map(({ denom, amount }) => {
      if (denom.startsWith('gamm')) return;
      const symbol = osmoDenomToSymbol(denom);
      if (!symbol) {
        console.log('WARNING: cannot find ' + denom);
        return;
      }
      const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
      if (new Dec(displayAmount).lte(new Dec(0.0001))) return;
      return {
        symbol,
        denom,
        amount,
        displayAmount
      };
    })
    .filter(Boolean);

  // GET THE COINS THAT THE USER IS WILLING TO PART WITH

  const availableChoices = display.map((item) => {
    return {
      name: `${item.symbol} (${item.displayAmount})`,
      value: item.symbol
    };
  });

  let { sell } = await prompt(
    [
      {
        type: 'checkbox',
        name: 'sell',
        message:
          'select which coins in your wallet that you are willing to sell',
        choices: availableChoices
      }
    ],
    argv
  );
  if (!Array.isArray(sell)) sell = [sell];

  let balances = await getSellableBalance({
    client,
    address,
    sell
  });

  // WHICH POOLS TO INVEST?

  let { poolId } = await prompt(
    [
      {
        type: 'checkbox',
        name: 'poolId',
        message: 'choose pools to invest in',
        choices: poolListValues
      }
    ],
    argv
  );

  if (!Array.isArray(poolId)) poolId = [poolId];
  poolId = poolId.map((id) => id + ''); // toString

  // WHICH TOKENS TO INVEST?

  const poolWeightQuestions = poolId.map((p) => {
    const str = `gamm/pool/${p}`;
    const name = poolListValues.find(({ value }) => value == p + '').name;
    return {
      type: 'number',
      name: `poolWeights[${str}][weight]`,
      message: `enter weight for pool ${name} (${p})`,
      default: 1
    };
  });

  const { poolWeights } = await prompt(poolWeightQuestions, argv);

  const weights = [
    ...Object.keys(poolWeights).map((gamm) => {
      const weight = poolWeights[gamm].weight;
      return {
        denom: gamm,
        weight
      };
    })
  ];

  // get pricing and pools info...
  const pairs = makePoolPairs(prettyPools);
  const pools = lcdPools.pools.map((pool) => prettyPool(pool));

  const result = convertWeightsIntoCoins({ weights, pools, prices, balances });

  // pools

  const msgs = [];

  for (let i = 0; i < result.pools.length; i++) {
    const desired = result.pools[i].coins;

    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });

    let coinsToSubstract = trades.map((trade) => ({ ...trade.sell }));
    coinsToSubstract = convertCoinsToDisplayValues({
      prices,
      coins: coinsToSubstract
    });
    const swaps = await getSwaps({ trades, pairs: pairs });
    balances = substractCoins(balances, coinsToSubstract);

    printSwapForPoolAllocation(result.pools[i]);

    for (let s = 0; s < swaps.length; s++) {
      const swap = swaps[s];
      printSwap(swap);

      const {
        trade: { sell, buy, beliefValue },
        routes
      } = swap;

      const slippage = 1;
      const tokenOutMinAmount = calculateAmountWithSlippage(
        buy.amount,
        slippage
      );

      const msg = swapExactAmountIn({
        sender: address,
        routes,
        tokenIn: {
          denom: sell.denom,
          amount: noDecimals(sell.amount)
        },
        tokenOutMinAmount: noDecimals(tokenOutMinAmount)
      });

      msgs.push(msg);
    }
  }

  if (argv.verbose) {
    console.log(JSON.stringify(msgs, null, 2));
  }

  const memo = '';
  const gasEstimated = await stargateClient.simulate(address, msgs, memo);
  const fee = {
    amount: coins(0, 'uosmo'),
    gas: new IntPretty(new Dec(gasEstimated).mul(new Dec(1.3)))
      .maxDecimals(0)
      .locale(false)
      .toString()
  };

  const res = await signAndBroadcastBatch({
    client: stargateClient,
    chainId: argv.chainId,
    address,
    msgs,
    fee,
    memo: ''
  });

  printOsmoTransactionResponse(res);
};
