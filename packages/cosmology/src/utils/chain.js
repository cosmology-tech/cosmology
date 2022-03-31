import { assets, chains } from '@cosmology/cosmos-registry';
import { coin } from '@cosmjs/amino';

import { assets as osmosisAssets } from '../assets/index';
import { coins } from '@cosmjs/amino';
import { gas } from '../messages/gas';
import { symbolToOsmoDenom } from './osmo';
import { CoinPretty, Dec, DecUtils, Int, IntPretty } from '@keplr-wallet/unit';
import { prettyPool } from '../clients';

export const getFeeForChainAndMsg = (chainId, message) => {
  const chain = getChainByChainId(chainId);
  const denom = chain.fees.fee_tokens[0].denom;
  if (!gas?.[message]?.[denom]) {
    console.log(
      `WARNING: need fee information for ${chainId} : ${message} : ${denom}`
    );
    return {
      amount: coins(0 + '', denom),
      gas: '2000' // MUST BE STRING
    };
  }
  return {
    amount: coins(gas[message][denom].amount + '', denom),
    gas: gas[message][denom].gas + '' // MUST BE STRING
  };
};

export const getCosmosAssetInfo = (symbol) =>
  assets.find((a) => !!a.assets.find((i) => i.symbol === symbol));

export const getCosmosAssetInfoByDenom = (denom) =>
  assets.find(
    (a) =>
      !!a.assets.find(
        (asset) => !!asset.denom_units.find((unit) => unit.denom === denom)
      )
  );

// export const getAssetInfoByDenom = (denom) =>
//   assets.find(a=>a.symbol === symbol);

export const getOsmosisAssetInfo = (symbol) =>
  osmosisAssets.find((a) => a.symbol === symbol);

export const getOsmosisAssetIbcInfo = (symbol) => {
  const assetInfo = getOsmosisAssetInfo(symbol);
  return assetInfo?.ibc;
};

export const getOsmosisAssetDenom = (symbol) => {
  const assetInfo = getOsmosisAssetInfo(symbol);
  return assetInfo?.base;
};

export const getNameOfChain = (chain_id) => {
  const chain = chains.find((c) => c.chain_id === chain_id);
  return chain?.chain_name;
};

export const getChainByChainId = (chain_id) => {
  const chain = chains.find((c) => c.chain_id === chain_id);
  return chain;
};

export const getBaseAndDisplayUnitsGenericCosmos = (symbol) => {
  const coinInfo = getCosmosAssetInfo(symbol);
  if (!coinInfo) {
    throw new Error(`coin:${symbol} not found.`);
  }
  const asset = coinInfo.assets.find((a) => a.symbol === symbol);
  if (!asset) {
    throw new Error(`coin:${symbol} not found.`);
  }

  const base = asset.denom_units.find((d) => d.denom === asset.base);
  const display = asset.denom_units.find((d) => d.denom === asset.display);

  if (!base || !display) {
    throw new Error(`cannot find denom for coin ${symbol}`);
  }

  return { base, display };
};

export const getBaseAndDisplayUnits = (symbol) => {
  const coinInfo = getOsmosisAssetInfo(symbol);
  if (!coinInfo) {
    const info = getBaseAndDisplayUnitsByDenom(symbol);
    if (info) return info;
    throw new Error(`coin:${symbol} not found.`);
  }

  const base = coinInfo.denom_units.find(
    (d) => d.denom === coinInfo.base || d.aliases?.includes(coinInfo.base)
  );
  const display = coinInfo.denom_units.find(
    (d) => d.denom === coinInfo.display || d.aliases?.includes(coinInfo.display)
  );

  if (!base || !display) {
    throw new Error(`cannot find denom for coin ${symbol}`);
  }

  return { base, display };
};

