import getPoolsFixture from '../validator/search/v1/pools/data.json';
import getTokensFixture from '../validator/tokens/v2/all/data.json';
import getPoolAprsFixture from '../validator/apr/v1/all/data.json';
import getPoolAprFixture from '../validator/apr/v1/606/data.json';
import getPairsSummaryFixture from '../validator/pairs/v1/summary/data.json';

import {
  ValidatorToken,
  CoinSymbol,
  ValidatorPoolApr,
  ValidatorPair,
  ValidatorTokenPrice
} from '../..';

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
