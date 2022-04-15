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
    getTransaction(txHash: any): Promise<any>;
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
    getCosmosTransaction(txHash: any): Promise<any>;
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
    getLatestBlock(): Promise<any>;
    getBalances(address: any): Promise<any>;
    authInfo(address: any): Promise<any>;
    getUnbondingDelegations(address: any): Promise<any>;
    getDelegations(address: any): Promise<any>;
    getDelegatorValidatorInfo(delegatorAddr: any, validatorAddr: any): Promise<any>;
    getValidatorInfo(validatorAddr: any): Promise<any>;
    getValidators(status: any): Promise<any>;
    getRewards(address: any): Promise<any>;
}
