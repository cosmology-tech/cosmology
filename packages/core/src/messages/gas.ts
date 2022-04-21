export const gas = {
  osmosis: {
    createPool: {
      gas: 250000
    },
    joinPool: {
      gas: 140000,
      shareCoinDecimals: 18
    },
    joinSwapExternAmountIn: {
      gas: 140000,
      shareCoinDecimals: 18
    },
    exitPool: {
      gas: 140000,
      shareCoinDecimals: 18
    },
    swapExactAmountIn: {
      gas: 250000
    },
    swapExactAmountOut: {
      gas: 250000
    },
    lockTokens: {
      gas: 250000
    },
    beginUnlocking: {
      gas: 140000
    },
    unlockPeriodLock: {
      gas: 140000
    }
  }
};
