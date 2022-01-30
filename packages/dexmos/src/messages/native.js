import { coins } from '@cosmjs/amino';
import { getFeeForChainAndMsg } from '../utils';

/**
 * @typedef {{
 * poolId:string;
 * tokenOutDenom:string;
 * }} Route
 *
 * @typedef {{
 * amount:string;
 * denom:string;
 * }} Coin
 *
 */

export const messages = {
    /**
     * @param {object} param0
     * @param {string} param0.chainId
     * @param {string} param0.sourcePort
     * @param {string} param0.sourceChannel
     * @param {Coin} param0.token
     * @param {string} param0.sender
     * @param {string} param0.receiver
     * @param {{
     *  revisionHeight: Long;
     *  revisionNumber: Long;
     * }} param0.timeoutHeight
     * @param {Long} param0.timeoutTimestamp
     */
    transfer: ({
        chainId,
        //
        sourcePort,
        sourceChannel,
        token,
        sender,
        receiver,
        timeoutHeight,
        timeoutTimestamp
     }) => {
        const fee = getFeeForChainAndMsg(chainId, 'MsgTransfer');

        // https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/aminotypes.ts#L464
        // MsgTransfer defines a msg to transfer fungible tokens (i.e Coins) between ICS20 enabled chains. See ICS Spec here: https://github.com/cosmos/ics/tree/master/spec/ics-020-fungible-token-transfer#data-structures
        return {
            fee,
            msg: {
                typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
                value: {
                    // the port on which the packet will be sent
                    sourcePort,
                    // the channel by which the packet will be sent
                    sourceChannel,
                    // the tokens to be transferred
                    token,
                    // the sender address
                    sender,
                    // the recipient address on the destination chain
                    receiver,
                    // Timeout height relative to the current block height. The timeout is disabled when set to 0.
                    timeoutHeight,
                    // Timeout timestamp (in nanoseconds) relative to the current block timestamp. The timeout is disabled when set to 0.
                    timeoutTimestamp
                }
            }
        };
    },
    
    /**
     * @param {object} param0
     * @param {string} param0.chainId
     * @param {string} param0.toAddress
     * @param {string} param0.fromAddress
     * @param {Coin[]} param0.amount
     */
    send: ({
        chainId,
        //
        toAddress,
        fromAddress,
        amount
    }) => {
        const fee = getFeeForChainAndMsg(chainId, 'MsgSend');

        const pkt = {
            fee,
            msg: {
                typeUrl: '/cosmos.bank.v1beta1.MsgSend',
                value: {
                    toAddress,
                    fromAddress,
                    amount
                }
            }
        };

        console.log(JSON.stringify(pkt, null, 2));

        return pkt;
    }
};