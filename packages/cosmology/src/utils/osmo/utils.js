// osmo specific utils
import { assets as osmosisAssets } from '../../assets';
import {
  displayUnitsToDenomUnits,
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue,
  dollarValueToDenomUnits
} from '../chain';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import { noDecimals } from '../../messages';

/**
 *
 * @typedef {{
 * id: string;
 * name: string;
 * address: string;
 * displayPoolAssets: object[];
 * poolAssets: object[];
 * pricePerShareEn18: string;
 * totalShares: Coin;
 * totalValue: string;
 * totalWeight: string;
 * }} Pool
 * * totalWeight: = "1";
//  *
//  * @typedef {{
//  * amount:string;
//  * denom:CoinDenom;
 * }} LockedPool
 *
 *
 * @typedef {{
 * poolId:string;
 * tokenOutDenom:CoinDenom;
 * tokenOutSymbol:CoinSymbol;
 * tokenInSymbol:CoinSymbol;
 * liquidity:number;
 * }} TradeRoute
 *
 * @typedef {{
 * trade: Trade;
 * routes:TradeRoute[];
 * }} Swap
 *
 * @typedef {{
 *  pool_address: string;
 *  pool_id: string;
 *  base_name: string;
 *  base_symbol: CoinSymbol;
 *  base_address: CoinDenom;
 *  quote_name: string;
 *  quote_symbol: CoinSymbol;
 *  quote_address: CoinDenom;
 *  price: number;
 *  base_volume_24h: number;
 *  quote_volume_24h: number;
 *  volume_24h: number;
 *  volume_7d: number;
 *  liquidity: number;
 *  liquidity_atom: number;
 * }} Pair
 *
 * @typedef {{
 * amount:string;
 * denom:CoinDenom;
 * value:string;
 * allocation:string;
 * poolId:string;
 * }} LockedPoolDisplay
 *
 * @typedef {{
 * amount:string;
 * denom:CoinDenom;
 * }} Coin
 *
 * @typedef {{
 * weight:string;
 * type:('coin'|'pool');
 * name:string;
 * value:string|null;
 * symbol:CoinSymbol|null;
 * poolId:string|null;
 * denom:CoinDenom;
 * allocation:string;
 * }} CoinWeight
 *
 * @typedef {{
 * amount:string;
 * denom:CoinDenom;
 * displayAmount: string;
 * value: string;
 * symbol: CoinSymbol;
 * }} CoinValue
 *
 * @typedef {{
 * name: string;
 * denom:CoinDenom;
 * amount:string|null;
 * displayAmount: string|null;
 * value: string;
 * coins: CoinValue[];
 * }} PoolAllocation
 *
 * @typedef {{
 * amount:string;
 * symbol:CoinSymbol;
 * }} DisplayCoin
 *
 * @typedef {{
 * sell:CoinValue
 * buy:CoinValue;
 * beliefValue:string;
 * }} Trade
 *
 *
 */

/**
 * @typedef {(
 * string
 * )} CoinDenom
 *
 */

/**
 * @typedef {(
 * 'ATOM'|
 * 'OSMO'|
 * 'ION'|
 * 'AKT'|
 * 'DVPN'|
 * 'IRIS'|
 * 'CRO'|
 * 'XPRT'|
 * 'REGEN'|
 * 'IOV'|
 * 'NGM'|
 * 'EEUR'|
 * 'JUNO'|
 * 'LIKE'|
 * 'UST'|
 * 'LUNA'|
 * 'BCNA'|
 * 'SCRT'|
 * 'MED'
 * )} CoinSymbol
 *
 * @typedef {('cosmos'|
 * 'osmosis'|
 * 'ion'|
 * 'akash-network'|
 * 'sentinel'|
 * 'iris-network'|
 * 'crypto-com-chain'|
 * 'persistence'|
 * 'regen'|
 * 'starname'|
 * 'e-money'|
 * 'e-money-eur'|
 * 'juno-network'|
 * 'likecoin'|
 * 'terrausd'|
 * 'terra-luna'|
 * 'bitcanna'|
 * 'terra-krw'|
 * 'secret'|
 * 'medibloc'|
 * 'comdex'|
 * 'cheqd-network'|
 * 'vidulum')} CoinGeckoToken
 *
 * @typedef {Object.<CoinDenom, number>} PriceHash
 *
 * @typedef {Object.<CoinGeckoToken, {usd: number}>} CoinGeckoUSDResponse
 *
 */

