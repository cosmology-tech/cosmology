import { RestClient } from './rest';

export class OsmosisValidatorClient extends RestClient {
  constructor({ url = 'https://api-osmosis.imperator.co/' } = {}) {
    super({url});
    this._clientType = 'Osmosis Validator';
  }

  async getPools() {
    const endpoint = `search/v1/pools`;
    return await this.request(endpoint);
  }
}
