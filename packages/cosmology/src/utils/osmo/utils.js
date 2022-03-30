// osmo specific utils

import { assets as osmosisAssets } from '../../assets';
import { displayUnitsToDenomUnits, baseUnitsToDisplayUnits } from '../chain';
import Long from 'long';

/**
 *
 * @typedef {{
 * id: string;
 * name: string;
 * address: string;
 * displayPoolAssets: object[];
 * poolAssets: object[];
 * pricePerShare: number;
 * totalShares: Coin;
 * totalValue: number;
 * totalWeight: number;
 * }} Pool
 *
 * @typedef {{
 * amount:string;
 * denom:CoinDenom;
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
 * value:number;
 * allocation:number;
 * poolId:string;
 * }} LockedPoolDisplay
 *
 * @typedef {{
 * amount:string;
 * denom:CoinDenom;
 * }} Coin
 *
 * @typedef {{
 * weight:number;
 * type:('coin'|'pool');
 * name:string;
 * value:number|null;
 * symbol:CoinSymbol|null;
 * poolId:string|null;
 * denom:CoinDenom;
 * allocation:number;
 * }} CoinWeight
 *
 * @typedef {{
 * amount:string;
 * denom:CoinDenom;
 * displayAmount: number;
 * value: number;
 * symbol: CoinSymbol;
 * }} CoinValue
 *
 * @typedef {{
 * name: string;
 * denom:CoinDenom;
 * amount:string|null;
 * displayAmount: number|null;
 * value: number;
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
  if (!symbol) {
    console.log(`WARNING: cannot find coin for geckoId: ${geckoId}`);
  }
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
    // console.log(`cannot find symbol ${denom} `);
    return null;
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
      this.symbol = symbolToOsmoDenom(denom);
    }
    this.amount = '' + displayUnitsToDenomUnits(this.symbol, amount);
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
    amount: '' + displayUnitsToDenomUnits(symbol, amount)
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
      newCoin.amount = '' + (Number(newCoin.amount) - Number(c2.amount));
      if (
        coin.hasOwnProperty('displayAmount') &&
        c2.hasOwnProperty('displayAmount')
      )
        newCoin.displayAmount =
          Number(newCoin.displayAmount) - Number(c2.displayAmount);
      if (coin.hasOwnProperty('value') && c2.hasOwnProperty('value'))
        newCoin.value = Number(newCoin.value) - Number(c2.value);
    });
    return [...m, newCoin];
  }, []);
};

/**
 * @param {object} param0
 * @param {PriceHash} param0.prices
 * @param {CoinDenom} param0.denom
 * @param {number} param0.value - usd value
 * @returns {CoinValue}
 */
