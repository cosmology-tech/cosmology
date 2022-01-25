// target 50/50 70/30
// weights per pol (30% on LP1)
// isolate for current LP
// then work on other LP

import { CoinGeckoToken, getPrice } from '../clients/coingecko';
import { Token } from '../model/Token';

/**
 *
 * @param {object} param0
 * @param {Token} param0.sourceToken
 * @param {Token} param0.targetToken
 * @param {number} param0.sourcePrice
 * @param {number} param0.targetPrice
 * @param {number} param0.targetAlloc
 * @param {number} param0.assignedPoolPurchaseAmount
 *
 * @return {import('../types').Swap}
 */
function constructSwap({
  sourceToken,
  targetToken,
  sourcePrice,
  targetPrice,
  targetAlloc,
  assignedPoolPurchaseAmount
}) {
  //   const priceRatio = targetPrice / sourcePrice; //TODO: check order

  // we want the amount of source token to ape in here:
  // targetAlloc * assignedPoolPurchaseAmount is the amount of target token we will end up with
  // targetAlloc * assignedPoolPurchaseAmount / priceRatio is just giving us the target token in terms of our source (think I want to  end up with 3 OSMO worth of LUNA - where LUNA is the target)
  //   const inAmount = (targetAlloc * assignedPoolPurchaseAmount) / priceRatio;

  // no longer using priceRatio if consolidating into one coin (targetWeight% == sourceWeight%)
  const inAmount = targetAlloc * assignedPoolPurchaseAmount;

  return {
    inToken: sourceToken,
    outToken: targetToken,
    inAmount
  };
}

/**
 *
 * @param {object} param0
 * @param {Token[]} param0.poolPair pool to rebalance for
 * @param {number[]} param0.poolAlloc the pool allocation (50/50, 70/30, etc)
 * @param {number} param0.assignedPoolPurchaseWeight e.g. I want to allocate 0.3 (30%) of my rewards to this
 * @param {Token} param0.rewardToken e.g. I want to allocate 30% of my rewards to this
 * @param {number} param0.currentBalance the balance of rewardToken
 * @param {number} param0.prices the prices of all osmosis tokens via coinngecko.getPrice
 *
 * @returns {Promise<import('../types').Swap[]>}
 */
export async function getSwapsForRebalance({
  poolPair,
  poolAlloc,
  assignedPoolPurchaseWeight,
  rewardToken,
  currentBalance,
  prices
}) {
  if (rewardToken.isEqual(poolPair[1])) {
    // operate on the tokens in order
    poolPair = poolPair.reverse();
  }

  const [poolPrice1, poolPrice2] = poolPair.map(
    (token) => prices[token.geckoName]
  );

  /** @type {import('../types').Swap[]} */
  const swaps = [];

  if (rewardToken === poolPair[0]) {
    //just  swap for the opposite pair

    swaps.push(
      constructSwap({
        sourceToken: rewardToken,
        targetToken: poolPair[1],
        sourcePrice: prices[rewardToken.geckoName].usd,
        targetPrice: poolPrice2.usd,
        // we want to buy targetAlloc % of target token
        targetAlloc: poolAlloc[1],
        assignedPoolPurchaseAmount: assignedPoolPurchaseWeight * currentBalance
      })
    );
  } else {
    // same as above, just do it twice

    swaps.push(
      constructSwap({
        sourceToken: rewardToken,
        targetToken: poolPair[0],
        sourcePrice: prices[rewardToken.geckoName].usd,
        targetPrice: poolPrice1.usd,
        targetAlloc: poolAlloc[0],
        assignedPoolPurchaseAmount: assignedPoolPurchaseWeight * currentBalance
      })
    );

    swaps.push(
      constructSwap({
        sourceToken: rewardToken,
        targetToken: poolPair[1],
        sourcePrice: prices[rewardToken.geckoName].usd,
        targetPrice: poolPrice2.usd,
        targetAlloc: poolAlloc[1],
        assignedPoolPurchaseAmount: assignedPoolPurchaseWeight * currentBalance
      })
    );
  }

  return swaps;
}
