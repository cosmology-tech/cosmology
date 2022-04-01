import { chains, assets } from '@cosmology/cosmos-registry';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import { prompt } from '../utils';
import { OsmosisApiClient } from '..';
import { OsmosisValidatorClient } from '../clients/validator';
import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import { getSigningOsmosisClient, noDecimals } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcastBatch } from '../messages/utils';
import {
  convertWeightsIntoCoins,
  osmoDenomToSymbol,
  convertCoinsToDisplayValues,
  getTradesRequiredToGetBalances,
  getSwaps,
  substractCoins,
  calculateAmountWithSlippage,
  getSellableBalance
} from '../utils/osmo';
import c from 'ansi-colors';
import { getPricesFromCoinGecko } from '../clients/coingecko';

const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;

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

  let balances = await getSellableBalance({
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

  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  });

  const accounts = await signer.getAccounts();
  const osmoAddress = accounts[0].address;

  // get pricing and pools info...

  const pairs = await validator.getPairsSummary();
  const prices = await getPricesFromCoinGecko();
  const pools = await api.getPoolsPretty();

  const result = convertWeightsIntoCoins({ weights, pools, prices, balances });

  // pools

  const msgs = [];
  let feeCalc;

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
    const swaps = await getSwaps({ pools, trades, pairs: pairs.data });
    balances = substractCoins(balances, coinsToSubstract);

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

      feeCalc = fee;
      msgs.push(msg);
    }
  }

  console.log(JSON.stringify(msgs, null, 2));

  const gasUsed = await stargateClient.simulate(osmoAddress, msgs, '');
  feeCalc.gas = new IntPretty(new Dec(gasUsed).mul(new Dec(1.3)))
    .maxDecimals(0)
    .locale(false)
    .toString();

  console.log(feeCalc);

  const res = await signAndBroadcastBatch({
    client: stargateClient,
    chainId: osmoChainConfig.chain_id,
    address: osmoAddress,
    msgs,
    fee: feeCalc,
    memo: ''
  });
  console.log(res);
};
