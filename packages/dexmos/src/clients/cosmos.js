import { RestClient } from './rest';

export class CosmosApiClient extends RestClient {
  constructor({ url }) {
    super({ url });
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