// uses cosmos
export const getBaseAndDisplayUnitsByDenom = (denom) => {
  if (denom.startsWith('gamm')) {
    return {
      base: denom,
      display: 18
    };
  }

  const chainInfo = getCosmosAssetInfoByDenom(denom);
  if (!chainInfo) {
    throw new Error(`coin:denom:${denom} not found.`);
  }

  const coinInfo = chainInfo.assets.find(
    (asset) => asset.base === denom || asset.display === denom
  );

  const base = coinInfo.denom_units.find(
    (d) => d.denom === coinInfo.base || d.aliases?.includes(coinInfo.base)
  );
  const display = coinInfo.denom_units.find(
    (d) => d.denom === coinInfo.display || d.aliases?.includes(coinInfo.display)
  );

  if (!base || !display) {
    throw new Error(`cannot find denom for coin ${denom}`);
  }

  return { base, display };
};

export const getOsmosisSymbolIbcName = (symbol) => {
  const coinInfo = getOsmosisAssetInfo(symbol);
  if (!coinInfo) {
    throw new Error(`coin:${symbol} not found.`);
  }
  return coinInfo.base;
};

export const displayUnitsToDenomUnits = (symbol, amount) => {
  const { display } = getBaseAndDisplayUnits(symbol);
  const a = new IntPretty(new Dec(amount));
  return a
    .moveDecimalPointRight(display.exponent)
    .maxDecimals(16)
    .locale(false)
    .toString();
};

// TODO design how classes migrate to methods...
export const getPrice = (prices, symbol) => {
  const denom = symbolToOsmoDenom(symbol);
  return prices[denom] || 0;
};

export const displayUnitsToDollarValue = (prices, symbol, amount) => {
  const price = getPrice(prices, symbol);
  const a = new Dec(amount);
  const p = new Dec(price);
  return a.mul(p).toString();
};

export const baseUnitsToDollarValue = (prices, symbol, amount) => {
  const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
  return displayUnitsToDollarValue(prices, symbol, displayAmount);
};

export const dollarValueToDisplayUnits = (prices, symbol, amount) => {
  const price = getPrice(prices, symbol);
  const a = new Dec(amount);
  const p = new Dec(price);
  return a.quo(p).toString();
};

export const dollarValueToDenomUnits = (prices, symbol, amount) => {
  const display = dollarValueToDisplayUnits(prices, symbol, amount);
  return displayUnitsToDenomUnits(symbol, display);
};

export const baseUnitsToDisplayUnits = (symbol, amount) => {
  const { display } = getBaseAndDisplayUnits(symbol);
  const a = new IntPretty(new Dec(amount));
  return a
    .moveDecimalPointLeft(display.exponent)
    .maxDecimals(16)
    .locale(false)
    .toString();
};

export const baseUnitsToDisplayUnitsByDenom = (denom, amount) => {
  const { display } = getBaseAndDisplayUnitsByDenom(denom);
  const a = new IntPretty(new Dec(amount));
  return a
    .moveDecimalPointLeft(display.exponent)
    .maxDecimals(16)
    .locale(false)
    .toString();
};

export const getChain = async ({ token }) => {
  const chainFromAssets = assets.find(({ assets }) => {
    const found = assets.find(({ symbol }) => symbol === token);
    if (found) return true;
  });
  const chain = chains.find(
    ({ chain_id }) => chain_id == chainFromAssets.chain_id
  );
  return chain;
};

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

