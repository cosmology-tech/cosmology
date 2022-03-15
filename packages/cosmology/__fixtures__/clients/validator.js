import getPoolsFixture from '../validator/search/v1/pools/data.json';
import getTokensFixture from '../validator/tokens/v2/all/data.json';
import getPoolAprsFixture from '../validator/apr/v1/all/data.json';
import getPoolAprFixture from '../validator/apr/v1/606/data.json';
import getPairsSummaryFixture from '../validator/pairs/v1/summary/data.json';

/**
 * 
 * @typedef {(
 * string
 * )} CoinDenom
 *
 * @typedef {( 
 * string
 * )} CoinSymbol
 * 
 * @typedef {{
 *  price: number;
 *  denom: CoinDenom;
 *  symbol: CoinSymbol;
 *  liquidity: number;
 *  liquidity_24h_change: number;
 *  volume_24h: number;
 *  volume_24h_change: number;
 *  name: string;
 * }} ValidatorToken
 * 
 * @typedef {{
 *  price: number;
 * }} ValidatorTokenPrice
 * 
 * @typedef {{
 * start_date: string;
 * denom: CoinDenom;
 * symbol: CoinSymbol;
 * apr_1d: number;
 * apr_7d: number;
 * apr_14d: number;
 * }} ValidatorCoinApr
 * 
 * @typedef {{
 *  pool_id: number;
 *  apr_list: ValidatorCoinApr[]
 * }} ValidatorPoolApr
 * 
 * 
 * interestingly this one has "price" which I think is the
 * price of the LP token? TODO: verify...
 * 
 * @typedef {{
 *  pool_address: string;
 *  pool_id: string;
 *  base_name: string;
 *  base_symbol: CoinSymbol;
 *  base_address: CoinDenom;
 *  quote_name: string;
 *  quote_symbol: CoinSymbol;
 *  quote_address: CoinDenom;
 *  price: number;
 *  base_volume_24h: number;
 *  quote_volume_24h: number;
 *  volume_24h: number;
 *  volume_7d: number;
 *  liquidity: number;
 *  liquidity_atom: number;
 * }} ValidatorPair
 * 
 */
//  https://api-osmosis.imperator.co/swagger/#/
export class OsmosisValidatorClient {
  async getPools() {
    return getPoolsFixture;
  }

  /**
   * @returns {Promise<ValidatorToken[]>}
   */
  async getTokens() {
    return getTokensFixture;
  }

  /**
   * @param {CoinSymbol} symbol
   * @returns {Promise<ValidatorToken[]>}
   */
  async getToken(symbol) {
    console.warn('NOT IMPLEMENTED IN TESTING');
  }
  
  /**
   * @param {CoinSymbol} symbol
   * @returns {Promise<ValidatorTokenPrice[]>}
   */
  async getTokenPrice(symbol) {
    console.warn('NOT IMPLEMENTED IN TESTING');
  }

  /**
   * @returns {Promise<ValidatorPoolApr[]>}
   */
  async getPoolAprs() {
    return getPoolAprsFixture;
  }

  /**
   * @param {CoinSymbol} symbol
   * @returns {Promise<ValidatorPoolApr[]>}
   */
   async getPoolApr(symbol) {
    return getPoolAprFixture;
   }

  /**
   * @returns {Promise<ValidatorPair[]>}
   */
   async getPairsSummary() {
    return getPairsSummaryFixture;
   }

}