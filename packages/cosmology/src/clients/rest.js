import axios from 'axios';

export class RestClient {
  constructor({ url }) {
    this.url = url.endsWith('/') ? url : `${url}/`;
    this._clientType = 'API';
    this.instance = axios.create({
      baseURL: this.url,
      timeout: 10000,
      headers: {}
    });
  }

  async request(endpoint, opts = {}) {
    try {
      const response = await this.instance.get(endpoint, {
        timeout: 30000,
        ...opts
      });
      return response.data;
    } catch (e) {
      console.log(`STATUS CODE: ${e?.response?.status}`);
      console.log(`STATUS TEXT: ${e?.response?.statusText}`);
      console.error(
        `${this._clientType} response error: ${
          e.response ? e.response.data : e
        }`
      );
      return null;
    }
  }
}
