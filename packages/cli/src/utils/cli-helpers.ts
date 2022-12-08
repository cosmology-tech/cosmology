import Long from 'long';

export const getPoolsDecoded = async (osmosis, client) => {
    const rpcPools = await client.osmosis.gamm.v1beta1.pools({
        pagination: {
            key: new Uint8Array(),
            offset: Long.fromNumber(0),
            limit: Long.fromNumber(1500),
            countTotal: false,
            reverse: false
        }
    });
    const rawPools = rpcPools.pools.map((data) => {
        switch (data.typeUrl) {
          case '/osmosis.gamm.poolmodels.stableswap.v1beta1.Pool':
            // return osmosis.gamm.poolmodels.stableswap.v1beta1.Pool.decode(data.value);
            // we need to fix `makeLcdPoolPretty()` and other calc's
            return null;
          case '/osmosis.gamm.v1beta1.Pool':
            return osmosis.gamm.v1beta1.Pool.decode(data.value);
          default:
            throw new Error ('unknown pool type')
        }
      }).filter(Boolean)
    
    return rawPools;
}