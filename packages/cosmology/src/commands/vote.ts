import { prompt } from '../utils/prompt';
import { CosmosApiClient } from '../clients/cosmos';
import {
  getWalletFromMnemonic,
  getCosmosAssetInfo,
  gasEstimation,
  printTransactionResponse
} from '../utils';
import { promptChain, promptMnemonic } from '../utils/prompt';
import {
  SigningStargateClient
} from '@cosmjs/stargate';
import { messages } from '../messages/native';
import { proposalStatusFromJSON } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);


  const { restEndpoint } = await prompt(
    [
      {
        type: 'list',
        message: 'restEndpoint',
        name: 'restEndpoint',
        choices: chain.apis.rest.map((e) => e.address)
      }
    ],
    argv
  );

  const { rpcEndpoint } = await prompt(
    [
      {
        type: 'list',
        message: 'rpcEndpoint',
        name: 'rpcEndpoint',
        choices: chain.apis.rpc.map((e) => e.address)
      }
    ],
    argv
  );
  const client = new CosmosApiClient({
    url: restEndpoint
  });

  const propResp = await client.getProposals(2);
  const propIds = propResp.proposals.map(prop => {
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


  // check re-stake (w display or base?)
  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken
  ).base;
  if (!denom) throw new Error('cannot find asset base unit');

  const signer = await getWalletFromMnemonic({
    mnemonic: argv.mnemonic,
    token: argv.chainToken
  });


  const stargateClient = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    signer
  );

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const delegations = await client.getDelegations(address);

  if (!delegations.result || !delegations.result.length) {
    console.log('no delegations. You cannot vote. Exiting.');
  }

  const voteMessages = [];

  voteMessages.push(messages.vote({ voter: address, proposalId, option: vote }));

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
