import { chains } from '@cosmology/cosmos-registry';
import { coin } from '@cosmjs/amino';
import { prompt } from '../utils';
import { OsmosisApiClient } from '..';
import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import { getSigningOsmosisClient, noDecimals } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcast } from '../messages/utils';
import {
  convertWeightsIntoCoins,
  osmoDenomToSymbol,
  getTradesRequiredToGetBalances,
  getSwaps,
  calculateMaxCoinsForPool,
  calculateShareOutAmount,
  calculateAmountWithSlippage,
  getSellableBalance,
  makePoolPairs,
  makePoolsPretty,
  makePoolsPrettyValues
} from '../utils/osmo';
import { prettyPool } from '../clients/osmosis';
import { getPricesFromCoinGecko } from '../clients/coingecko';
import {
  printSwap,
  printSwapForPoolAllocation,
  printOsmoTransactionResponse
} from '../utils/print';
import { Dec } from '@keplr-wallet/unit';

const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;
const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export default async (argv) => {
  const api = new OsmosisApiClient();
  const prices = await getPricesFromCoinGecko();
  const lcdPools = await api.getPools();
  const prettyPools = makePoolsPretty(prices, lcdPools.pools);
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const poolListValues = makePoolsPrettyValues(
    prettyPools,
    argv['liquidity-limit']
  );

  const { client, wallet: signer } = await osmoRestClient(argv);
  const [account] = await signer.getAccounts();
  const address = account.address;
  const accountBalances = await client.getBalances(account.address);
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

  //

  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  });

  const accounts = await signer.getAccounts();
  const osmoAddress = accounts[0].address;

  // get pricing and pools info...
  const pairs = makePoolPairs(prettyPools);
  const pools = lcdPools.pools.map((pool) => prettyPool(pool));

  const result = convertWeightsIntoCoins({ weights, pools, prices, balances });

  // pools

  for (let i = 0; i < result.pools.length; i++) {
    const desired = result.pools[i].coins;

    balances = await getSellableBalance({ client, address, sell });

    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });

    const swaps = await getSwaps({ trades, pairs });

    printSwapForPoolAllocation(result.pools[i]);

    for (let s = 0; s < swaps.length; s++) {
      const swap = swaps[s];

      printSwap(swap);

      const {
        trade: { sell, buy },
        routes
      } = swap;

      const tokenOutMinAmount = calculateAmountWithSlippage(
        buy.amount,
        slippage
      );

      const { msg, fee } = messages.swapExactAmountIn({
        sender: osmoAddress,
        routes,
        tokenIn: {
          denom: sell.denom,
          amount: noDecimals(sell.amount)
        },
        tokenOutMinAmount: noDecimals(tokenOutMinAmount)
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
    }

    // JOIN
    const poolId = result.pools[i].denom.split('/')[2];
    const poolInfo = await client.getPoolPretty(poolId);

    await sleep(2000);
    const accountBalances = await client.getBalances(account.address);

    // pass all balances in! NOT the scoped version... you need all your coins!
    const coinsNeeded = calculateMaxCoinsForPool(
      prices,
      poolInfo,
      accountBalances.result
    );
    const shareOutAmount = calculateShareOutAmount(poolInfo, coinsNeeded);

    const { msg, fee } = messages.joinPool({
      poolId,
      sender: osmoAddress,
      shareOutAmount,
      tokenInMaxs: coinsNeeded.map((c) => {
        return coin(c.amount, c.denom);
      })
    });

    console.log(JSON.stringify(msg, null, 2));

    const res = await signAndBroadcast({
      client: stargateClient,
      chainId: osmoChainConfig.chain_id,
      address: osmoAddress,
      msg,
      fee,
      memo: ''
    });

    printOsmoTransactionResponse(res);

    // LOCK

    // get balances again for gamm
    await sleep(3000);
    const newBalances = await client.getBalances(account.address);

    const gammTokens = newBalances.result
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

    const coins = [gammTokens.find((gamm) => gamm.poolId === poolId)].map(
      ({ denom, amount }) => ({ amount, denom })
    );
    const lockInfo = messages.lockTokens({
      owner: account.address,
      coins,
      duration: '1209600'
    });

    const lockRes = await signAndBroadcast({
      client: stargateClient,
      chainId: osmoChainConfig.chain_id,
      address: osmoAddress,
      msg: lockInfo.msg,
      fee: lockInfo.fee,
      memo: ''
    });

    printOsmoTransactionResponse(lockRes);
  }
};
