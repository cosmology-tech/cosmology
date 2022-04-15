import { generateOsmoMessage as osmo } from './utils';
import { Coin } from '@cosmjs/amino';
import { Route } from '../types';

export const messages = {
  createPool: () => {
    //
  },
  /**
   * @param {object} param0
   * @param {string} param0.sender
   * @param {string} param0.poolId
   * @param {string} param0.shareOutAmount
   * @param {Coin[]} param0.tokenInMaxs
   */
  joinPool: ({ sender, poolId, shareOutAmount, tokenInMaxs }) =>
    osmo('joinPool', {
      sender,
      poolId,
      shareOutAmount,
      tokenInMaxs
    }),
  /**
   * @param {object} param0
   * @param {string} param0.sender
   * @param {string} param0.poolId
   * @param {Coin} param0.tokenIn
   * @param {string} param0.shareOutMinAmount
   */
  joinSwapExternAmountIn: ({ sender, poolId, tokenIn, shareOutMinAmount }) =>
    osmo('joinSwapExternAmountIn', {
      sender,
      poolId,
      tokenIn,
      shareOutMinAmount
    }),
  exitPool: () => {
    //
  },
  /**
   * @param {object} param0
   * @param {string} param0.sender
   * @param {Route[]} param0.routes
   * @param {Coin} param0.tokenIn
   * @param {string} param0.tokenOutMinAmount
   */
  swapExactAmountIn: ({ sender, routes, tokenIn, tokenOutMinAmount }) =>
    osmo('swapExactAmountIn', {
      sender,
      routes,
      tokenIn,
      tokenOutMinAmount
    }),
  swapExactAmountOut: () => {
    //
  },
  /**
   * @param {object} param0
   * @param {string} param0.owner
   * @param {string} param0.duration
   * @param {Coin[]} param0.coins
   */
  lockTokens: ({ owner, duration, coins }) =>
    osmo('lockTokens', { owner, duration, coins }),
  beginUnlocking: () => {
    //
  },
  unlockPeriodLock: () => {
    //
  }
};