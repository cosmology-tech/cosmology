import { RestClient } from './rest';
import { assets } from '../assets';

const assetHashMap = assets.reduce((m, asset) => {
  m[asset.base] = asset;
  return m;
}, {});

export class CosmosApiClient extends RestClient{
  constructor({ url }) {
    super({url});
    this._clientType = 'Cosmos API';
  }

  async getTransaction(txHash) {
    const endpoint = `txs/${txHash}`;
    return await this.request(endpoint);
  }

  /**
   * @returns {Promise<{
   *   tx: {
   *      body: object;
   *      authInfo: object;
   *      signatures: object[];
   *   };
   *   tx_response: {
   *      height: string;
   *      txhash: string;
   *   }
   * }>}
   */
  async getCosmosTransaction(txHash) {
    const endpoint = `cosmos/tx/v1beta1/txs/${txHash}`;
    return await this.request(endpoint);
  }

    /**
   * @returns {Promise<{
   *   block_id: {
   *      hash: string;
   *      part_set_header: object;
   *   };
   *   block: {
   *      header: {
   *        version: object;
   *        chain_id: string;
   *        height: string;
   *        time: string;
   *      }
   *   }
   * }>}
   */

  async getLatestBlock() {
    const endpoint = `/cosmos/base/tendermint/v1beta1/blocks/latest`;
    return await this.request(endpoint);
  }

  // below is the subset only supported by keplr.app endpoint...

  async getBalances(address) {
    const endpoint = `bank/balances/${address}`;
    return await this.request(endpoint);
  }
  
  async authInfo(address) {
    const endpoint = `auth/accounts/${address}`;
    return await this.request(endpoint);
  }

  async getUnbondingDelegations(address) {
    const endpoint = `staking/delegators/${address}/unbonding_delegations`;
    return await this.request(endpoint);
  }

  async getDelegations(address) {
    const endpoint = `staking/delegators/${address}/delegations`;
    return await this.request(endpoint);
  }
}

// Cosmos LCD API
// https://www.notion.so/Stake-Systems-LCD-RPC-gRPC-Instances-04a99a9a9aa14247a42944931eec7024

export class OsmosisApiClient extends CosmosApiClient {
  constructor({ url = 'https://osmosis.stakesystems.io/' } = {}) {
    super({url})
    this._clientType = 'Osmosis API';
  }

  async getPools() {
    const endpoint = `osmosis/gamm/v1beta1/pools?pagination.limit=750`;
    return await this.request(endpoint);
  }

  async getPool(poolId) {
    const endpoint = `osmosis/gamm/v1beta1/pools/${poolId}`;
    return await this.request(endpoint);
  }

  async getIncentivizedPools() {
    const endpoint = `osmosis/pool-incentives/v1beta1/incentivized_pools`;
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

  async getLockableDuration() {
    const endpoint = `osmosis/pool-incentives/v1beta1/lockable_durations`;
    return await this.request(endpoint);
  }

  async getPoolsPretty({ includeDetails = false } = {}) {
    const { pools } = await this.getPools();

    const prettyPools = pools.map((pool,i) => {
      const totalWeight = Number(pool.totalWeight);
      const tokens = pool.poolAssets.map(({ token, weight }) => {
        const asset = assetHashMap?.[token.denom];
        const symbol = asset?.symbol ?? token.denom;
        const ratio = Number(weight) / totalWeight;
        const obj = {
          symbol,
          amount: token.amount,
          ratio
        };
        if (includeDetails) {
          obj.info = asset;
        }
        return obj;
      });
      if (!i) console.log(pool);
      const value = {
        nickname: tokens.map(t=>t.symbol).join('/'),
      };
      if (includeDetails) {
        value.images = tokens.map(t=>{
          const imgs = t?.info?.logo_URIs;
          if (imgs) {
            return {
              token: t.symbol,
              images: imgs
            };
          }
        }).filter(Boolean)
      }
      return {
        ...value,
        ...pool,
        poolAssetsPretty: tokens
      };
    });

    return prettyPools;
  }
  
}