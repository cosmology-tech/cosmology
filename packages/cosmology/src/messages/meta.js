import { osmosis } from '../proto/generated/codecimpl';

export const meta = {
  createPool: {
    osmosis: osmosis.gamm.v1beta1.MsgCreatePool,
    amino: '/osmosis.gamm.v1beta1.MsgCreatePool',
    type: 'osmosis/gamm/create-pool',
    gas: 250000
  },
  joinPool: {
    osmosis: osmosis.gamm.v1beta1.MsgJoinPool,
    amino: '/osmosis.gamm.v1beta1.MsgJoinPool',
    type: 'osmosis/gamm/join-pool',
    gas: 140000,
    shareCoinDecimals: 18
  },
  joinSwapExternAmountIn: {
    osmosis: osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn,
    amino: '/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn',
    type: 'osmosis/gamm/join-swap-extern-amount-in',
    gas: 140000,
    shareCoinDecimals: 18
  },
  exitPool: {
    osmosis: osmosis.gamm.v1beta1.MsgExitPool,
    amino: '/osmosis.gamm.v1beta1.MsgExitPool',
    type: 'osmosis/gamm/exit-pool',
    gas: 140000,
    shareCoinDecimals: 18
  },
  swapExactAmountIn: {
    osmosis: osmosis.gamm.v1beta1.MsgSwapExactAmountIn,
    amino: '/osmosis.gamm.v1beta1.MsgSwapExactAmountIn',
    type: 'osmosis/gamm/swap-exact-amount-in',
    gas: 250000
  },
  swapExactAmountOut: {
    osmosis: osmosis.gamm.v1beta1.MsgSwapExactAmountOut,
    amino: '/osmosis.gamm.v1beta1.MsgSwapExactAmountOut',
    type: 'osmosis/gamm/swap-exact-amount-out',
    gas: 250000
  },
  lockTokens: {
    osmosis: osmosis.lockup.MsgLockTokens,
    amino: '/osmosis.lockup.MsgLockTokens',
    type: 'osmosis/lockup/lock-tokens',
    gas: 250000
  },
  beginUnlocking: {
    osmosis: osmosis.lockup.MsgBeginUnlocking,
    amino: '/osmosis.lockup.MsgBeginUnlocking',
    type: 'osmosis/lockup/begin-unlock-period-lock',
    // Gas per msg
    gas: 140000
  },
  unlockPeriodLock: {
    type: 'osmosis/lockup/unlock-period-lock',
    // Gas per msg
    gas: 140000
  }
};
