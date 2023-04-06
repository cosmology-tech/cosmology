import { assets, chains } from 'chain-registry';
import { assets as osmosisAssets } from '../assets/index';
import { symbolToOsmoDenom } from './osmo';
import { Dec, IntPretty } from '@keplr-wallet/unit';

export const getCosmosAssetInfo = (symbol) =>
  assets.find((a) =>
    !!a.assets.find((i) => i.symbol === symbol && i.type_asset !== 'ics20')
  );

export const getOsmosisAssetInfo = (symbol) =>
  osmosisAssets.find((a) => a.symbol === symbol && a.type_asset !== 'ics20');

export const getCosmosAssetInfoByDenom = (denom) =>
  assets.find(
    (a) =>
      !!a.assets.find(
        (asset) =>
          !!asset.denom_units.find((unit) => unit.denom === denom)
          &&
          asset.type_asset !== 'ics20'
      )
  );

export const getOsmosisAssetInfoByDenom = (denom) => osmosisAssets.find(
  (a) =>
    !!a.denom_units.find(
      (unit) => unit.denom === denom
    ) && a.type_asset !== 'ics20')



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

export const getBaseAndDisplayUnitsByDenom = (denom) => {
  if (denom.startsWith('gamm')) {
    return {
      base: denom,
      display: 18
    };
  }

  let coinInfo = getOsmosisAssetInfoByDenom(denom);
  if (!coinInfo) {
    // look for generic cosmos coins
    const chainInfo = getCosmosAssetInfoByDenom(denom);
    if (!chainInfo || !chainInfo.assets) {
      throw new Error(`coin:denom:${denom} not found.`);
    }
    coinInfo = chainInfo.assets.find(
      (asset) => asset.base === denom || asset.display === denom
    );
    if (!coinInfo) {
      throw new Error(`coin:denom:${denom} not found.`);
    }
  }

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

export const displayUnitsToDollarValueByDenom = (prices, denom, amount) => {
  const price = prices[denom] || 0;
  const a = new Dec(amount);
  const p = new Dec(price);
  return a.mul(p).toString();
};

export const baseUnitsToDollarValueByDenom = (prices, denom, amount) => {
  const displayAmount = baseUnitsToDisplayUnitsByDenom(denom, amount);
  return displayUnitsToDollarValueByDenom(prices, denom, displayAmount);
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
    if (found && found.type_asset !== 'ics20') return true;
  });
  const chain = chains.find(
    ({ chain_name }) => chain_name == chainFromAssets.chain_name
  );
  return chain;
};
