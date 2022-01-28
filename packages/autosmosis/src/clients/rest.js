import bent from 'bent';

export class RestClient {
  constructor({ url }) {
    this.url = url.endsWith('/') ? url : `${url}/`;
    this._clientType = 'API';
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
        `${this._clientType} response error:`,
        e.response ? e.response.data : e
      );
      return null;
    }
  }
}