/**
 * @param {CoinSymbol} token
 * @returns {CoinGeckoToken}
 */
export const getCoinGeckoIdForSymbol = (token) => {
  const rec = osmosisAssets.find(({ symbol }) => symbol === token);
  const geckoId = rec?.coingecko_id;
  if (!geckoId) {
    return console.log(`cannot find coin: ${token}`);
  }
  return geckoId;
};

/**
 * @param {CoinGeckoToken} geckoId
 * @returns {CoinSymbol}
 */
export const getSymbolForCoinGeckoId = (geckoId) => {
  const rec = osmosisAssets.find(
    ({ coingecko_id }) => coingecko_id === geckoId
  );
  const symbol = rec?.symbol;
  // if (!symbol) {
  // console.log(`WARNING: cannot find coin for geckoId: ${geckoId}`);
  // }
  return symbol;
};

/**
 * @param {CoinDenom} denom
 * @returns {CoinSymbol}
 */
export const osmoDenomToSymbol = (denom) => {
  const rec = osmosisAssets.find(({ base }) => base === denom);
  const symbol = rec?.symbol;
  if (!symbol) {
    return denom;
  }
  return symbol;
};

/**
 * @param {CoinSymbol} token
 * @returns {CoinDenom}
 */
export const symbolToOsmoDenom = (token) => {
  const rec = osmosisAssets.find(({ symbol }) => symbol === token);
  const base = rec?.base;
  if (!base) {
    console.log(`cannot find base for token ${token}`);
    return null;
  }
  return base;
};

/**
 * @type {object}
 * @property {CoinSymbol} symbol - the human readable all-caps version, e.g. ATOM, OSMO, etc.
 * @property {CoinDenom} denom - denomination, e.g. uosmo, or ibc/143....
 * @property {string} amount - the amount of the token
 */

export class OsmosisToken {
  /**
   * @param {object} param0
   * @param {CoinSymbol|null} param0.symbol - the human readable all-caps version, e.g. ATOM, OSMO, etc.
   * @param {CoinDenom|null} param0.denom - denomination, e.g. uosmo, or ibc/143....
   * @param {number} param0.amount - the amount of the token
   */
  constructor({ symbol, denom, amount = 0 }) {
    if (symbol) {
      this.symbol = symbol;
      this.denom = symbolToOsmoDenom(symbol);
    }
    if (denom) {
      this.denom = denom;
      this.symbol = osmoDenomToSymbol(denom);
    }
    this.amount = displayUnitsToDenomUnits(this.symbol, amount);
  }
  /**
   * @returns {Coin}
   */
  toJSON() {
    return {
      denom: this.denom,
      amount: this.amount
    };
  }
}

/**
 * @param {DisplayCoin[]} coins
 * @returns {Coin[]}
 */

export const symbolsAndDisplayValuesToCoinsArray = (coins) =>
  coins.map(({ symbol, amount }) => ({
    denom: symbolToOsmoDenom(symbol),
    amount: displayUnitsToDenomUnits(symbol, amount)
  }));

/**
 * @param {CoinValue[]} balances1
 * @param {CoinValue[]} balances2
 * @returns {CoinValue[]}
 */

export const substractCoins = (balances1, balances2) => {
  return balances1.reduce((m, coin) => {
    const newCoin = { ...coin };
    // due to swaps and how we use this method,
    // balances2 can have multiple versions of the same symbol
    // so just subtract all of them...
    const coins = balances2.filter(({ denom }) => denom == coin.denom);
    coins.forEach((c2) => {
      const a = new Dec(newCoin.amount);
      const b = new Dec(c2.amount);
      newCoin.amount = a.sub(b).toString();
      if (
        coin.hasOwnProperty('displayAmount') &&
        c2.hasOwnProperty('displayAmount')
      ) {
        const a = new Dec(newCoin.displayAmount);
        const b = new Dec(c2.displayAmount);
        newCoin.displayAmount = a.sub(b).toString();
      }
      if (coin.hasOwnProperty('value') && c2.hasOwnProperty('value')) {
        const a = new Dec(newCoin.value);
        const b = new Dec(c2.value);
        newCoin.value = a.sub(b).toString();
      }
    });
    return [...m, newCoin];
  }, []);
};

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {CoinDenom} param0.denom
 * @param {string|number} param0.value - usd value
 * @returns {CoinValue}
 */
