import { coin } from '@cosmjs/stargate';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { Coin } from '@cosmjs/amino';

export interface Route {
  poolId: string;
  tokenOutDenom: string;
};

export const messages = {
  transfer: ({
    sourcePort,
    sourceChannel,
    token,
    sender,
    receiver,
    timeoutHeight,
    timeoutTimestamp
  }: {
    sourcePort: string,
    sourceChannel: string,
    token: Coin,
    sender: string,
    receiver: string,
    timeoutHeight: {
      revisionHeight: Long;
      revisionNumber: Long;
    },
    timeoutTimestamp: Long
  }) => {
    // https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/aminotypes.ts#L464
    // MsgTransfer defines a msg to transfer fungible tokens (i.e Coins) between ICS20 enabled chains. See ICS Spec here: https://github.com/cosmos/ics/tree/master/spec/ics-020-fungible-token-transfer#data-structures
    return {
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
    };
  },

  send: ({
    toAddress,
    fromAddress,
    amount
  }: {
    toAddress: string,
    fromAddress: string,
    amount: Coin[]
  }) => {
    return {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        toAddress,
        fromAddress,
        amount
      }
    };
  },

  withdrawDelegatorReward: ({
    delegatorAddress,
    validatorAddress
  }: {
    delegatorAddress: string,
    validatorAddress: string
  }) => {
    return {
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: MsgWithdrawDelegatorReward.fromPartial({
        delegatorAddress,
        validatorAddress
      })
    };
  },

  delegate: ({
    delegatorAddress,
    validatorAddress,
    amount,
    denom
  }: {
    delegatorAddress: string,
    validatorAddress: string,
    amount: string,
    denom: string
  }) => {
    return {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: MsgDelegate.fromPartial({
        delegatorAddress,
        validatorAddress,
        amount: coin(amount, denom)
      })
    };
  },

  // VoteOption
  // 1: yes
  // 2: abstain
  // 3: no
  // 4: no with veto

  vote: ({
    voter,
    proposalId,
    option
  }: {
    voter: string,
    proposalId: Long,
    option: number
  }) => {
    return {
      typeUrl: '/cosmos.gov.v1beta1.MsgVote',
      value: MsgVote.fromPartial({
        option,
        proposalId,
        voter
      })
    };
  }
};
