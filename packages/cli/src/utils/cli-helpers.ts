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
    const rawPools = rpcPools.pools.map(({ value }) => {
        return osmosis.gamm.v1beta1.Pool.decode(value);
    });

    return rawPools;
}