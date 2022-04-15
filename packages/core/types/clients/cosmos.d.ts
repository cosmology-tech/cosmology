import { Coin } from '@cosmjs/amino';
import { RestClient } from './rest';
export interface Proposal {
    content: {
        title: string;
        description: string;
    };
    proposal_id: string;
    status: string;
    final_tally_result: {
        yes: string;
        abstain: string;
        no: string;
        no_with_veto: string;
    };
    submit_time: string;
    deposit_end_time: string;
    total_deposit: [Coin];
    voting_start_time: string;
    voting_end_time: string;
}
export interface ProposalsResponse {
    pagination?: object;
    proposals: Proposal[];
}
export declare class CosmosApiClient extends RestClient {
    constructor({ url }: {
        url: any;
    });
    getTransaction(txHash: any): Promise<unknown>;
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
    getCosmosTransaction(txHash: any): Promise<unknown>;
    getProposals(proposalStatus?: number): Promise<ProposalsResponse>;
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
    getLatestBlock(): Promise<unknown>;
    getBalances(address: any): Promise<unknown>;
    authInfo(address: any): Promise<unknown>;
    getUnbondingDelegations(address: any): Promise<unknown>;
    getDelegations(address: any): Promise<unknown>;
    getDelegatorValidatorInfo(delegatorAddr: any, validatorAddr: any): Promise<unknown>;
    getValidatorInfo(validatorAddr: any): Promise<unknown>;
    getValidators(status: any): Promise<unknown>;
    getRewards(address: any): Promise<unknown>;
}
