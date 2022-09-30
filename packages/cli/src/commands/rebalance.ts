import {
  prompt,
  printSwap,
  printSwapForPoolAllocation,
  printOsmoTransactionResponse,
  promptMnemonic,
  promptChain,
  promptRpcEndpoint
} from '../utils';
import {
  baseUnitsToDisplayUnits,
  calculateAmountWithSlippage,
  convertWeightsIntoCoins,
  getPricesFromCoinGecko,
  getSellableBalanceTelescopeVersion,
  getSwaps,
  getTradesRequiredToGetBalances,
  makePoolPairs,
  makePoolsPretty,
  makePoolsPrettyValues,
  noDecimals,
  osmoDenomToSymbol,
  prettyPool,
  signAndBroadcast
} from '@cosmology/core';
import { Dec } from '@keplr-wallet/unit';
import Long from 'long';

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

  const rpcPools = await client.osmosis.gamm.v1beta1.pools({
    pagination: {
      key: new Uint8Array(),
      offset: Long.fromNumber(0),
      limit: Long.fromNumber(1500),
      countTotal: false,
      reverse: false
    }
  });
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
  });


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

  if (argv.all) {
    argv.sell = display.map((item) => item.symbol);
  }

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

  Object.keys(argv).filter(a => a.startsWith('pool-')).forEach(poolWeight => {
    if (typeof argv.poolId === 'undefined') {
      argv.poolId = [];
    } else if (argv.poolId && !Array.isArray(argv.poolId)) {
      argv.poolId = [argv.poolId];
    }
    argv.poolId.push(poolWeight.split('-')[1]);
  });


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

  const { slippage } = await prompt(
    [
      {
        type: 'number',
        name: 'slippage',
        message: `how much slippage %`,
        default: 1.5
      }
    ],
    argv
  );

  if (poolId.length === 1) {
    argv[`pool-${poolId[0]}`] = 1;
  }

  const poolWeightQuestions = poolId.map((p) => {
    const name = poolListValues.find(({ value }) => value == p + '').name;
    return {
      type: 'number',
      name: `pool-${p}`,
      message: `enter weight for pool ${name} (${p})`,
      default: 1
    };
  });

  const newArgv = await prompt(poolWeightQuestions, argv);
  const poolWeights = Object.keys(newArgv).filter(a => a.startsWith('pool-'))
  const weights = [
    ...poolWeights.map((key) => {
      const poolId = key.split('-')[1];
      const weight = newArgv[key];
      return {
        denom: `gamm/pool/${poolId}`,
        weight
      };
    })
  ];

  // get pricing and pools info...
  const pairs = makePoolPairs(prettyPools);
  const pools = rawPools.map((pool) => prettyPool(pool));
  const result = convertWeightsIntoCoins({ weights, pools, prices, balances });

  // pools

  for (let i = 0; i < result.pools.length; i++) {
    const desired = result.pools[i].coins;

    balances = await getSellableBalanceTelescopeVersion({ client, address, sell });

    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });

    const swaps = await getSwaps({ trades, pairs });

    printSwapForPoolAllocation(result.pools[i]);

    // console.log(`\nSWAPS for ${c.bold.magenta(result.pools[i].name)}`);

    for (let s = 0; s < swaps.length; s++) {
      const swap = swaps[s];
      printSwap(swap);

      const {
        trade: { sell, buy, beliefValue },
        routes
      } = swap;

      const tokenOutMinAmount = calculateAmountWithSlippage(
        buy.amount,
        slippage
      );

      const fee = FEES.osmosis.swapExactAmountIn(argv.fee || 'low');
      const msg = swapExactAmountIn({
        sender: address,
        routes,
        tokenIn: {
          denom: sell.denom,
          amount: noDecimals(sell.amount)
        },
        tokenOutMinAmount: noDecimals(tokenOutMinAmount)
      });

      if (argv.verbose) {
        console.log(JSON.stringify(msg, null, 2));
      }

      const stargateClient = await getSigningOsmosisClient({
        rpcEndpoint,
        signer
      });

      const res = await signAndBroadcast({
        client: stargateClient,
        chainId: chain.chain_id,
        address: address,
        msg,
        fee,
        memo: ''
      });

      printOsmoTransactionResponse(res);
    }
  }
};