export const convertCoinValueToCoin = ({ prices, denom, value }) => {
  const price = prices[denom];
  const symbol = osmoDenomToSymbol(denom);
  if (isNaN(price)) {
    // console.log(`bad price for ${denom} NaN.`);
    return null;
  }
  const displayAmount = value / prices[denom];
  return {
    symbol,
    denom,
    amount: '' + displayUnitsToDenomUnits(symbol, displayAmount),
    displayAmount,
    value
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
  if (isNaN(displayAmount)) {
    // console.log('bad amount, NaN.');
    return null;
  }
  return {
    symbol,
    denom,
    amount,
    displayAmount,
    value: displayAmount * prices[denom]
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
 */
export const calculateCoinsTotalBalance = ({ prices, coins }) => {
  return convertCoinsToDisplayValues({ prices, coins }).reduce((m, v) => {
    const { value } = v;
    return value + m;
  }, 0);
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
      const value = pool.pricePerShare * Number(amount);
      return {
        denom,
        amount,
        value,
        allocation: Number(amount) / Number(pool.totalShares.amount),
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
  let totalValue = 0;
  pool.displayPoolAssets = poolAssets
    .map(({ token, weight }) => {
      const value = convertCoinToDisplayValues({ prices, coin: token });
      if (!value) return undefined;
      totalValue += value.value;
      return {
        token,
        weight,
        allocation: Long.fromString(weight) / Long.fromString(pool.totalWeight),
        symbol: osmoDenomToSymbol(token.denom),
        value
      };
    })
    .filter(Boolean);
  pool.totalValue = totalValue;
  // pool.pricePerShareL = Long.fromValue(totalValue) / Long.fromString(totalShares.amount),
  // TODO verify 10^18
  (pool.pricePerShare =
    (Number(totalValue) / Number(totalShares.amount)) * Math.pow(10, 18)),
    (pool.pricePerShare = Number(totalValue) / Number(totalShares.amount));

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

  if (totalDesired > totalCurrent) {
    throw new Error('insufficient balance');
  }

  const hasEnough = desired.reduce((m, { denom, amount }) => {
    const current = balances.find((c) => c.denom === denom);
    if (!current) return false;
    if (current.amount >= amount) return m && true;
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

    const diff = Number(coin.amount) - Number(desiredCoin.amount);
    if (diff <= 0) {
      return m;
    }

    return [
      ...m,
      {
        denom: coin.denom,
        amount: diff
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
    const diff = {
      denom: coin.denom,
      amount: Number(coin.amount) - Number(current.amount)
    };
    if (diff.amount <= 0) return m;
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

  if (desiredCoinsNeededValue > availableCoinsValue) {
    throw new Error(
      `not possible with current values (desired[${desiredCoinsNeededValue}] > available[${availableCoinsValue}])`
    );
  }

  // trades are required
  const trades = desiredCoinsNeededWithValues.reduce((m, coin) => {
    let valueNeeded = coin.value;
    for (let i = 0; i < availableCoinsWithValues.length; i++) {
      if (valueNeeded <= 0) continue;
      const current = availableCoinsWithValues[i];
      if (coin.symbol === current.symbol) continue;

      if (current.value >= valueNeeded) {
        // console.log(`I desired:${coin.symbol} avail:${current.symbol}`);
        // console.log(`I valueNeeded:${valueNeeded}`);
        // 1. value is more than what is needed
        // TAKE WHAT YOU NEED
        const leftOver = current.value - valueNeeded;
        const amountUsed = valueNeeded;
        valueNeeded -= amountUsed;

        m.push({
          sell: convertCoinValueToCoin({
            prices,
            denom: current.denom,
            value: amountUsed
          }),
          buy: convertCoinValueToCoin({
            prices,
            denom: coin.denom,
            value: amountUsed
          }),
          beliefValue: amountUsed
        });

        current.value = leftOver;
        availableCoinsWithValues[i].value = leftOver;
      } else if (current.value < valueNeeded) {
        // console.log(`II desired:${coin.symbol} avail:${current.symbol}`);
        // console.log(`II valueNeeded:${valueNeeded}`);
        // 2. value is less than what is needed
        // TAKE IT ALL!
        const amountUsed = current.value;
        valueNeeded -= amountUsed;

        m.push({
          sell: convertCoinValueToCoin({
            prices,
            denom: current.denom,
            value: amountUsed
          }),
          buy: convertCoinValueToCoin({
            prices,
            denom: coin.denom,
            value: amountUsed
          }),
          beliefValue: amountUsed
        });

        current.value = 0;
        availableCoinsWithValues[i].value = 0;
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
  let total = 0;
  const enriched = weights.map((item) => {
    if (!item.weight || item.weight <= 0)
      throw new Error('no non-positive weights');
    total += item.weight;
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

  return enriched.map((item) => ({
    ...item,
    allocation: item.weight / total,
    value:
      typeof totalCurrentValue === 'undefined'
        ? undefined
        : (totalCurrentValue * item.weight) / total
  }));
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
    return convertCoinValueToCoin({
      prices,
      denom: a.token.denom,
      value: weight.value * a.allocation
    });
  });

  if (typeof weight.value === 'undefined') {
    throw new Error('weight.value needs to be defined');
  }

  const allocation = {
    name: pool.name,
    denom: pool.totalShares.denom,
    amount:
      '' + (Number(pool.totalShares.amount) / pool.totalValue) * weight.value,
    // TODO determine the pool multipliers
    displayAmount: -1,
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

  const objs = cleaned.map((item) => {
    return {
      ...item,
      value: totalCurrentValue * item.allocation
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
    if (trade.sell.value === 0) return m;
    return [
      ...m,
      {
        trade,
        routes: lookupRoutesForTrade({ pools, trade, pairs })
      }
    ];
  }, []);
