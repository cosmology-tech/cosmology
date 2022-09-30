import { coins } from '@cosmjs/amino';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import {
  prompt,
  promptChain,
  promptMnemonic,
  promptRpcEndpoint
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
  makePoolPairs,
  makePoolsPretty,
  makePoolsPrettyValues,
  getPricesFromCoinGecko,
  prettyPool,
  getSellableBalanceTelescopeVersion
} from '@cosmology/core';

import {
  printSwap,
  printSwapForPoolAllocation,
  printOsmoTransactionResponse
} from '../utils/print';

import { FEES, osmosis, getSigningOsmosisClient } from 'osmojs';
import { getOfflineSignerAmino } from 'cosmjs-utils';

const {
  swapExactAmountIn
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

export default async (argv) => {
  argv.chainToken = 'OSMO';

  const { mnemonic } = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);

  const client = await osmosis.ClientFactory.createRPCQueryClient({ rpcEndpoint });
  const signer = await getOfflineSignerAmino({ mnemonic, chain });

  const rpcPools = await client.osmosis.gamm.v1beta1.pools();
  const rawPools = rpcPools.pools.map(({ value }) => {
    return osmosis.gamm.v1beta1.Pool.decode(value);
  });

  const prices = await getPricesFromCoinGecko();

  const prettyPools = makePoolsPretty(prices, rawPools);
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const poolListValues = makePoolsPrettyValues(
    prettyPools,
    argv['liquidity-limit']
  );

  const [account] = await signer.getAccounts();
  const { address } = account;

  const accountBalances = await client.cosmos.bank.v1beta1.allBalances({
    address
  })

  const display = accountBalances.balances
    .map(({ denom, amount }) => {
      if (denom.startsWith('gamm')) return;
      const symbol = osmoDenomToSymbol(denom);
      if (!symbol) {
        console.log('WARNING: cannot find ' + denom);
        return;
      }
      try {
        const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
        if (new Dec(displayAmount).lte(new Dec(0.0001))) return;
        return {
          symbol,
          denom,
          amount,
          displayAmount
        };
      } catch (e) {
        return {
          symbol,
          denom,
          amount,
          displayAmount: amount
        }
      }
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

  let balances = await getSellableBalanceTelescopeVersion({
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
  const pools = rawPools.map((pool) => prettyPool(pool));
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

  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  });

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
    chainId: chain.chain_id,
    address,
    msgs,
    fee,
    memo: ''
  });

  printOsmoTransactionResponse(res);
};
