import {
  prompt,
  printTransactionResponse,
  promptChain,
  promptMnemonic,
  promptRestEndpoint,
  promptRpcEndpoint
} from '../utils';
import {
  getWalletFromMnemonic,
  getCosmosAssetInfo,
  gasEstimation
} from '@cosmology/core';

import { cosmos, getSigningCosmosClient } from 'osmojs'

const {
  vote: createVoteMsg
} = cosmos.gov.v1beta1.MessageComposer.fromPartial;

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);

  const client = await cosmos.ClientFactory.createLCDClient({ restEndpoint });
  const proposalReponse = await client.cosmos.gov.v1beta1.proposals({
    proposalStatus: 2 // PROPOSAL_STATUS_VOTING_PERIOD
  });

  const propIds = proposalReponse.proposals.map(prop => {
    return {
      name: `(${prop.proposal_id}) ${prop.content.title}`,
      value: prop.proposal_id
    }
  });
  const { proposalId } = await prompt(
    [
      {
        type: 'list',
        message: 'proposalId',
        name: 'proposalId',
        choices: propIds
      }
    ],
    argv
  );

  const { vote } = await prompt(
    [
      {
        type: 'list',
        message: 'your vote?',
        name: 'vote',
        choices: [
          { name: 'yes', value: 1 },
          { name: 'abstain', value: 2 },
          { name: 'no', value: 3 },
          { name: 'no with veto', value: 4 }
        ]
      }
    ],
    argv
  );

  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken && a.type_asset !== 'ics20'
  ).base;

  if (!denom) throw new Error('cannot find asset base unit');

  const signer = await getWalletFromMnemonic({
    mnemonic: argv.mnemonic,
    token: argv.chainToken
  });


  const stargateClient = await getSigningCosmosClient({
    rpcEndpoint,
    signer
  });

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const delegations = await client.cosmos.staking.v1beta1.delegatorDelegations({
    delegatorAddr: address
  });

  const num = Number(delegations?.pagination?.total);
  if (num <= 0 || Number.isNaN(num)) {
    console.log('no delegations. You cannot vote. Exiting.');
    process.exit(1);
  }

  const voteMessages = [];

  voteMessages.push(createVoteMsg({
    voter: address,
    proposalId,
    option: vote
  }));

  const fee = await gasEstimation(
    denom,
    stargateClient,
    address,
    voteMessages,
    '',
    1.3
  );

  if (argv.simulate) {
    console.log(JSON.stringify(voteMessages, null, 2));
    console.log(JSON.stringify(fee, null, 2));
    return;
  }

  const res = await stargateClient.signAndBroadcast(address, voteMessages, fee, '');
  stargateClient.disconnect();
  console.log(
    `⚛️  success in voting on ${argv.chainToken}`
  );
  printTransactionResponse(res, chain);
};
