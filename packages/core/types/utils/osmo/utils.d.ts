import { Coin, CoinDenom, CoinGeckoToken, CoinGeckoUSDResponse, CoinSymbol, CoinValue, CoinWeight, DisplayCoin, LcdPool, LockedPool, LockedPoolDisplay, Pool, PoolAllocation, PoolDisplay, PoolPretty, PrettyPair, PrettyPool, PriceHash, PromptValue, Swap, Trade, TradeRoute, ValidatorToken, OsmosisAsset } from '../../types';
export declare const getCoinGeckoIdForSymbol: (token: CoinSymbol) => CoinGeckoToken;
/**
 * @param {CoinGeckoToken} geckoId
 * @returns {CoinSymbol}
 */
export declare const getSymbolForCoinGeckoId: (geckoId: CoinGeckoToken) => CoinSymbol;
export declare const osmoDenomToSymbol: (denom: CoinDenom) => CoinSymbol;
export declare const getOsmoAssetByDenom: (denom: CoinDenom) => OsmosisAsset;
export declare const symbolToOsmoDenom: (token: CoinSymbol) => CoinDenom;
export declare class OsmosisToken {
    symbol: CoinSymbol | null;
    denom: CoinDenom | null;
    amount: string;
    constructor({ symbol, denom, amount }: {
        symbol: CoinSymbol | null;
        denom: CoinDenom | null;
        amount: string;
    });
    /**
     * @returns {Coin}
     */
    toJSON(): {
        denom: string;
        amount: string;
    };
}
export declare const symbolsAndDisplayValuesToCoinsArray: (coins: DisplayCoin[]) => Coin[];
export declare const substractCoins: (balances1: CoinValue[], balances2: CoinValue[]) => CoinValue[];
export declare const addCoins: (balances1: CoinValue[], balances2: CoinValue[]) => CoinValue[];
export declare const convertCoinValueToCoin: ({ prices, denom, value }: {
    prices: PriceHash;
    denom: CoinDenom;
    value: string | number;
}) => CoinValue;
export declare const convertCoinToDisplayValues: ({ prices, coin }: {
    prices: PriceHash;
    coin: Coin;
}) => CoinValue;
export declare const convertCoinsToDisplayValues: ({ prices, coins }: {
    prices: PriceHash;
    coins: Coin[];
}) => CoinValue[];
export declare const calculateCoinsTotalBalance: ({ prices, coins }: {
    prices: PriceHash;
    coins: Coin[];
}) => string;
export declare const convertGeckoPricesToDenomPriceHash: (prices: CoinGeckoUSDResponse) => PriceHash;
export declare const convertValidatorPricesToDenomPriceHash: (tokens: ValidatorToken[]) => PriceHash;
export declare const getPoolByGammName: (pools: PoolDisplay[], gammId: string) => PoolDisplay;
export declare const getPoolInfo: ({ prices, pools, poolId }: {
    prices: PriceHash;
    pools: Pool[];
    poolId: string;
}) => PoolDisplay;
export declare const getUserPools: ({ pools, lockedPools }: {
    pools: PoolDisplay[];
    lockedPools: LockedPool[];
}) => LockedPoolDisplay[];
export declare const convertPoolToDisplayValues: ({ prices, pool }: {
    prices: PriceHash;
    pool: Pool;
}) => PoolDisplay;
export declare const convertPoolsToDisplayValues: ({ prices, pools }: {
    prices: PriceHash;
    pools: Pool[];
}) => PoolDisplay[];
export declare const getFilteredPoolsWithValues: ({ prices, pools }: {
    prices: PriceHash;
    pools: Pool[];
}) => PoolDisplay[];
export declare const getTradesRequiredToGetBalances: ({ prices, balances, desired }: {
    prices: PriceHash;
    balances: Coin[];
    desired: Coin[];
}) => Trade[];
/**
 * this is used to canonicalize CoinWeights so a user can
 * pass in only some properties, like poolId, or symbol, etc.,
 * and it will determine the denom, etc.
 */
export declare const canonicalizeCoinWeights: ({ weights, pools, prices, totalCurrentValue }: {
    weights: CoinWeight[];
    pools: Pool[];
    prices: PriceHash;
    totalCurrentValue: string | number | undefined;
}) => CoinWeight[];
export declare const poolAllocationToCoinsNeeded: ({ pools, prices, weight }: {
    pools: PoolDisplay[];
    prices: PriceHash;
    weight: CoinWeight;
}) => PoolAllocation;
export declare const convertWeightsIntoCoins: ({ weights, pools, prices, balances }: {
    weights: CoinWeight[];
    pools: PoolDisplay[];
    prices: PriceHash;
    balances: Coin[];
}) => {
    pools: PoolAllocation[];
    coins: CoinValue[];
    weights: CoinWeight[];
};
export declare const routeThroughPool: ({ denom, trade, pairs }: {
    denom: CoinDenom;
    trade: Trade;
    pairs: PrettyPair[];
}) => TradeRoute[];
export declare const lookupRoutesForTrade: ({ trade, pairs }: {
    trade: Trade;
    pairs: PrettyPair[];
}) => TradeRoute[];
export declare const getSwaps: ({ trades, pairs }: {
    trades: Trade[];
    pairs: PrettyPair[];
}) => Swap[];
export declare const calculateAmountWithSlippage: (amount: any, slippage: any) => string;
export declare const calculateShareOutAmount: (poolInfo: Pool, coinsNeeded: Coin[]) => any;
export declare const calculateCoinsNeededInPoolForValue: (prices: PriceHash, poolInfo: PoolPretty, value: any) => {
    symbol: any;
    denom: string;
    amount: string;
    displayAmount: string;
    shareTotalValue: string;
    totalDollarValue: string;
    unitRatio: string;
}[];
export declare const calculateMaxCoinsForPool: (prices: any, poolInfo: any, balances: any) => any;
export declare const getSellableBalance: ({ client, address, sell }: {
    client: any;
    address: any;
    sell: any;
}) => Promise<any>;
export declare const getSellableBalanceTelescopeVersion: ({ client, address, sell }: {
    client: any;
    address: any;
    sell: any;
}) => Promise<any>;
export declare const makeLcdPoolPretty: (prices: PriceHash, pool: LcdPool) => PrettyPool;
export declare const makePoolsPrettyValues: (pools: PrettyPool[], liquidityLimit?: number) => PromptValue[];
export declare const makePoolsPretty: (prices: PriceHash, pools: LcdPool[]) => PrettyPool[];
