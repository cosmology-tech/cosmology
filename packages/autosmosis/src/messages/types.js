const parseRoutes = (routes) =>
  routes.map((r) => {
    return {
      poolId: r.poolId,
      tokenOutDenom: r.tokenOutDenom
    };
  });

export const aminos = {
  createPool: {
    toAmino: () => {},
    fromAmino: () => {}
  },
  joinPool: {
    toAmino: ({ sender, poolId, tokenIn, shareOutAmount, tokenInMaxs }) => ({
      sender,
      poolId,
      tokenIn,
      shareOutAmount,
      tokenInMaxs
    }),
    fromAmino: ({ sender, poolId, tokenIn, shareOutAmount, tokenInMaxs }) => ({
      sender,
      poolId,
      tokenIn,
      shareOutAmount,
      tokenInMaxs
    })
  },
  joinSwapExternAmountIn: {
    toAmino: () => {},
    fromAmino: () => {}
  },
  exitPool: {
    toAmino: () => {},
    fromAmino: () => {}
  },
  swapExactAmountIn: {
    toAmino: ({ sender, routes, tokenIn, tokenOutMinAmount }) => ({
      sender,
      routes: parseRoutes(routes),
      tokenIn,
      tokenOutMinAmount
    }),
    fromAmino: ({ sender, routes, tokenIn, tokenOutMinAmount }) => ({
      sender,
      routes: parseRoutes(routes),
      tokenIn,
      tokenOutMinAmount
    })
  },
  swapExactAmountOut: {
    toAmino: () => {},
    fromAmino: () => {}
  },
  lockTokens: {
    toAmino: ({ owner, duration, coins }) => ({
      owner,
      duration,
      coins
    }),
    fromAmino: ({ owner, duration, coins }) => ({
      owner,
      duration,
      coins
    })
  },
  beginUnlocking: {
    toAmino: () => {},
    fromAmino: () => {}
  },
  unlockPeriodLock: {
    toAmino: () => {},
    fromAmino: () => {}
  }
};
