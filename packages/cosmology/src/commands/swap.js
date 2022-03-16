import { chains } from '@cosmology/cosmos-registry';
import { assets } from '@cosmology/cosmos-registry';
import { prompt } from '../utils';
import { OsmosisApiClient } from '../clients/osmosis';
import { OsmosisValidatorClient } from '../clients/validator';
import {
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue,
  dollarValueToDenomUnits,
  getPrice
} from '../utils/chain';
import { osmoRestClient } from '../utils';
import {
  convertValidatorPricesToDenomPriceHash,
  osmoDenomToSymbol,
  symbolToOsmoDenom
} from '../utils/osmo';

import { lookupRoutesForTrade } from '../utils/osmo/utils';
import { getSigningOsmosisClient } from '../messages/utils';
import { messages } from '../messages/messages';
import { signAndBroadcastTilTxExists } from '../messages/utils';

const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
// const restEndpoint = osmoChainConfig.apis.rest[0].address;
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;

const assetList = assets
  .reduce((m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)], [])
  .sort();

export default async (argv) => {
  const validator = new OsmosisValidatorClient();
  const api = new OsmosisApiClient();
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

  const { sell } = await prompt(
    [
      {
        type: 'list',
        name: 'sell',
        message:
          'select which coins in your wallet that you are willing to sell',
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
        message: 'choose token to buy in',
        choices: assetList
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
  const allTokens = await validator.getTokens();
  const pairs = await validator.getPairsSummary();
  const prices = convertValidatorPricesToDenomPriceHash(allTokens);
  const pools = await api.getPoolsPretty();

  const usdValue = baseUnitsToDollarValue(prices, sell, tokenInBal.amount);

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
  const tokenInAmount = dollarValueToDenomUnits(prices, sell, value);
  const tokenOutPrice = getPrice(prices, buy);
  const tokenOutAmount = dollarValueToDenomUnits(prices, buy, value);
  const tokenOutAmountWithSlippage =
    Number(tokenOutAmount) * ((100 - slippage) / 100);

  const tokenIn = {
    denom: symbolToOsmoDenom(sell),
    symbol: sell,
    amount: tokenInAmount,
    displayAmount: baseUnitsToDisplayUnits(sell, tokenInAmount),
    tokenInPrice,
    tokenInValue: baseUnitsToDisplayUnits(sell, tokenInAmount) * tokenInPrice
  };
  const tokenOut = {
    denom: symbolToOsmoDenom(buy),
    symbol: buy,
    amount: tokenOutAmountWithSlippage,
    displayAmount: baseUnitsToDisplayUnits(buy, tokenOutAmountWithSlippage),
    tokenOutPrice,
    tokenOutValue:
      baseUnitsToDisplayUnits(buy, tokenOutAmountWithSlippage) * tokenOutPrice
  };

  const routes = lookupRoutesForTrade({
    pools,
    trade: {
      sell: {
        denom: tokenIn.denom,
        amount: tokenInAmount + ''
      },
      buy: {
        denom: tokenOut.denom,
        amount: tokenOutAmount + ''
      },
      beliefValue: value
    },
    pairs: pairs.data
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
      // QUESTION: are decimals needed/allowed?
      amount: (tokenIn.amount + '').split('.')[0]
    },
    tokenOutMinAmount: (tokenOut.amount + '').split('.')[0]
  });

  console.log(msg);

  const res = await signAndBroadcastTilTxExists({
    client: stargateClient,
    cosmos: client,
    chainId: osmoChainConfig.chain_id,
    address: osmoAddress,
    msg,
    fee,
    memo: ''
  });

  const block = res?.tx_response?.height;

  // ERRORS

  //   {
  //     code: 7,
  //     height: 3612102,
  //     rawLog: 'failed to execute message; message index: 0: ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2 token is lesser than min amount: calculated amount is lesser than min amount',
  //     transactionHash: '19AEB7F56FD26F205F986C4D7E5846CC821CDE941DB1215763C3DADE34FDBBA3',
  //     gasUsed: 50716,
  //     gasWanted: 250000
  //   }

  // SUCCESS

  // broadcast
  // {
  //   code: 0,
  //   height: 3612234,
  //   rawLog: '[{"events"...]',
  //   transactionHash: '2F184843E66278CBB3EAB2065E8E5F17B3D2913EB4AEDA2DB9E69843EB1B83C8',
  //   gasUsed: 117782,
  //   gasWanted: 250000
  // }
  // success at block 3612234

  if (block) {
    console.log(`success at block ${block}`);
  } else {
    console.log('no block found for tx!');
  }
  console.log('\n\n\n\n\ntx');
  console.log(res);
};
