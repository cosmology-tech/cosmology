import { chains, assets } from '@cosmology/cosmos-registry';
import { coin } from '@cosmjs/amino';
import { Dec } from '@keplr-wallet/unit';
import { prompt } from '../utils';
import { OsmosisApiClient } from '..';
import { OsmosisValidatorClient } from '../clients/validator';
import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import { getSigningOsmosisClient, noDecimals } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcast } from '../messages/utils';

import {
  convertWeightsIntoCoins,
  convertValidatorPricesToDenomPriceHash,
  osmoDenomToSymbol,
  getTradesRequiredToGetBalances,
  getSwaps,
  calculateMaxCoinsForPool,
  calculateShareOutAmount,
  calculateAmountWithSlippage
} from '../utils/osmo';
import c from 'ansi-colors';

const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;
const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const getAvailableBalance = async ({ client, address, sell }) => {
  const accountBalances = await client.getBalances(address);
  return accountBalances.result
    .map(({ denom, amount }) => {
      const symbol = osmoDenomToSymbol(denom);
      const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
      if (new Dec(displayAmount).lt(new Dec(0.00001))) return;
      if (!sell.includes(symbol)) return;
      return {
        symbol,
        denom,
        amount,
        displayAmount
      };
    })
    .filter(Boolean);
};

export default async (argv) => {
  const validator = new OsmosisValidatorClient();
  const api = new OsmosisApiClient();

  const getPools = async (argv) => {
    const pools = await validator.getPools();
    return Object.keys(pools)
      .map((poolId) => {
        if (pools[poolId][0].liquidity > argv['liquidity-limit']) {
          return {
            name: pools[poolId].map((a) => a.symbol).join('/'),
            value: poolId
          };
        }
      })
      .filter(Boolean);
  };

  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;

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

  let balances = await getAvailableBalance({
    client,
    address,
    sell
  });

  // WHICH POOLS TO INVEST?

  const poolList = await getPools(argv);
  let { poolId } = await prompt(
    [
      {
        type: 'checkbox',
        name: 'poolId',
        message: 'choose pools to invest in',
        choices: poolList
      }
    ],
    argv
  );

  if (!Array.isArray(poolId)) poolId = [poolId];
  poolId = poolId.map((id) => id + ''); // toString

  // WHICH TOKENS TO INVEST?

  const assetList = assets
    .reduce(
      (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
      []
    )
    .sort();

  const poolWeightQuestions = poolId.map((p) => {
    const str = `gamm/pool/${p}`;
    const name = poolList.find(({ value }) => value == p + '').name;
    return {
      type: 'number',
      name: `poolWeights[${str}][weight]`,
      message: `enter weight for pool ${name} (${p})`
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

  const allTokens = await validator.getTokens();
  const pairs = await validator.getPairsSummary();
  const prices = convertValidatorPricesToDenomPriceHash(allTokens);
  const pools = await api.getPoolsPretty();

  const result = convertWeightsIntoCoins({ weights, pools, prices, balances });

  // pools

  for (let i = 0; i < result.pools.length; i++) {
    const desired = result.pools[i].coins;

    balances = await getAvailableBalance({ client, address, sell });

    const trades = getTradesRequiredToGetBalances({
      prices,
      balances,
      desired
    });

    const swaps = await getSwaps({ pools, trades, pairs: pairs.data });

    console.log(`\nSWAPS for ${c.bold.magenta(result.pools[i].name)}`);

    for (let s = 0; s < swaps.length; s++) {
      const swap = swaps[s];
      const {
        trade: { sell, buy, beliefValue },
        routes
      } = swap;

      console.log(
        `TRADE ${c.bold.yellow(
          sell.displayAmount + ''
        )} ($${beliefValue}) worth of ${c.bold.red(
          sell.symbol
        )} for ${c.bold.green(buy.symbol)}`
      );
      const r = routes
        .map((r) => [r.tokenInSymbol, r.tokenOutSymbol].join('->'))
        .join(', ')
        .toLowerCase();
      console.log(c.gray(`  routes: ${r}`));

      const slippage = 1;
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

      await signAndBroadcast({
        client: stargateClient,
        chainId: osmoChainConfig.chain_id,
        address: osmoAddress,
        msg,
        fee,
        memo: ''
      });
    }

    // JOIN
    const poolId = result.pools[i].denom.split('/')[2];
    const poolInfo = await client.getPoolPretty(poolId);

    await sleep(1500);
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

    if (res.transactionHash) {
      console.log(`tx hash ${res.transactionHash}`);
    } else {
      console.log('no tx found!');
    }

    console.log('\n\n\n\n\ntx');
    console.log(res);

    // LOCK

    // get balances again for gamm
    await sleep(2000);
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
      duration: '1209600000'
    });

    const lockRes = await signAndBroadcast({
      client: stargateClient,
      chainId: osmoChainConfig.chain_id,
      address: osmoAddress,
      msg: lockInfo.msg,
      fee: lockInfo.fee,
      memo: ''
    });

    if (lockRes.transactionHash) {
      console.log(`tx hash ${lockRes.transactionHash}`);
    } else {
      console.log('no tx found!');
    }
    console.log('\n\n\n\n\ntx');
    console.log(lockRes);
  }
};
