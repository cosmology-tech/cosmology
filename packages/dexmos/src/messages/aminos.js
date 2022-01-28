import Long from 'long';

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
    toAmino: ({ sender, poolId, shareOutAmount, tokenInMaxs }) => ({
      sender,
      poolId,
      shareOutAmount,
      tokenInMaxs
    }),
    fromAmino: ({ sender, poolId, shareOutAmount, tokenInMaxs }) => ({
      sender,
      poolId,
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
    toAmino: ({ owner, duration, coins }) => {
      return {
        owner, 
        coins,
        duration: (duration * 1_000_000_000).toString(),
      }

    },
    fromAmino: ({ owner, duration, coins }) => {
      return {
        owner, 
        coins,
        duration: {
          seconds: Long.fromNumber(Math.floor(parseInt(duration) / 1_000_000_000)),
          nanos: parseInt(duration) % 1_000_000_000,
        }
      }
    }
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
