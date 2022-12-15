// osmo specific utils
import { assets as osmosisAssets } from '../../assets';
import {
  displayUnitsToDenomUnits,
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue,
  dollarValueToDenomUnits,
  baseUnitsToDollarValueByDenom
} from '../chain';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import { noDecimals } from '../../messages';
import {
  Coin,
  CoinDenom,
  CoinGeckoToken,
  CoinGeckoUSDResponse,
  CoinSymbol,
  CoinValue,
  CoinWeight,
  DisplayCoin,
  LcdPool,
  LockedPool,
  LockedPoolDisplay,
  Pool,
  PoolAllocation,
  PoolDisplay,
  PoolPretty,
  PrettyPair,
  PrettyPool,
  PriceHash,
  PromptValue,
  Swap,
  Trade,
  TradeRoute,
  ValidatorToken,
  OsmosisAsset
} from '../../types';

export const getCoinGeckoIdForSymbol = (token: CoinSymbol): CoinGeckoToken => {
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
export const getSymbolForCoinGeckoId = (geckoId: CoinGeckoToken): CoinSymbol => {
  const rec = osmosisAssets.find(
    ({ coingecko_id }) => coingecko_id === geckoId
  );
  const symbol = rec?.symbol;
  // if (!symbol) {
  // console.log(`WARNING: cannot find coin for geckoId: ${geckoId}`);
  // }
  return symbol;
};

export const osmoDenomToSymbol = (denom: CoinDenom): CoinSymbol => {
  const rec = osmosisAssets.find(({ base }) => base === denom);
  const symbol = rec?.symbol;
  if (!symbol) {
    return denom;
  }
  return symbol;
};


export const getOsmoAssetByDenom = (denom: CoinDenom): OsmosisAsset => {
  return osmosisAssets.find((asset) => asset.base === denom);
};

export const symbolToOsmoDenom = (token: CoinSymbol): CoinDenom => {
  const rec = osmosisAssets.find(({ symbol }) => symbol === token);
  const base = rec?.base;
  if (!base) {
    console.log(`cannot find base for token ${token}`);
    return null;
  }
  return base;
};

export class OsmosisToken {
  symbol: CoinSymbol | null;
  denom: CoinDenom | null;
  amount: string;
  constructor({ symbol, denom, amount = '0' }: { symbol: CoinSymbol | null, denom: CoinDenom | null, amount: string }) {
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

export const symbolsAndDisplayValuesToCoinsArray = (coins: DisplayCoin[]): Coin[] =>
  coins.map(({ symbol, amount }) => ({
    denom: symbolToOsmoDenom(symbol),
    amount: displayUnitsToDenomUnits(symbol, amount)
  }));

export const substractCoins = (balances1: CoinValue[], balances2: CoinValue[]): CoinValue[] => {
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
export const addCoins = (balances1: CoinValue[], balances2: CoinValue[]): CoinValue[] => {
  return balances1.reduce((m, coin) => {
    const newCoin = { ...coin };
    const coins = balances2.filter(({ denom }) => denom == coin.denom);
    coins.forEach((c2) => {
      const a = new Dec(newCoin.amount);
      const b = new Dec(c2.amount);
      newCoin.amount = a.add(b).toString();
      if (
        coin.hasOwnProperty('displayAmount') &&
        c2.hasOwnProperty('displayAmount')
      ) {
        const a = new Dec(newCoin.displayAmount);
        const b = new Dec(c2.displayAmount);
        newCoin.displayAmount = a.add(b).toString();
      }
      if (coin.hasOwnProperty('value') && c2.hasOwnProperty('value')) {
        const a = new Dec(newCoin.value);
        const b = new Dec(c2.value);
        newCoin.value = a.add(b).toString();
      }
    });
    return [...m, newCoin];
  }, []);
};

export const convertCoinValueToCoin = (
  { prices, denom, value }: { prices: PriceHash, denom: CoinDenom, value: string | number }
): CoinValue => {
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

export const convertCoinToDisplayValues = ({ prices, coin }: { prices: PriceHash, coin: Coin }): CoinValue => {
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

export const convertCoinsToDisplayValues = ({ prices, coins }: { prices: PriceHash, coins: Coin[] }): CoinValue[] =>
  coins.map((coin) => convertCoinToDisplayValues({ prices, coin })).filter(Boolean);

export const calculateCoinsTotalBalance = ({ prices, coins }: { prices: PriceHash, coins: Coin[] }): string => {
  return convertCoinsToDisplayValues({ prices, coins }).reduce((m, v) => {
    try {
      const { value } = v;
      const val = new Dec(value);
      const mv = new Dec(m);
      return val.add(mv).toString();
    } catch (e) {
      return m;
    }
  }, '0');
};

export const convertGeckoPricesToDenomPriceHash = (prices: CoinGeckoUSDResponse): PriceHash => {
  return Object.keys(prices).reduce((m, geckoId) => {
    const symbol = getSymbolForCoinGeckoId(geckoId);
    if (symbol) {
      const denom = symbolToOsmoDenom(symbol);
      m[denom] = prices[geckoId].usd;
    }
    return m;
  }, {});
};

export const convertValidatorPricesToDenomPriceHash = (tokens: ValidatorToken[]): PriceHash => {
  return tokens.reduce((m, token) => {
    m[token.denom] = token.price;
    return m;
  }, {});
};

export const getPoolByGammName = (pools: PoolDisplay[], gammId: string): PoolDisplay => {
  return pools.find(({ totalShares: { denom } }) => denom === gammId);
};

export const getPoolInfo = ({ prices, pools, poolId }: { prices: PriceHash, pools: Pool[], poolId: string }): PoolDisplay => {
  const pool = pools.find(({ id }) => id === poolId);
  if (!pool) throw new Error('cannot find pool');
  return convertPoolToDisplayValues({ prices, pool });
};

export const getUserPools = ({ pools, lockedPools }: { pools: PoolDisplay[], lockedPools: LockedPool[] }): LockedPoolDisplay[] => {
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

export const convertPoolToDisplayValues = ({ prices, pool }: { prices: PriceHash, pool: Pool }): PoolDisplay => {
  const { totalShares, poolAssets } = pool;

  const enrichedPool: PoolDisplay = { ...pool };
  let totalValue = new Dec(0);
  enrichedPool.displayPoolAssets = poolAssets
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

  enrichedPool.totalValue = totalValue.toString();

  const ta = new Dec(totalShares.amount);
  const totalSharesAmount = new IntPretty(ta);
  const totalVal = new IntPretty(totalValue);

  if (ta.lte(new Dec(0))) {
    enrichedPool.pricePerShareEn18 = '0';
  } else {
    enrichedPool.pricePerShareEn18 = totalVal
      .maxDecimals(18)
      .quo(totalSharesAmount.moveDecimalPointLeft(18).maxDecimals(18))
      // .moveDecimalPointLeft(18)
      .locale(false)
      .toString();
  }

  enrichedPool.name = enrichedPool.displayPoolAssets
    .reduce((m, v) => {
      return [...m, v.symbol];
    }, [])
    .join('/');

  return enrichedPool;
};

export const convertPoolsToDisplayValues = ({ prices, pools }: { prices: PriceHash, pools: Pool[] }) =>
  pools.map((pool) => convertPoolToDisplayValues({ prices, pool }));

export const getFilteredPoolsWithValues = ({ prices, pools }: { prices: PriceHash, pools: Pool[] }) =>
  convertPoolsToDisplayValues({ prices, pools });
// remove small pools
// .filter(({ totalValue }) => totalValue >= 100000)
// remove DIG or VIDL or coins not on coingecko that don't get prices
// .filter(({ poolAssets, displayPoolAssets }) => poolAssets.length === displayPoolAssets.length);

export const getTradesRequiredToGetBalances = ({
  prices,
  balances,
  desired
}: {
  prices: PriceHash,
  balances: Coin[],
  desired: Coin[]
}): Trade[] => {
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
 * this is used to canonicalize CoinWeights so a user can
 * pass in only some properties, like poolId, or symbol, etc.,
 * and it will determine the denom, etc.
 */

export const canonicalizeCoinWeights = ({
  weights,
  pools,
  prices,
  totalCurrentValue
}: {
  weights: CoinWeight[],
  pools: Pool[],
  prices: PriceHash,
  totalCurrentValue: string | number | undefined
}): CoinWeight[] => {
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

export const poolAllocationToCoinsNeeded = (
  { pools, prices, weight }:
    { pools: PoolDisplay[], prices: PriceHash, weight: CoinWeight }
): PoolAllocation => {
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

export const convertWeightsIntoCoins = ({
  weights,
  pools,
  prices,
  balances
}: {
  weights: CoinWeight[],
  pools: PoolDisplay[],
  prices: PriceHash,
  balances: Coin[]
}): {
  pools: PoolAllocation[];
  coins: CoinValue[];
  weights: CoinWeight[];
} => {
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

export const routeThroughPool = ({ denom, trade, pairs }: { denom: CoinDenom, trade: Trade, pairs: PrettyPair[] }): TradeRoute[] => {
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
        poolId: sellPool.id,
        tokenOutDenom: denom,
        tokenOutSymbol: symbol,
        tokenInSymbol: trade.sell.symbol,
        liquidity: sellPool.liquidity
      },
      {
        poolId: buyPool.id,
        tokenOutDenom: trade.buy.denom,
        tokenOutSymbol: trade.buy.symbol,
        tokenInSymbol: symbol,
        liquidity: buyPool.liquidity
      }
    ];

    return routes;
  }
};

export const lookupRoutesForTrade = ({ trade, pairs }: { trade: Trade, pairs: PrettyPair[] }): TradeRoute[] => {
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
        poolId: directPool.id,
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

export const getSwaps = ({ trades, pairs }: { trades: Trade[], pairs: PrettyPair[] }): Swap[] =>
  trades.reduce((m, trade) => {
    // not sure why, but sometimes we get a zero amount
    if (new Dec(trade.sell.value).lte(new Dec(0.0001))) return m;
    return [
      ...m,
      {
        trade,
        routes: lookupRoutesForTrade({ trade, pairs })
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

export const calculateShareOutAmount = (poolInfo: Pool, coinsNeeded: Coin[]) => {
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

export const calculateCoinsNeededInPoolForValue = (prices: PriceHash, poolInfo: PoolPretty, value) => {
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
      try {
        const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
        if (new Dec(displayAmount).lt(new Dec(0.0001))) return;
        if (!sell.includes(symbol)) return;
        return {
          symbol,
          denom,
          amount,
          displayAmount
        };
      } catch (e) {
        // likely unknown denom
        return;
      }
    })
    .filter(Boolean);
};

export const getSellableBalanceTelescopeVersion = async ({ client, address, sell }) => {
  const accountBalances = await client.cosmos.bank.v1beta1.allBalances({
    address
  });
  return accountBalances.balances
    .map(({ denom, amount }) => {
      const symbol = osmoDenomToSymbol(denom);
      try {
        const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
        if (new Dec(displayAmount).lt(new Dec(0.0001))) return;
        if (!sell.includes(symbol)) return;
        return {
          symbol,
          denom,
          amount,
          displayAmount
        };
      } catch (e) {
        // likely unknown denom
        return;
      }
    })
    .filter(Boolean);
};

export const makeLcdPoolPretty = (
  prices: PriceHash,
  pool: LcdPool
): PrettyPool => {

  const tokens = pool.poolAssets.map(asset => {
    const denom: CoinDenom = asset.token.denom;
    const amount = asset.token.amount;
    const symbol: CoinSymbol = osmoDenomToSymbol(denom) || denom;
    const price = prices[asset.token.denom] || 0;
    if (!price && !prices.hasOwnProperty(asset.token.denom)) {
      return null;
    }
    let value;
    try {
      value = baseUnitsToDollarValueByDenom(prices, denom, amount);
    } catch (e) {
      value = '0.0'
    }
    return {
      price,
      weight: asset.weight,
      denom,
      symbol,
      amount,
      ratio: new Dec(asset.weight).quo(new Dec(pool.totalWeight)).toString(),
      value
    };
  }).filter(Boolean);

  const liquidity = tokens.reduce((m, v) => {
    return m.add(new Dec(v.value))
  }, new Dec('0')).toString()

  const nickname = tokens.reduce((m, v) => {
    return [...m, v.symbol];
  }, []).join('/');

  return {
    id: pool.id,
    address: pool.address,
    denom: `gamm/pool/${pool.id}`,
    nickname,
    liquidity,
    tokens
  }
};

export const makePoolsPrettyValues = (
  pools: PrettyPool[],
  liquidityLimit = 100_000
): PromptValue[] => {
  return pools
    .map((pool) => {
      if (new Dec(pool.liquidity).gt(new Dec(liquidityLimit))) {
        return {
          name: pool.nickname,
          value: pool.id
        };
      }
    })
    .filter(Boolean);
};

export const makePoolsPretty = (
  prices: PriceHash,
  pools: LcdPool[]
): PrettyPool[] => {
  return pools
    // filter bc some some coins can be null if unsupported
    .map((pool) => makeLcdPoolPretty(prices, pool))
    .filter(Boolean);
};