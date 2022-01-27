import bent from 'bent';
import { getClient } from '../messages/utils';
// import { messages } from '../messages/create';

export class OsmosisClient {
  constructor({ url = 'https://lcd-osmosis.keplr.app/', rpcEndpoint, wallet }) {
    this.url = url.endsWith('/') ? url : `${url}/`;
    this.rpcEndpoint = rpcEndpoint;
    this.wallet = wallet;
  }
  async init() {
    this.client = getClient({
      rpcEndpoint: this.rpcEndpoint,
      wallet: this.wallet
    });
  }
}

export class OsmosisApiClient {
  constructor({ url = 'https://lcd-osmosis.keplr.app/' } = {}) {
    this.url = url.endsWith('/') ? url : `${url}/`;
  }

  async getBalances(address) {
    const endpoint = `bank/balances/${address}`;
    return await this.request(endpoint);
  }

  async getPools() {
    const endpoint = `osmosis/gamm/v1beta1/pools?pagination.limit=750`;
    return await this.request(endpoint);
  }

  get() {
    return bent(this.url, 'GET', 'json', 200);
  }

  async request(endpoint) {
    try {
      const body = {};
      const headers = {};
      const result = await this.get()(endpoint, body, headers);
      if (result.response) {
        return result.response;
      }
      return result;
    } catch (e) {
      console.error(
        'Osmosis API response error:',
        e.response ? e.response.data : e
      );
      return null;
    }
  }
}
