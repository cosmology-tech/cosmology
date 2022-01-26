import bent from 'bent';
import {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
  StargateClient
} from '@cosmjs/stargate';
import { Registry } from '@cosmjs/proto-signing';

import * as messages from './messages';

export class OsmosisClient {
  constructor({ url = 'https://lcd-osmosis.keplr.app/', rpcEndpoint, wallet }) {
    this.url = url;
    this.rpcEndpoint = rpcEndpoint;
    this.wallet = wallet;
  }
  async init() {
    const [{ address }] = await this.wallet.getAccounts();
    const registry = new Registry();
    this.client = await SigningStargateClient.connectWithSigner(
      this.rpcEndpoint,
      this.wallet,
      { registry: registry }
    );
  }

  async swapExactAmountIn({ sender, routes, tokenIn, tokenOutMinAmount }) {
    const payload = messages.swapExactAmountIn({
      sender,
      routes,
      tokenIn,
      tokenOutMinAmount
    });
    return payload;
    // return await this.sign(payload);
  }

  async sign(payload) {
    const signed = await this.client.sign(payload.msgs, payload.fee);
    return signed;
  }

  async broadcast(signed) {
    // We can broadcast it manually later on
    const result = await this.client.broadcastTx(signed);
    console.log('Broadcasting result:', result);
  }
}

export class OsmosisApiClient {
  constructor({ url = 'https://lcd-osmosis.keplr.app/', rpcEndpoint, wallet }) {
    this.url = url;
    this.wallet = wallet;
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
