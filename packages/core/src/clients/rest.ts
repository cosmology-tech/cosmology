import axios from 'axios';
import retry from 'retry';

export class RestClient {
  url: string;
  _clientType: string;
  instance: any;

  constructor({ url }) {
    this.url = url.endsWith('/') ? url : `${url}/`;
    this._clientType = 'API';
    this.instance = axios.create({
      baseURL: this.url,
      timeout: 10000,
      headers: {}
    });
  }

  request(endpoint, opts = {}) {
    const operation = retry.operation({
      retries: 5,
      factor: 2,
      minTimeout: 1 * 1000,
      maxTimeout: 60 * 1000
    });

    return new Promise((resolve, reject) => {
      operation.attempt(async () => {
        let response;
        let err;
        try {
          response = await this.instance.get(endpoint, {
            timeout: 30000,
            ...opts
          });
        } catch (e) {
          console.log(`STATUS CODE: ${e?.response?.status}`);
          console.log(`STATUS TEXT: ${e?.response?.statusText}`);
          console.error(
            `${this._clientType} response error: ${e.response ? e.response.data : e
            }`
          );
          const statusNum = Number(e?.response?.status);
          if (statusNum >= 500) err = true;
          else return reject(e);
        }

        if (operation.retry(err)) {
          console.log('retrying...');
          return;
        }

        if (response && response.data) {
          resolve(response.data);
        } else {
          reject(operation.mainError());
        }
      });
    });
  }
}
