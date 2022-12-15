import { asset_list } from '@chain-registry/osmosis';

import {
  printOsmoTransactionResponse,
  prompt,
  promptChain,
  promptRpcEndpoint,
  promptMnemonic
} from '../utils';
import {
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue,
  dollarValueToDenomUnits,
  getPrice,
  lookupRoutesForTrade,
  calculateAmountWithSlippage,
  osmoDenomToSymbol,
  symbolToOsmoDenom,
  noDecimals,
  getPoolsPricesPairs
} from '@cosmology/core';
import { Dec } from '@keplr-wallet/unit';

import { signAndBroadcast, getOfflineSignerAmino } from 'cosmjs-utils';
import { FEES, osmosis, getSigningOsmosisClient } from 'osmojs';

const {
  swapExactAmountIn
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

const list = asset_list.assets;

const assetList = list
  .reduce((m, v) => [...m, v.symbol], [])
  .sort();

export default async (argv) => {
  argv.chainToken = 'OSMO';

  const { mnemonic } = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);
  // END PROMPTS

  const client = await osmosis.ClientFactory.createRPCQueryClient({ rpcEndpoint });
  const signer = await getOfflineSignerAmino({ mnemonic, chain });

  const {
    pools,
    prices,
    pairs
  } = await getPoolsPricesPairs(client);

  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const [account] = await signer.getAccounts();
  const { address } = account;

  const accountBalances = await client.cosmos.bank.v1beta1.allBalances({
    address: account.address
  });

  const availableChoices = accountBalances.balances
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
          name: `${symbol} (${displayAmount})`,
          value: symbol

        };
      } catch (e) {
        return {
          name: `${symbol} [${amount}]`,
          value: symbol
        }
      }
    })
    .filter(Boolean);


  const balances = accountBalances.balances
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



  const { sell } = await prompt(
    [
      {
        type: 'list',
        name: 'sell',
        message: 'choose token to sell',
        choices: availableChoices
      }
    ],
    argv
  );

  const { buy } = await prompt(
    [
      {
        type: 'list',
        name: 'buy',
        message: 'choose token to buy',
        choices: assetList
      }
    ],
    argv
  );
  if (Array.isArray(sell)) throw new Error('only atomic swaps right now.');
  if (Array.isArray(buy)) throw new Error('only atomic swaps right now.');

  const tokenInBal = accountBalances.balances.find(({ denom, amount }) => {
    return osmoDenomToSymbol(denom) == sell;
  });

  const usdValue = baseUnitsToDollarValue(prices, sell, tokenInBal.amount);

  // stub
  if (argv.all) argv.value = usdValue;
  const { value } = await prompt(
    [
      {
        type: 'number',
        name: 'value',
        message: `how much ${sell} to sell in USD? $USD (${usdValue})`,
        default: usdValue
      }
    ],
    argv
  );

  const { slippage } = await prompt(
    [
      {
        type: 'number',
        name: 'slippage',
        message: `how much slippage %`,
        default: 1
      }
    ],
    argv
  );

  const tokenInPrice = getPrice(prices, sell);
  const tokenInAmount = argv.all
    ? balances.find((a) => a.symbol === sell).amount
    : dollarValueToDenomUnits(prices, sell, value);
  const tokenOutPrice = getPrice(prices, buy);
  const tokenOutAmount = dollarValueToDenomUnits(prices, buy, value);
  const tokenOutAmountWithSlippage = calculateAmountWithSlippage(
    tokenOutAmount,
    slippage
  );

  const tokenInValue = baseUnitsToDollarValue(prices, sell, tokenInAmount);
  const tokenOutValue = baseUnitsToDollarValue(
    prices,
    buy,
    tokenOutAmountWithSlippage
  );

  const tokenIn = {
    denom: symbolToOsmoDenom(sell),
    symbol: sell,
    amount: tokenInAmount,
    displayAmount: baseUnitsToDisplayUnits(sell, tokenInAmount),
    tokenInPrice,
    tokenInValue
  };

  const tokenOut = {
    denom: symbolToOsmoDenom(buy),
    symbol: buy,
    amount: tokenOutAmountWithSlippage,
    displayAmount: baseUnitsToDisplayUnits(buy, tokenOutAmountWithSlippage),
    tokenOutPrice,
    tokenOutValue
  };

  const routes = lookupRoutesForTrade({
    pools,
    trade: {
      sell: {
        denom: tokenIn.denom,
        amount: tokenInAmount
      },
      buy: {
        denom: tokenOut.denom,
        amount: tokenOutAmount
      },
      beliefValue: value
    },
    pairs
  }).map((tradeRoute) => {
    const {
      poolId,
      tokenOutDenom
      // tokenOutSymbol,
      // tokenInSymbol,
      // liquidity
    } = tradeRoute;

    return {
      poolId,
      tokenOutDenom
    };
  });

  // TX


  const fee = FEES.osmosis.swapExactAmountIn(argv.fee || 'low');
  const msg = swapExactAmountIn({
    sender: address,
    routes,
    tokenIn: {
      denom: tokenIn.denom,
      // TODO: use { coin } from '@cosmjs/amino' e.g. coin(num, denom)
      amount: noDecimals(tokenIn.amount)
    },
    tokenOutMinAmount: noDecimals(tokenOut.amount)
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
    msgs: [msg],
    fee,
    memo: ''
  });

  printOsmoTransactionResponse(res);
};
