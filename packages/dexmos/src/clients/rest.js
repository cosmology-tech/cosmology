import axios from 'axios';

export class RestClient {
  constructor({ url }) {
    this.url = url.endsWith('/') ? url : `${url}/`;
    this._clientType = 'API';
    this.instance = axios.create({
      baseURL: this.url,
      timeout: 10000,
      headers: { 'X-Cosmonauts': 'true' }
    });
  }

  async request(endpoint, opts) {
    try {
      const response = await this.instance.get(endpoint, opts);
      return response.data;
    } catch (e) {
      console.error(
        `${this._clientType} response error:`,
        e.response ? e.response.data : e
      );
      return null;
    }
  }
}