export const convertCoinValueToCoin = ({ prices, denom, value }) => {
  const price = prices[denom];
  const symbol = osmoDenomToSymbol(denom);
  if (isNaN(price)) {
    // console.log(`bad price for ${denom} NaN.`);
    return null;
  }
  const v = new Dec(value);
  const p = new Dec(prices[denom]);
  const displayAmount = v.quo(p).toString();
  return {
    symbol,
    denom,
    amount: displayUnitsToDenomUnits(symbol, displayAmount),
    displayAmount,
    value: new Dec(value).toString()
  };
};

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Coin} param0.coin
 * @returns {CoinValue}
 */
export const convertCoinToDisplayValues = ({ prices, coin }) => {
  const { denom, amount } = coin;
  const price = prices[denom];
  const symbol = osmoDenomToSymbol(denom);
  if (isNaN(price)) {
    // console.log(`bad price for ${denom} NaN.`);
    return null;
  }
  const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
  // if (isNaN(displayAmount)) {
  //   // console.log('bad amount, NaN.');
  //   return null;
  // }
  const dA = new Dec(displayAmount);
  const assetPrice = new Dec(prices[denom]);
  const value = dA.mul(assetPrice).toString();
  return {
    symbol,
    denom,
    amount,
    displayAmount,
    value
  };
};

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Coin[]} param0.coins
 * @returns {CoinValue[]}
 */
export const convertCoinsToDisplayValues = ({ prices, coins }) =>
  coins.map((coin) => convertCoinToDisplayValues({ prices, coin }));

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Coin[]} param0.coins
 * @returns {string}
 */
export const calculateCoinsTotalBalance = ({ prices, coins }) => {
  return convertCoinsToDisplayValues({ prices, coins }).reduce((m, v) => {
    const { value } = v;
    const val = new Dec(value);
    const mv = new Dec(m);
    return val.add(mv).toString();
  }, '0');
};

/**
 *
 * @param {CoinGeckoUSDResponse} prices
 * @returns {PriceHash}
 */

export const convertGeckoPricesToDenomPriceHash = (prices) => {
  return Object.keys(prices).reduce((m, geckoId) => {
    const symbol = getSymbolForCoinGeckoId(geckoId);
    if (symbol) {
      const denom = symbolToOsmoDenom(symbol);
      m[denom] = prices[geckoId].usd;
    }
    return m;
  }, {});
};

/**
 *
 * @param {ValidatorToken[]} tokens
 * @returns {PriceHash}
 */

export const convertValidatorPricesToDenomPriceHash = (tokens) => {
  return tokens.reduce((m, token) => {
    m[token.denom] = token.price;
    return m;
  }, {});
};

/**
 *
 * @param {object} pools
 * @param {string} gammId
 * @returns {Pool}
 */

export const getPoolByGammName = (pools, gammId) => {
  return pools.find(({ totalShares: { denom } }) => denom === gammId);
};

/**
 *
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Pool[]} param0.pools
 * @param {string} param0.poolId
 * @returns {Pool}
 */

export const getPoolInfo = ({ prices, pools, poolId }) => {
  const pool = pools.find(({ id }) => id === poolId);
  if (!pool) throw new Error('cannot find pool');
  return convertPoolToDisplayValues({ prices, pool });
};

/**
 *
 * @param {object} param0
 * @param {Pool[]} param0.pools
 * @param {LockedPool[]} param0.lockedPools
 * @returns {LockedPoolDisplay[]}
 */

export const getUserPools = ({ pools, lockedPools }) => {
  return lockedPools
    .map(({ denom, amount }) => {
      const pool = getPoolByGammName(pools, denom);
      // TODO why some pools missing?
      if (!pool) return null;

      const p = new Dec(pool.pricePerShareEn18);
      const a = new Dec(amount);
      const ta = new Dec(pool.totalShares.amount);
      const value = new IntPretty(p.mul(a))
        .moveDecimalPointLeft(18)
        .maxDecimals(18)
        .locale(false)
        .toString();
      const allocation = a.quo(ta).toString();

      return {
        denom,
        amount,
        value,
        allocation,
        poolId: pool.id
      };
    })
    .filter(Boolean);
};

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Pool} param0.pool
 */

