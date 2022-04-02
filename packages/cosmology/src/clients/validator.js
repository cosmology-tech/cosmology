import { RestClient } from './rest';
import autobind from 'class-autobind';

import {
  ValidatorToken,
  CoinSymbol,
  ValidatorPoolApr,
  ValidatorPair,
  ValidatorTokenPrice
} from '../types';

//  https://api-osmosis.imperator.co/swagger/#/
export class OsmosisValidatorClient extends RestClient {
  constructor({ url = 'https://api-osmosis.imperator.co/' } = {}) {
    super({ url });
    this._clientType = 'Osmosis Validator';
    autobind(this); // React ES6 doesn't bind this -> meaning we get 'unable to read property 'request' of undefined
  }

  async getPools() {
    const endpoint = `search/v1/pools`;
    return await this.request(endpoint);
  }

  /**
   * @returns {Promise<ValidatorToken[]>}
   */
  async getTokens() {
    const endpoint = `tokens/v2/all`;
    return await this.request(endpoint);
  }

  /**
   * @param {CoinSymbol} symbol
   * @returns {Promise<ValidatorToken[]>}
   */
  async getToken(symbol) {
    const endpoint = `tokens/v2/${symbol}`;
    return await this.request(endpoint);
  }

  /**
   * @param {CoinSymbol} symbol
   * @returns {Promise<ValidatorTokenPrice[]>}
   */
  async getTokenPrice(symbol) {
    const endpoint = `tokens/v2/price/${symbol}`;
    return await this.request(endpoint);
  }

  /**
   * @returns {Promise<ValidatorPoolApr[]>}
   */
  async getPoolAprs() {
    const endpoint = `apr/v1/all`;
    return await this.request(endpoint);
  }

  /**
   * @param {CoinSymbol} symbol
   * @returns {Promise<ValidatorPoolApr[]>}
   */
  async getPoolApr(symbol) {
    const endpoint = `apr/v1/${symbol}`;
    return await this.request(endpoint);
  }

  /**
   * @returns {Promise<ValidatorPair[]>}
   */
  async getPairsSummary() {
    const endpoint = `pairs/v1/summary`;
    return await this.request(endpoint);
  }
}
