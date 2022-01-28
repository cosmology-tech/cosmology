import { coins } from '@cosmjs/amino';

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
     * @param {string} param0.sourcePort
     * @param {string} param0.sourceChannel
     * @param {Coin} param0.token
     * @param {string} param0.sender
     * @param {string} param0.receiver
     * @param {any} param0.timeoutHeight
     */
    transfer: ({ sourcePort, sourceChannel, token, sender, receiver, timeoutHeight }) => {
        const fee = {
            amount: coins(0, 'uosmo'),
            gas: "130000"
        };

        // https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/aminotypes.ts#L464
        return {
            fee,
            msg: {
                typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
                value: {
                    sourcePort,
                    sourceChannel,
                    token,
                    sender,
                    receiver,
                    timeoutHeight
                }
            }
        };
    }
};