export const convertPoolToDisplayValues = ({ prices, pool }) => {
  const { totalShares, poolAssets } = pool;
  let totalValue = new Dec(0);
  pool.displayPoolAssets = poolAssets
    .map(({ token, weight }) => {
      const value = convertCoinToDisplayValues({ prices, coin: token });
      if (!value) return undefined;
      const val = new Dec(value.value);
      totalValue = totalValue.add(val);
      const w = new Dec(weight);
      const wt = new Dec(pool.totalWeight);
      return {
        token,
        weight,
        allocation: w.quo(wt).toString(),
        symbol: osmoDenomToSymbol(token.denom),
        value
      };
    })
    .filter(Boolean);

  pool.totalValue = totalValue.toString();

  const ta = new Dec(totalShares.amount);
  const totalSharesAmount = new IntPretty(ta);
  const totalVal = new IntPretty(totalValue);

  if (ta.lte(new Dec(0))) {
    pool.pricePerShareEn18 = '0';
  } else {
    pool.pricePerShareEn18 = totalVal
      .maxDecimals(18)
      .quo(totalSharesAmount.moveDecimalPointLeft(18).maxDecimals(18))
      // .moveDecimalPointLeft(18)
      .locale(false)
      .toString();
  }

  pool.name = pool.displayPoolAssets
    .reduce((m, v) => {
      return [...m, v.symbol];
    }, [])
    .join('/');

  return pool;
};

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Pool[]} param0.pools
 */
export const convertPoolsToDisplayValues = ({ prices, pools }) =>
  pools.map((pool) => convertPoolToDisplayValues({ prices, pool }));

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Pool[]} param0.pools
 */
export const getFilteredPoolsWithValues = ({ prices, pools }) =>
  convertPoolsToDisplayValues({ prices, pools });
// remove small pools
// .filter(({ totalValue }) => totalValue >= 100000)
// remove DIG or VIDL or coins not on coingecko that don't get prices
// .filter(({ poolAssets, displayPoolAssets }) => poolAssets.length === displayPoolAssets.length);

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {Coin[]} param0.balances
 * @param {Coin[]} param0.desired
 * @param {Pool[]} param0.pools
 * @returns {Trade[]}
 */
