
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
    liquidity: number;
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
    'UST' |
    'LUNA' |
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

