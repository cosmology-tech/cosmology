import { PriceHash } from '../types';
/**
 * @typedef {('cosmos'|
 * 'osmosis'|
 * 'ion'|
 * 'akash-network'|
 * 'sentinel'|
 * 'iris-network'|
 * 'crypto-com-chain'|
 * 'persistence'|
 * 'regen'|
 * 'starname'|
 * 'e-money'|
 * 'e-money-eur'|
 * 'juno-network'|
 * 'likecoin'|
 * 'terrausd'|
 * 'terra-luna'|
 * 'bitcanna'|
 * 'terra-krw'|
 * 'secret'|
 * 'medibloc'|
 * 'comdex'|
 * 'stargaze'|
 * 'chihuahua-token'|
 * 'cheqd-network'|
 * 'vidulum')} CoinGeckoToken
 *
 * @typedef {Object.<CoinGeckoToken, {usd: number}>} TokenPricesUSDResponse
 *
 */
export declare const CoinGeckoToken: {
    cosmos: string;
    osmosis: string;
    ion: string;
    'akash-network': string;
    sentinel: string;
    'iris-network': string;
    'crypto-com-chain': string;
    persistence: string;
    regen: string;
    starname: string;
    'e-money': string;
    'e-money-eur': string;
    'juno-network': string;
    likecoin: string;
    terrausd: string;
    'terra-luna': string;
    bitcanna: string;
    'terra-krw': string;
    secret: string;
    medibloc: string;
    comdex: string;
    'cheqd-network': string;
    vidulum: string;
    stargaze: string;
    'chihuahua-token': string;
};
/**
 * @param {*} coins is a list of coins to check
 */
export declare const getPrices: (coins?: string[]) => Promise<any>;
export declare const allGeckoAssets: () => any;
export declare const _getPricesFromCoinGecko: () => Promise<any>;
export declare const getPricesFromCoinGecko: () => Promise<PriceHash>;
