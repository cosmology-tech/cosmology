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

  //   share out amount = (token in amount * total share) / pool asset

  // const tokenInAmount = new IntPretty(new Dec(amountConfig.amount));
  // totalShare / poolAsset.amount = totalShare per poolAssetAmount = total share per tokenInAmount
  // tokenInAmount * (total share per tokenInAmount) = totalShare of given tokenInAmount aka shareOutAmount;
  // tokenInAmount in terms of totalShare unit
  // shareOutAmount / totalShare = totalShare proportion of tokenInAmount;
  // totalShare proportion of tokenInAmount * otherTotalPoolAssetAmount = otherPoolAssetAmount
  // const shareOutAmount = tokenInAmount.mul(totalShare).quo(poolAsset.amount);

  /*

`tokenInAmount` = number of tokens of coin A
`poolAsset.amount` = total number of tokens of coin A in pool
`totalShare` = total shares of pool (with exponent = 18)

`shareOutAmount` = `tokenInAmount` * `totalShare` / `poolAsset.amount`

@dev:
Yeah I think theres two options:
Simulate the message, and subtract $SLIPPAGE_PERCENTAGE from that
Doing exactly what you did (but taking the min of that over both assets)

 */

  const shareOuts = [];

  for (let i = 0; i < myPool.poolAssets.length; i++) {
    const tokenInAmount = new IntPretty(new Dec(coinsNeeded[i].amount));
    const totalShare = new IntPretty(new Dec(myPool.totalShares.amount));
    const totalShareExp = totalShare.moveDecimalPointLeft(18);
    const poolAssetAmount = new IntPretty(
      new Dec(myPool.poolAssets[i].token.amount)
    );

    const shareOutAmountObj = tokenInAmount
      .mul(totalShareExp)
      .quo(poolAssetAmount);
    const shareOutAmount = shareOutAmountObj
      .moveDecimalPointRight(18)
      .trim(true)
      .shrink(true)
      .maxDecimals(6)
      .locale(false)
      .toString();

    shareOuts.push(shareOutAmount);
  }

  const shareOutAmount = shareOuts.sort()[0];

  const { msg, fee } = messages.joinPool({
    poolId: poolId + '', // string!
    sender: account.address,
    shareOutAmount,
    tokenInMaxs: coinsNeeded.map((c) => {
      return coin(c.amount, c.denom);
    })
  });

  console.log(JSON.stringify(msg, null, 2));

  const accounts = await signer.getAccounts();
  const osmoAddress = accounts[0].address;
  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  });

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

  if (block) {
    console.log(`success at block ${block}`);
  } else {
    console.log('no block found for tx!');
  }
  console.log('\n\n\n\n\ntx');
  console.log(res);
};
