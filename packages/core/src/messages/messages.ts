import { generateOsmoMessage as osmo } from './utils';
import { Coin } from '@cosmjs/amino';
import { SwapAmountInRoute, SwapAmountOutRoute } from '../types';

export const messages = {
  createPool: () => {
    throw new Error('not supported yet, contact maintainers.');
  },
  joinPool: (
    { sender, poolId, shareOutAmount, tokenInMaxs }
      :
      { sender: string, poolId: string, shareOutAmount: string, tokenInMaxs: Coin[] }) =>
    osmo('joinPool', {
      sender,
      poolId,
      shareOutAmount,
      tokenInMaxs
    }),
  joinSwapExternAmountIn: (
    { sender, poolId, tokenIn, shareOutMinAmount }
      :
      { sender: string, poolId: string, tokenIn: Coin, shareOutMinAmount: string }
  ) =>
    osmo('joinSwapExternAmountIn', {
      sender,
      poolId,
      tokenIn,
      shareOutMinAmount
    }),
  exitPool: () => {
    throw new Error('not supported yet, contact maintainers.');
  },
  swapExactAmountIn: (
    { sender, routes, tokenIn, tokenOutMinAmount }
      :
      { sender: string, routes: SwapAmountInRoute[], tokenIn: Coin, tokenOutMinAmount: string }
  ) =>
    osmo('swapExactAmountIn', {
      sender,
      routes,
      tokenIn,
      tokenOutMinAmount
    }),

  swapExactAmountOut: (
    { sender, routes, tokenOut, tokenInMaxAmount }
      :
      { sender: string, routes: SwapAmountOutRoute[], tokenOut: Coin, tokenInMaxAmount: string }
  ) =>
    osmo('swapExactAmountOut', {
      sender,
      routes,
      tokenOut,
      tokenInMaxAmount
    }),

  lockTokens: (
    { owner, duration, coins }
      :
      { owner: string, duration: string, coins: Coin[] }
  ) =>
    osmo('lockTokens', { owner, duration, coins }),
  beginUnlocking: () => {
    throw new Error('not supported yet, contact maintainers.');
  },
  unlockPeriodLock: () => {
    throw new Error('not supported yet, contact maintainers.');
  }
};