export const getTradesRequiredToGetBalances = ({
  prices,
  balances,
  desired
}) => {
  const totalCurrent = calculateCoinsTotalBalance({ prices, coins: balances });
  const totalDesired = calculateCoinsTotalBalance({ prices, coins: desired });

  const t = new Dec(totalDesired);
  const c = new Dec(totalCurrent);

  if (t.gt(c) && !t.sub(c).lte(new Dec(0.01))) {
    // if t > c, but the difference IS not a small number
    console.log(t.toString(), c.toString());
    throw new Error('insufficient balance');
  }

  const hasEnough = desired.reduce((m, { denom, amount }) => {
    const current = balances.find((c) => c.denom === denom);
    if (!current) return false;
    const a = new Dec(current.amount);
    const b = new Dec(amount);
    if (a.gte(b)) return m && true;
    return false;
  }, true);

  if (hasEnough) {
    // no trades are required
    return [];
  }

  const currentCoins = convertCoinsToDisplayValues({ prices, coins: balances });
  const desiredCoins = convertCoinsToDisplayValues({ prices, coins: desired });

  // returns a list of the available coins
  const availableCoins = balances.reduce((m, coin) => {
    const { denom } = coin;
    const desiredCoin = desiredCoins.find((c) => c.denom === denom);
    if (!desiredCoin) {
      return [...m, coin];
    }

    const a = new Dec(coin.amount);
    const b = new Dec(desiredCoin.amount);
    const diff = a.sub(b);
    if (diff.lte(new Dec(0))) {
      return m;
    }

    return [
      ...m,
      {
        denom: coin.denom,
        amount: diff.toString()
      }
    ];
  }, []);

  // coins needed
  const desiredCoinsNeeded = desired.reduce((m, coin) => {
    const { denom } = coin;
    const current = currentCoins.find((c) => c.denom === denom);
    if (!current) {
      return [...m, coin];
    }
    const a = new Dec(coin.amount);
    const b = new Dec(current.amount);
    const aMinusB = a.sub(b);

    const diff = {
      denom: coin.denom,
      amount: aMinusB.toString()
    };
    if (aMinusB.lte(new Dec(0))) return m;
    return [...m, diff];
  }, []);

  const availableCoinsValue = calculateCoinsTotalBalance({
    prices,
    coins: availableCoins
  });
  const desiredCoinsNeededValue = calculateCoinsTotalBalance({
    prices,
    coins: desiredCoinsNeeded
  });

  const availableCoinsWithValues = convertCoinsToDisplayValues({
    prices,
    coins: availableCoins
  });
  const desiredCoinsNeededWithValues = convertCoinsToDisplayValues({
    prices,
    coins: desiredCoinsNeeded
  });

  const dsr = new Dec(desiredCoinsNeededValue);
  const avl = new Dec(availableCoinsValue);

  if (dsr.gt(avl) && !dsr.sub(avl).lte(new Dec(0.01))) {
    throw new Error(
      `not possible with current values (desired[${desiredCoinsNeededValue}] > available[${availableCoinsValue}])`
    );
  }

  // trades are required
  const trades = desiredCoinsNeededWithValues.reduce((m, coin) => {
    let valueNeeded = new Dec(coin.value);
    for (let i = 0; i < availableCoinsWithValues.length; i++) {
      if (valueNeeded.lte(new Dec(0))) continue;
      const current = availableCoinsWithValues[i];
      if (coin.symbol === current.symbol) continue;
      const currentVal = new Dec(current.value);
      if (currentVal.gte(valueNeeded)) {
        // console.log(`I desired:${coin.symbol} avail:${current.symbol}`);
        // console.log(`I valueNeeded:${valueNeeded}`);
        // 1. value is more than what is needed
        // TAKE WHAT YOU NEED
        const leftOver = currentVal.sub(valueNeeded);
        const amountUsed = new Dec(valueNeeded.toString());
        valueNeeded = valueNeeded.sub(amountUsed);

        m.push({
          sell: convertCoinValueToCoin({
            prices,
            denom: current.denom,
            value: amountUsed.toString()
          }),
          buy: convertCoinValueToCoin({
            prices,
            denom: coin.denom,
            value: amountUsed.toString()
          }),
          beliefValue: amountUsed.toString()
        });

        current.value = leftOver.toString();
        availableCoinsWithValues[i].value = leftOver.toString();
      } else if (currentVal.lt(valueNeeded)) {
        // console.log(`II desired:${coin.symbol} avail:${current.symbol}`);
        // console.log(`II valueNeeded:${valueNeeded}`);
        // 2. value is less than what is needed
        // TAKE IT ALL!
        const amountUsed = new Dec(current.value);
        valueNeeded = valueNeeded.sub(amountUsed);

        m.push({
          sell: convertCoinValueToCoin({
            prices,
            denom: current.denom,
            value: amountUsed.toString()
          }),
          buy: convertCoinValueToCoin({
            prices,
            denom: coin.denom,
            value: amountUsed.toString()
          }),
          beliefValue: amountUsed.toString()
        });

        current.value = '0';
        availableCoinsWithValues[i].value = '0';
      }
    }
    return m;
  }, []);

  return trades;
};

/**
 * @param {object} param0
 * @param {CoinWeight[]} param0.weights
 * @param {Pool[]} param0.pools
 * @param {PriceHash} param0.prices
 * @param {number|null} param0.totalCurrentValue
 * @returns {CoinWeight[]}
 *
 * this is used to canonicalize CoinWeights so a user can
 * pass in only some properties, like poolId, or symbol, etc.,
 * and it will determine the denom, etc.
 *
 */

