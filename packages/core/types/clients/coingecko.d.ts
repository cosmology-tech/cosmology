import { PriceHash } from '../types';
/**
 * @param {*} coins is a list of coins to check
 */
export declare const getPrices: (coins?: string[]) => Promise<any>;
export declare const allGeckoAssets: () => any;
export declare const _getPricesFromCoinGecko: () => Promise<any>;
export declare const getPricesFromCoinGecko: () => Promise<PriceHash>;
