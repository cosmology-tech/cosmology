import { chains } from '@cosmology/cosmos-registry';
import { coin } from '@cosmjs/amino';
import Long from 'long';
import { CoinPretty, Dec, DecUtils, Int, IntPretty } from '@keplr-wallet/unit';

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
import { getPools } from '../utils/prompt';

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

  // get pricing and pools info...
  const allTokens = await validator.getTokens();
  const pairs = await validator.getPairsSummary();
  const prices = convertValidatorPricesToDenomPriceHash(allTokens);
  //   const pools = await api.getPoolsPretty();

  const poolList = await getPools(validator, argv);
  const { poolId } = await prompt(
    [
      {
        type: 'list',
        name: 'poolId',
        message: 'choose pools to invest in',
        choices: poolList
      }
    ],
    argv
  );
  if (Array.isArray(poolId)) throw new Error('only atomic joins right now.');

  const { value } = await prompt(
    [
      {
        type: 'number',
        name: 'value',
        message: `how much to invest in USD?`
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

  const myPool = await client.getPoolPretty(poolId);
  let sum = 0;
  const coinsNeeded = myPool.poolAssetsPretty.map((asset) => {
    const shareTotalValue = value * asset.ratio;
    const totalDollarValue = baseUnitsToDollarValue(
      prices,
      asset.symbol,
      asset.amount
    );
    const amount = dollarValueToDenomUnits(
      prices,
      asset.symbol,
      shareTotalValue
    );
    sum += totalDollarValue;
    return {
      symbol: asset.symbol,
      denom: asset.denom,
      amount: (amount + '').split('.')[0], // no decimals...
      displayAmount: baseUnitsToDisplayUnits(asset.symbol, amount),
      shareTotalValue,
      totalDollarValue,
      unitRatio: amount / asset.amount
    };
  });

  console.log(coinsNeeded);
  console.log(sum);
  console.log(myPool.totalShares);

  // const tokenInAmount = new IntPretty(new Dec(amountConfig.amount));
  // totalShare / poolAsset.amount = totalShare per poolAssetAmount = total share per tokenInAmount
  // tokenInAmount * (total share per tokenInAmount) = totalShare of given tokenInAmount aka shareOutAmount;
  // tokenInAmount in terms of totalShare unit
  // shareOutAmount / totalShare = totalShare proportion of tokenInAmount;
  // totalShare proportion of tokenInAmount * otherTotalPoolAssetAmount = otherPoolAssetAmount
  // const shareOutAmount = tokenInAmount.mul(totalShare).quo(poolAsset.amount);

  const _sum = new Dec(sum);
  const _val = new Dec(value);
  const _totalShares = new Dec(myPool.totalShares.amount);

  const shareOutAmount = _sum
    .quo(_val)
    .mul(_totalShares)
    .toString()
    .split('.')[0];

  console.log({ shareOutAmount });

  const { msg, fee } = messages.joinPool({
    poolId,
    sender: account.address,
    shareOutAmount,
    tokenInMaxs: coinsNeeded.map((c) => {
      return coin(c.amount, c.denom);
    })
  });

  console.log(JSON.stringify(msg, null, 2));
};

// const { CoinPretty, Dec, DecUtils, Int, IntPretty } = require( '@keplr-wallet/unit' );
