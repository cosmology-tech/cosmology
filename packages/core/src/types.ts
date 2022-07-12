export interface BroadcastTxResponse {
    height: number;
    code: number;
    transactionHash: string;
    rawLog?: any;
}
export interface Pool {
    id: string;
    name: string;
    address: string;
    poolAssets: PoolAsset[];
    totalShares: Coin;
    totalWeight: string;
}
export interface PoolDisplay extends Pool {
    displayPoolAssets: PoolAssetDisplay[];
    pricePerShareEn18: string;
    totalValue: string;
}

export interface PoolPretty extends Pool {
    nickname: string;
    images: PoolTokenImage[] | null;
    poolAssetsPretty: PoolAssetPretty[]
}

export interface PoolTokenImage {
    token: CoinSymbol;
    images: {
        png: string;
        svg: string;
    }
}

export interface PoolAsset {
    token: Coin;
    weight: string;
}
export interface PoolAssetPretty {
    symbol: any;
    denom: string;
    amount: string;
    ratio: string;
    info: any;
}
export interface PoolAssetDisplay {
    allocation: string;
    symbol: CoinSymbol;
    token: Coin;
    value: DisplayCoin;
    weight: string;
}

export interface TradeRoute {
    poolId: string;
    tokenOutDenom: CoinDenom;
    tokenOutSymbol: CoinSymbol;
    tokenInSymbol: CoinSymbol;
    liquidity: string;
}
export interface Route {
    poolId: string;
    tokenOutDenom: CoinDenom;
};
export interface SwapAmountInRoute {
    poolId: string;
    tokenOutDenom: CoinDenom;
};
export interface SwapAmountOutRoute {
    poolId: string;
    tokenInDenom: CoinDenom;
}

export interface Swap {
    trade: Trade;
    routes: TradeRoute[];
};

export interface Pair {
    pool_address: string;
    pool_id: string;
    base_name: string;
    base_symbol: CoinSymbol;
    base_address: CoinDenom;
    quote_name: string;
    quote_symbol: CoinSymbol;
    quote_address: CoinDenom;
    price: number;
    base_volume_24h: number;
    quote_volume_24h: number;
    volume_24h: number;
    volume_7d: number;
    liquidity: number;
    liquidity_atom: number;
}
export interface LockedPool {
    amount: string;
    denom: CoinDenom;
}
export interface LockedPoolDisplay {
    amount: string;
    denom: CoinDenom;
    value: string;
    allocation: string;
    poolId: string;
}
export interface Coin {
    amount: string;
    denom: CoinDenom;
}
export interface CoinWeight {
    weight: string;
    type: 'coin' | 'pool';
    name: string;
    value: string | null;
    symbol: CoinSymbol | null;
    poolId: string | null;
    denom: CoinDenom;
    allocation: string;
}
export interface CoinValue {
    amount: string;
    denom: CoinDenom;
    displayAmount: string;
    value: string;
    symbol: CoinSymbol;
}
export interface PoolAllocation {
    name: string;
    denom: CoinDenom;
    amount: string | null;
    displayAmount: string | null;
    value: string;
    coins: CoinValue[];
}
export interface DisplayCoin {
    amount: string;
    symbol: CoinSymbol;
}
export interface Trade {
    sell: CoinValue
    buy: CoinValue;
    beliefValue: string;
}
export type CoinDenom = string;

export type CoinSymbol =
    'ATOM' |
    'OSMO' |
    'ION' |
    'AKT' |
    'DVPN' |
    'IRIS' |
    'CRO' |
    'XPRT' |
    'REGEN' |
    'IOV' |
    'NGM' |
    'EEUR' |
    'JUNO' |
    'LIKE' |
    'USTC' |
    'LUNC' |
    'BCNA' |
    'SCRT' |
    'MED';

export type CoinGeckoToken =
    'cosmos' |
    'osmosis' |
    'ion' |
    'akash-network' |
    'sentinel' |
    'iris-network' |
    'crypto-com-chain' |
    'persistence' |
    'regen' |
    'starname' |
    'e-money' |
    'e-money-eur' |
    'juno-network' |
    'likecoin' |
    'terrausd' |
    'terra-luna' |
    'bitcanna' |
    'terra-krw' |
    'secret' |
    'medibloc' |
    'comdex' |
    'cheqd-network' |
    'vidulum';

export interface PriceHash {
    [key: CoinDenom]: number;
}

export interface CoinGeckoUSD {
    usd: number;
};

export type CoinGeckoUSDResponse = Record<CoinGeckoToken, CoinGeckoUSD>


export interface ValidatorToken {
    price: number;
    denom: CoinDenom;
    symbol: CoinSymbol;
    liquidity: number;
    liquidity_24h_change: number;
    volume_24h: number;
    volume_24h_change: number;
    name: string;
};

export interface ValidatorTokenPrice {
    price: number;
}

export interface ValidatorCoinApr {
    start_date: string;
    denom: CoinDenom;
    symbol: CoinSymbol;
    apr_1d: number;
    apr_7d: number;
    apr_14d: number;
}

export interface ValidatorPoolApr {
    pool_id: number;
    apr_list: ValidatorCoinApr[]
}

export interface ValidatorPair {
    pool_address: string;
    pool_id: string;
    base_name: string;
    base_symbol: CoinSymbol;
    base_address: CoinDenom;
    quote_name: string;
    quote_symbol: CoinSymbol;
    quote_address: CoinDenom;
    price: number;
    base_volume_24h: number;
    quote_volume_24h: number;
    volume_24h: number;
    volume_7d: number;
    liquidity: number;
    liquidity_atom: number;
}

export type GammPoolDenom = string;
export interface PrettyPool {
    id: string;
    address: string;
    denom: GammPoolDenom;
    nickname: string;
    liquidity: string;
    tokens: PrettyPoolAsset[]
};
export interface PromptValue {
    name: string;
    value: any;
};
export interface PrettyPair extends PrettyPool {
    pool_address: string;
    base_name: string;
    base_symbol: string;
    base_address: string;
    quote_name: string;
    quote_symbol: string;
    quote_address: string;
};

export interface PrettyPoolAsset {
    denom: CoinDenom;
    symbol: CoinSymbol;
    amount: string;
    weight: string;
    ratio: string;
    price: number;
    value: string;
};

export interface LcdPool {
    "@type": string;
    address: string;
    id: string;
    "poolParams": {
        "swapFee": string;
        "exitFee": string;
    }
    future_pool_governor: string;
    totalShares: {
        denom: GammPoolDenom;
        amount: string;
    }
    poolAssets: PoolAsset[],
    totalWeight: string;
};

export interface OsmosisDenomUnit {
    denom: CoinDenom;
    exponent: number;
    aliases?: string[]
}
export interface OsmosisAsset {
    description: string;
    denom_units: OsmosisDenomUnit[];
    base: CoinDenom;
    name: string;
    display: string;
    symbol: CoinSymbol;
    ibc: {
        source_channel: string;
        dst_channel: string;
        source_denom: string;
    },
    logo_URIs: {
        svg: string;
        png: string;
    },
    coingecko_id: string;
};
