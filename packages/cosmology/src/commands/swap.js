import { chains, assets } from '@cosmology/cosmos-registry';
import { printOsmoTransactionResponse, prompt } from '../utils';
import { OsmosisApiClient } from '../clients/osmosis';
import {
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue,
  dollarValueToDenomUnits,
  getPrice
} from '../utils/chain';
import { osmoRestClient } from '../utils';
import { osmoDenomToSymbol, symbolToOsmoDenom } from '../utils/osmo';
import {
  lookupRoutesForTrade,
  calculateAmountWithSlippage,
  makePoolPairs,
  makePoolsPretty
} from '../utils/osmo/utils';
import { prettyPool } from '../clients/osmosis';
import { getSigningOsmosisClient, noDecimals } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcast } from '../messages/utils';
import { getPricesFromCoinGecko } from '../clients/coingecko';

const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;

const assetList = assets
  .reduce((m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)], [])
  .sort();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const assetsList = assetList.filter(onlyUnique);

export default async (argv) => {
  const api = new OsmosisApiClient();
  const prices = await getPricesFromCoinGecko();
  const lcdPools = await api.getPools();
  const prettyPools = makePoolsPretty(prices, lcdPools.pools);
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const { client, wallet: signer } = await osmoRestClient(argv);
  const [account] = await signer.getAccounts();

  const accountBalances = await client.getBalances(account.address);
  const availableChoices = accountBalances.result.map(({ denom, amount }) => {
    const symbol = osmoDenomToSymbol(denom);
    const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
    return {
      name: `${symbol} (${displayAmount})`,
      value: symbol
    };
  });
  const balances = accountBalances.result.map(({ denom, amount }) => {
    const symbol = osmoDenomToSymbol(denom);
    return {
      symbol,
      denom,
      amount
    };
  });

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
        choices: assetsList
      }
    ],
    argv
  );
  if (Array.isArray(sell)) throw new Error('only atomic swaps right now.');
  if (Array.isArray(buy)) throw new Error('only atomic swaps right now.');

  const tokenInBal = accountBalances.result.find(({ denom, amount }) => {
    return osmoDenomToSymbol(denom) == sell;
  });

  // get pricing and pools info...
  const pairs = makePoolPairs(prettyPools);
  const pools = lcdPools.pools.map((pool) => prettyPool(pool));

  const usdValue = baseUnitsToDollarValue(prices, sell, tokenInBal.amount);

  // stub
  if (argv.all) argv.value = usdValue;
  const { value } = await prompt(
    [
      {
        type: 'number',
        name: 'value',
        message: `how much ${sell} to sell in USD? $USD (${usdValue})`
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

  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  });

  const accounts = await signer.getAccounts();
  const osmoAddress = accounts[0].address;

  const { msg, fee } = messages.swapExactAmountIn({
    sender: osmoAddress,
    routes,
    tokenIn: {
      denom: tokenIn.denom,
      // TODO: use { coin } from '@cosmjs/amino' e.g. coin(num, denom)
      amount: noDecimals(tokenIn.amount)
    },
    tokenOutMinAmount: noDecimals(tokenOut.amount)
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
};
