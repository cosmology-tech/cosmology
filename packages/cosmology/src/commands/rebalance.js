import { chains } from '@cosmology/cosmos-registry';
import { prompt } from '../utils';
import { OsmosisApiClient } from '..';
import { OsmosisValidatorClient } from '../clients/validator';
import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import { getSigningOsmosisClient, noDecimals } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcast } from '../messages/utils';
import {
  getSellableBalance,
  convertWeightsIntoCoins,
  osmoDenomToSymbol,
  getTradesRequiredToGetBalances,
  getSwaps,
  calculateAmountWithSlippage
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

  // WHICH TOKENS TO INVEST?

  // const assetList = assets
  //   .reduce(
  //     (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
  //     []
  //   )
  //   .sort();

  // let { token } = await prompt(
  //   [
  //     {
  //       type: 'checkbox',
  //       name: 'token',
  //       message: 'choose tokens to invest in',
  //       choices: assetList
  //     }
  //   ],
  //   argv
  // );
  // if (!Array.isArray(token)) token = [token];

  // // WEIGHTS?

  // const tokenWeightQuestions = token.map((t) => {
  //   return {
  //     type: 'number',
  //     name: `tokenWeights[${t}][weight]`,
  //     message: `enter weight for ${t}`
  //   };
  // });

  // const { tokenWeights } = await prompt(tokenWeightQuestions, argv);

  const poolWeightQuestions = poolId.map((p) => {
    const str = `gamm/pool/${p}`;
    const name = poolList.find(({ value }) => value == p + '').name;
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
    // add this back when you enable tokenWeights
    // ...Object.keys(tokenWeights).map((symbol) => {
    //   const weight = tokenWeights[symbol].weight;
    //   return {
    //     symbol,
    //     weight
    //   };
    // })
  ];

  //

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

  // console.log(result);

  // pools

  for (let i = 0; i < result.pools.length; i++) {
    const desired = result.pools[i].coins;

    balances = await getSellableBalance({ client, address, sell });

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

      if (res.code == 0) {
        console.log(`success at height: ${res.height}`);
        console.log(`TX: ${res.transactionHash}`);
        console.log(`\n`);
      } else {
        console.log('TX failed:');
        console.log(res.rawLog);
        process.exit(1);
      }
    }
  }
  //

  // DO JOIN AND LOCK HERE
  // console.log('DO JOIN AND LOCK HERE');
  // console.log(result.pools[i]);
  // const poolInfo = await client.getPoolPretty(
  // result.pools[i].denom.split('/')[2]
  // );
  // console.log(poolInfo);
  // balances = await getSellableBalance({ client, address, sell });

  // 1. what is the value? given the ratio?
  // then calculate the goods

  // const coinsNeeded = poolInfo.poolAssetsPretty.map((asset) => {
  //   const shareTotalValue = value * asset.ratio;
  //   const totalDollarValue = baseUnitsToDollarValue(
  //     prices,
  //     asset.symbol,
  //     asset.amount
  //   );
  //   const amount = dollarValueToDenomUnits(
  //     prices,
  //     asset.symbol,
  //     shareTotalValue
  //   );
  //   return {
  //     symbol: asset.symbol,
  //     denom: asset.denom,
  //     amount: noDecimals(amount),
  //     displayAmount: baseUnitsToDisplayUnits(asset.symbol, amount),
  //     shareTotalValue,
  //     totalDollarValue,
  //     unitRatio: amount / asset.amount
  //   };
  // });

  // // MARKED AS NOT DRY (copied code from join.js)

  // const shareOuts = [];

  // for (let i = 0; i < poolInfo.poolAssets.length; i++) {
  //   const tokenInAmount = new IntPretty(new Dec(coinsNeeded[i].amount));
  //   const totalShare = new IntPretty(new Dec(poolInfo.totalShares.amount));
  //   const totalShareExp = totalShare.moveDecimalPointLeft(18);
  //   const poolAssetAmount = new IntPretty(
  //     new Dec(poolInfo.poolAssets[i].token.amount)
  //   );

  //   const shareOutAmountObj = tokenInAmount
  //     .mul(totalShareExp)
  //     .quo(poolAssetAmount);
  //   const shareOutAmount = shareOutAmountObj
  //     .moveDecimalPointRight(18)
  //     .trim(true)
  //     .shrink(true)
  //     .maxDecimals(6)
  //     .locale(false)
  //     .toString();

  //   shareOuts.push(shareOutAmount);
  // }

  // const shareOutAmount = shareOuts.sort()[0];

  // const { msg, fee } = messages.joinPool({
  //   poolId: poolId + '', // string!
  //   sender: account.address,
  //   shareOutAmount,
  //   tokenInMaxs: coinsNeeded.map((c) => {
  //     return coin(c.amount, c.denom);
  //   })
  // });

  // const res = await signAndBroadcastTilTxExists({
  //   client: stargateClient,
  //   cosmos: client,
  //   chainId: osmoChainConfig.chain_id,
  //   address,
  //   msg,
  //   fee,
  //   memo: ''
  // });
  // const block = res?.tx_response?.height;

  // if (block) {
  //   console.log(`success at block ${block}`);
  // } else {
  //   console.log('no block found for tx!');
  // }
};

// coins + staking

// const trades = getTradesRequiredToGetBalances({
//   prices,
//   balances,
//   desired: result.coins
// });

// console.log('balances after coins');
// console.log(balances);

// console.log(`\nSWAPS for ${c.magenta('STAKING')}`);
// trades.forEach(({ sell, buy, beliefValue }) => {
//   if (Number(beliefValue) == 0) return; // lol why
//   actions.push({
//     type: 'coin',
//     name: buy.symbol,
//     trade: { sell, buy, beliefValue }
//   });
//   console.log(
//     `TRADE ${c.bold.yellow(
//       sell.displayAmount + ''
//     )} ($${beliefValue}) worth of ${c.bold.red(
//       sell.symbol
//     )} for ${c.bold.green(buy.symbol)}`
//   );
// });