export const canonicalizeCoinWeights = ({
  weights,
  pools,
  prices,
  totalCurrentValue
}) => {
  let totalValue = new Dec(0);
  const enriched = weights.map((item) => {
    if (!item.weight || new Dec(item.weight).lt(new Dec(0)))
      throw new Error('no non-positive weights');

    const wt = new Dec(item.weight);
    totalValue = totalValue.add(wt);
    if (!item.denom) {
      if (item.symbol) {
        item.denom = symbolToOsmoDenom(item.symbol);
      }
      if (item.poolId) {
        const pool = pools.find(({ id }) => item.poolId == id);
        item.denom = pool?.totalShares?.denom;
      }
      if (!item.denom) {
        throw new Error('cannot determine weight type');
      }
    }
    if (item.denom.startsWith('gamm')) {
      item.type = 'pool';
      const pool = getPoolByGammName(pools, item.denom);
      if (!pool) throw new Error(`cannot find pool ${item.denom}`);
      item.poolId = pool.id;
      const info = getPoolInfo({ prices, pools, poolId: item.poolId });
      item.name = info.name;
    } else {
      item.type = 'coin';
      item.name = osmoDenomToSymbol(item.denom);
      item.symbol = osmoDenomToSymbol(item.denom);
    }
    return item;
  });

  return enriched.map((item) => {
    const allocation = new Dec(item.weight).quo(totalValue).toString();
    let value;
    if (typeof totalCurrentValue !== 'undefined') {
      const tcv = new Dec(totalCurrentValue);
      const wt = new Dec(item.weight);
      value = tcv.mul(wt).quo(totalValue).toString();
    }
    return {
      ...item,
      allocation,
      value
    };
  });
};

/**
 * @param {object} param0
 * @param {Pool[]} param0.pools
 * @param {PriceHash} param0.prices
 * @param {CoinWeight} param0.weight
 * @returns {PoolAllocation}
 */

export const poolAllocationToCoinsNeeded = ({ pools, prices, weight }) => {
  if (weight.type !== 'pool') {
    throw new Error('not yet');
  }

  const pool = getPoolInfo({ prices, pools, poolId: weight.poolId });

  const coins = pool.displayPoolAssets.map((a) => {
    const value = new Dec(weight.value);
    const alloc = new Dec(a.allocation);
    return convertCoinValueToCoin({
      prices,
      denom: a.token.denom,
      value: value.mul(alloc).toString()
    });
  });

  if (typeof weight.value === 'undefined') {
    throw new Error('weight.value needs to be defined');
  }

  const ta = new Dec(pool.totalShares.amount);
  const tv = new Dec(pool.totalValue);
  const wv = new Dec(weight.value);

  const allocation = {
    name: pool.name,
    denom: pool.totalShares.denom,
    amount: ta.quo(tv).mul(wv).toString(),
    // TODO determine the pool multipliers
    displayAmount: '-1',
    value: weight.value,
    coins
  };

  return allocation;
};

/**
 * @param {object} param0
 * @param {CoinWeight[]} param0.weights
 * @param {Pool[]} param0.pools
 * @param {PriceHash} param0.prices
 * @param {Coin[]} param0.balances
 * @returns {{
 *  pools: PoolAllocation[];
 *  coins: CoinValue[];
 *  weights: CoinWeight[];
 * }}
 */

export const convertWeightsIntoCoins = ({
  weights,
  pools,
  prices,
  balances
}) => {
  const totalCurrentValue = calculateCoinsTotalBalance({
    prices,
    coins: balances
  });
  const cleaned = canonicalizeCoinWeights({
    weights,
    pools,
    prices,
    totalCurrentValue
  });
  const allocations = cleaned
    .filter((c) => c.type === 'pool')
    .map((pool) => {
      return poolAllocationToCoinsNeeded({ pools, prices, weight: pool });
    });

  const tcv = new Dec(totalCurrentValue);
  const objs = cleaned.map((item) => {
    const alc = new Dec(item.allocation);
    return {
      ...item,
      value: tcv.mul(alc).toString()
    };
  });

  const coins = objs
    .filter((a) => a.type === 'coin')
    .map((coin) => {
      return convertCoinValueToCoin({
        prices,
        denom: coin.denom,
        value: coin.value
      });
    });

  return {
    pools: allocations,
    coins,
    weights: objs
  };
};

/**
 * @param {object} param0
 * @param {CoinDenom} param0.denom
 * @param {Trade} param0.trade
 * @param {Pair[]} param0.pairs
 * @returns {TradeRoute[]}
 */