export const calculateShareOutAmount = (poolInfo, coinsNeeded) => {
  const shareOuts = [];

  for (let i = 0; i < poolInfo.poolAssets.length; i++) {
    const tokenInAmount = new IntPretty(new Dec(coinsNeeded[i].amount));
    const totalShare = new IntPretty(new Dec(poolInfo.totalShares.amount));
    const totalShareExp = totalShare.moveDecimalPointLeft(18);
    const poolAssetAmount = new IntPretty(
      new Dec(poolInfo.poolAssets[i].token.amount)
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
  return shareOutAmount;
};

export const calculateCoinsNeededInPoolForValue = (prices, poolInfo, value) => {
  const coinsNeeded = poolInfo.poolAssetsPretty.map((asset) => {
    const v = new Dec(value);
    const r = new Dec(asset.ratio);
    const shareTotalValue = v.mul(r).toString();
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

    const a = new Dec(amount);
    const b = new Dec(asset.amount);

    return {
      symbol: asset.symbol,
      denom: asset.denom,
      amount: (a.toString() + '').split('.')[0], // no decimals...
      displayAmount: baseUnitsToDisplayUnits(asset.symbol, amount),
      shareTotalValue,
      totalDollarValue,
      unitRatio: a.quo(b).toString()
    };
  });
  return coinsNeeded;
};

const coinGet = (prices, balances, asset, pAsset) => {
  // get the asset
  const coinBalance = balances.find((coin) => coin.denom == asset.token.denom);

  if (!coinBalance || !coinBalance.amount) {
    throw new Error('not enough ' + pAsset.symbol);
  }

  coinBalance.displayValue = baseUnitsToDollarValue(
    prices,
    pAsset.symbol,
    coinBalance.amount
  );

  return coinBalance;
};

export const calculateMaxCoinsForPool = (prices, poolInfo, balances) => {
  const scenarios = {};

  for (let i = 0; i < poolInfo.poolAssets.length; i++) {
    const asset = poolInfo.poolAssets[i];
    const pAsset = poolInfo.poolAssetsPretty[i];
    // first solve for the first asset having the amount it currently has
    scenarios[pAsset.symbol] = [];

    // get the asset
    const coinBalance = coinGet(prices, balances, asset, pAsset);

    const totalDollarValueOfCoinA = baseUnitsToDollarValue(
      prices,
      pAsset.symbol,
      coinBalance.amount
    );

    const tva = new Dec(totalDollarValueOfCoinA);
    const pr = new Dec(pAsset.ratio);

    const totalDollarValue = tva.quo(pr);

    scenarios[pAsset.symbol].push({
      token: coinBalance,
      ratio: pAsset.ratio,
      symbol: pAsset.symbol,
      amount: (coinBalance.amount + '').split('.')[0], // no decimals...,
      enoughCoinsExist: true,
      totalDollarValue: totalDollarValue.toString()
    });

    for (let j = 0; j < poolInfo.poolAssets.length; j++) {
      const jAsset = poolInfo.poolAssets[j];
      const jPAsset = poolInfo.poolAssetsPretty[j];
      if (jAsset.token.denom === asset.token.denom) continue;
      const otherBalance = coinGet(prices, balances, jAsset, jPAsset);

      const ratio = new Dec(jPAsset.ratio);
      const totalDollarValueOfCoinB = totalDollarValue.mul(ratio).toString();
      const totalCoinsBDenom = dollarValueToDenomUnits(
        prices,
        jPAsset.symbol,
        totalDollarValueOfCoinB
      );

      const other = new Dec(otherBalance.amount);
      const totalB = new Dec(totalCoinsBDenom);
      const enoughCoinsExist = other.sub(totalB).gt(new Dec(0));

      scenarios[pAsset.symbol].push({
        token: otherBalance,
        ratio: jPAsset.ratio,
        symbol: jPAsset.symbol,
        amount: (totalCoinsBDenom + '').split('.')[0], // no decimals...,
        enoughCoinsExist
      });
    }
  }

  const allScenarios = Object.entries(scenarios).map(([key, value]) => {
    return {
      name: key,
      coins: value
    };
  });

  const winners = allScenarios.filter((scenario) =>
    scenario.coins.every((coin) => coin.enoughCoinsExist)
  );

  if (!winners.length) {
    throw new Error('no scenario possible!');
  }
  const winner = winners[0];

  const coinsNeeded = poolInfo.poolAssetsPretty.map((asset) => {
    const coin = winner.coins.find((coin) => coin.token.denom === asset.denom);
    return {
      denom: coin.token.denom,
      amount: coin.amount
    };
  });

  return coinsNeeded;
};
