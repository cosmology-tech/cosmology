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

  async getTokens(): Promise<ValidatorToken[]> {
    const endpoint = `tokens/v2/all`;
    return await this.request(endpoint);
  }

  async getToken(symbol: CoinSymbol): Promise<ValidatorToken[]> {
    const endpoint = `tokens/v2/${symbol}`;
    return await this.request(endpoint);
  }

  async getTokenPrice(symbol: CoinSymbol): Promise<ValidatorTokenPrice[]> {
    const endpoint = `tokens/v2/price/${symbol}`;
    return await this.request(endpoint);
  }

  async getPoolAprs(): Promise<ValidatorPoolApr[]> {
    const endpoint = `apr/v2/all`;
    return await this.request(endpoint);
  }

  async getPoolApr(symbol: CoinSymbol): Promise<ValidatorPoolApr[]> {
    const endpoint = `apr/v2/${symbol}`;
    return await this.request(endpoint);
  }

  async getPairsSummary(): Promise<ValidatorPair[]> {
    const endpoint = `pairs/v1/summary`;
    return await this.request(endpoint);
  }
}
