import { Coin } from '@cosmjs/amino';
import { RestClient } from './rest';

export interface Proposal {
  content: {
    title: string;
    description: string;
  }
  proposal_id: string;
  status: string;
  final_tally_result: { yes: string; abstain: string; no: string; no_with_veto: string; };
  submit_time: string;
  deposit_end_time: string;
  total_deposit: [Coin],
  voting_start_time: string;
  voting_end_time: string;
}

export interface ProposalsResponse {
  pagination?: object;
  proposals: Proposal[];
}

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

  async getProposals(proposalStatus: number = 2): Promise<ProposalsResponse> {
    const endpoint = `cosmos/gov/v1beta1/proposals`;
    if (proposalStatus) {
      return await this.request(endpoint, { params: { proposal_status: proposalStatus } });
    }
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

  async getDelegatorValidatorInfo(delegatorAddr, validatorAddr) {
    const endpoint = `cosmos/staking/v1beta1/delegators/${delegatorAddr}/validators/${validatorAddr}`;
    return await this.request(endpoint);
  }

  async getValidatorInfo(validatorAddr) {
    const endpoint = `cosmos/staking/v1beta1/validators/${validatorAddr}`;
    return await this.request(endpoint);
  }

  async getValidators(status) {
    const endpoint = `cosmos/staking/v1beta1/validators`;
    if (status) {
      return await this.request(endpoint, { params: { status } });
    }
    return await this.request(endpoint);
  }

  async getRewards(address) {
    const endpoint = `cosmos/distribution/v1beta1/delegators/${address}/rewards`;
    return await this.request(endpoint);
  }
}
