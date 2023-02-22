import { assets } from '../assets';
import { CosmosApiClient } from './cosmos';
import autobind from 'class-autobind';
import { Dec } from '@keplr-wallet/unit';

import {
  LcdPool,
  Pool,
  PoolDisplay,
  PoolPretty
} from '../types'

const assetHashMap = assets.reduce((m, asset) => {
  m[asset.base] = asset;
  return m;
}, {});

// Cosmos LCD API
// https://www.notion.so/Stake-Systems-LCD-RPC-gRPC-Instances-04a99a9a9aa14247a42944931eec7024

export interface PoolsResponse {
  pools: LcdPool[];
  pagination: object;
}

export class OsmosisApiClient extends CosmosApiClient {
  constructor({ url = 'https://osmosis.stakesystems.io/' } = {}) {
    super({ url });
    this._clientType = 'Osmosis API';
    autobind(this); // React ES6 doesn't bind this -> meaning we get 'unable to read property 'request' of undefined
  }

  async getPools(): Promise<PoolsResponse> {
    const endpoint = `osmosis/gamm/v1beta1/pools?pagination.limit=2000`;
    return await this.request(endpoint, { 'Cache-Control': 'max-age=60' });
  }

  async getPool(poolId) {
    const endpoint = `osmosis/gamm/v1beta1/pools/${poolId}`;
    return await this.request(endpoint);
  }

  async getAccountLockedLongerDuration(address) {
    const endpoint = `osmosis/lockup/v1beta1/account_locked_longer_duration/${address}`;
    return await this.request(endpoint);
  }

  async getAccountLockedCoins(address) {
    const endpoint = `osmosis/lockup/v1beta1/account_locked_coins/${address}`;
    return await this.request(endpoint);
  }

  async getEpochProvision() {
    const endpoint = `osmosis/mint/v1beta1/epoch_provisions`;
    return await this.request(endpoint);
  }

  async getEpochs() {
    const endpoint = `osmosis/epochs/v1beta1/epochs`;
    return await this.request(endpoint);
  }

  async getDistrInfo() {
    const endpoint = `osmosis/pool-incentives/v1beta1/distr_info`;
    return await this.request(endpoint);
  }

  async getParams() {
    const endpoint = `osmosis/mint/v1beta1/params`;
    return await this.request(endpoint);
  }

  async getLockableDurations() {
    const endpoint = `osmosis/pool-incentives/v1beta1/lockable_durations`;
    return await this.request(endpoint);
  }

  // https://osmosis.stakesystems.io/osmosis/incentives/v1beta1/gauges
  // returns gauges both upcoming and active
  async getGauges() {
    const endpoint = `osmosis/incentives/v1beta1/gauges`;
    return await this.request(endpoint);
  }

  async getActiveGauges() {
    const endpoint = `osmosis/incentives/v1beta1/active_gauges`;
    return await this.request(endpoint);
  }

  // https://osmosis.stakesystems.io/osmosis/incentives/v1beta1/gauge_by_id/5
  async getGauge(gaugeId) {
    const endpoint = `osmosis/incentives/v1beta1/gauge_by_id/${gaugeId}`;
    return await this.request(endpoint);
  }

  // https://osmosis.stakesystems.io/osmosis/pool-incentives/v1beta1/incentivized_pools
  async getIncentivizedPools() {
    const endpoint = `osmosis/pool-incentives/v1beta1/incentivized_pools`;
    return await this.request(endpoint);
  }

  async getPoolsPretty({ includeDetails = false } = {}) {
    const { pools } = await this.getPools();
    return pools.map((pool) => prettyPool(pool, { includeDetails }));
  }

  async getPoolPretty(poodId, { includeDetails = false } = {}) {
    const { pool } = await this.getPool(poodId);
    return prettyPool(pool, { includeDetails });
  }
}

export const prettyPool = (pool: LcdPool | Pool | PoolDisplay, { includeDetails = false } = {}): PoolPretty => {
  const totalWeight = new Dec(pool.totalWeight);
  const tokens = pool.poolAssets.map(({ token, weight }) => {
    const asset = assetHashMap?.[token.denom];
    const symbol = asset?.symbol ?? token.denom;
    const w = new Dec(weight);
    const ratio = w.quo(totalWeight).toString();
    const obj = {
      symbol,
      denom: token.denom,
      amount: token.amount,
      ratio,
      info: undefined
    };
    if (includeDetails) {
      obj.info = asset;
    }
    return obj;
  });
  const value = {
    nickname: tokens.map((t) => t.symbol).join('/'),
    images: undefined
  };
  if (includeDetails) {
    value.images = tokens
      .map((t) => {
        const imgs = t?.info?.logo_URIs;
        if (imgs) {
          return {
            token: t.symbol,
            images: imgs
          };
        }
      })
      .filter(Boolean);
  }
  return {
    ...value,
    ...pool,
    poolAssetsPretty: tokens
  };
};
