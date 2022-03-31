import { assets, chains } from '@cosmology/cosmos-registry';
import { coin } from '@cosmjs/amino';

import { assets as osmosisAssets } from '../assets/index';
import { coins } from '@cosmjs/amino';
import { gas } from '../messages/gas';
import { osmoDenomToSymbol, symbolToOsmoDenom } from './osmo';
import { CoinPretty, Dec, DecUtils, Int, IntPretty } from '@keplr-wallet/unit';
import { prettyPool } from '../clients';
import { noDecimals } from '../messages';

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