export const routeThroughPool = ({ denom, trade, pairs }) => {
  const symbol = osmoDenomToSymbol(denom);

  const sellPool = pairs.find(
    (pair) =>
      (pair.base_address == trade.sell.denom && pair.quote_address == denom) ||
      (pair.quote_address == trade.sell.denom && pair.base_address == denom)
  );

  const buyPool = pairs.find(
    (pair) =>
      (pair.base_address == denom && pair.quote_address == trade.buy.denom) ||
      (pair.quote_address == denom && pair.base_address == trade.buy.denom)
  );

  if (sellPool && buyPool) {
    const routes = [
      {
        poolId: sellPool.pool_id,
        tokenOutDenom: denom,
        tokenOutSymbol: symbol,
        tokenInSymbol: trade.sell.symbol,
        liquidity: sellPool.liquidity
      },
      {
        poolId: buyPool.pool_id,
        tokenOutDenom: trade.buy.denom,
        tokenOutSymbol: trade.buy.symbol,
        tokenInSymbol: symbol,
        liquidity: buyPool.liquidity
      }
    ];

    return routes;
  }
};

/**
 * @param {object} param0
 * @param {Pool[]} param0.pools
 * @param {Trade} param0.trade
 * @param {Pair[]} param0.pairs
 * @returns {TradeRoute[]}
 */

export const lookupRoutesForTrade = ({ pools, trade, pairs }) => {
  const directPool = pairs.find(
    (pair) =>
      (pair.base_address == trade.sell.denom &&
        pair.quote_address == trade.buy.denom) ||
      (pair.quote_address == trade.sell.denom &&
        pair.base_address == trade.buy.denom)
  );

  if (directPool) {
    return [
      {
        poolId: directPool.pool_id,
        tokenOutDenom: trade.buy.denom,
        tokenOutSymbol: trade.buy.symbol,
        tokenInSymbol: trade.sell.symbol,
        liquidity: directPool.liquidity
      }
    ];
  }

  const osmoRoutes = routeThroughPool({
    denom: 'uosmo',
    trade,
    pairs
  });

  const atomRoutes = routeThroughPool({
    denom:
      'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
    trade,
    pairs
  });

  // if (atomRoutes?.length && osmoRoutes?.length) {
  //     const atomLiquidity = atomRoutes.reduce((m, { liquidity }) => m + liquidity, 0);
  //     const osmoLiquidity = osmoRoutes.reduce((m, { liquidity }) => m + liquidity, 0);
  //     if (atomLiquidity < osmoLiquidity) {
  //         return atomRoutes;
  //     } else {
  //         return osmoRoutes;
  //     }
  // }

  if (atomRoutes) return atomRoutes;
  if (osmoRoutes) return osmoRoutes;

  // TODO add ATOM routes...
  throw new Error('no trade routes found!');
};

/**
 * @param {object} param0
 * @param {Pool[]} param0.pools
 * @param {Trade[]} param0.trades
 * @param {Pair[]} param0.pairs
 * @returns {Swap[]}
 */

export const getSwaps = ({ pools, trades, pairs }) =>
  trades.reduce((m, trade) => {
    // not sure why, but sometimes we get a zero amount
    if (new Dec(trade.sell.value).lte(new Dec(0))) return m;
    return [
      ...m,
      {
        trade,
        routes: lookupRoutesForTrade({ pools, trade, pairs })
      }
    ];
  }, []);

export const calculateAmountWithSlippage = (amount, slippage) => {
  const a = new Dec(amount);
  const b = new Dec(100).sub(new Dec(slippage)).quo(new Dec(100));
  // Number(amount) * ((100 - slippage) / 100);
  return a.mul(b).toString();
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
      amount: noDecimals(amount),
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
    console.log(JSON.stringify({ asset, balances }, null, 2));
    console.log({ coinBalance });
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
      amount: noDecimals(coinBalance.amount),
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
        amount: noDecimals(totalCoinsBDenom),
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

export const getSellableBalance = async ({ client, address, sell }) => {
  const accountBalances = await client.getBalances(address);
  return accountBalances.result
    .map(({ denom, amount }) => {
      const symbol = osmoDenomToSymbol(denom);
      const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
      if (new Dec(displayAmount).lt(new Dec(0.0001))) return;
      if (!sell.includes(symbol)) return;
      return {
        symbol,
        denom,
        amount,
        displayAmount
      };
    })
    .filter(Boolean);
};
