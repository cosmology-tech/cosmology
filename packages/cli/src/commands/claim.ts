import {
  baseUnitsToDisplayUnitsByDenom,
  gasEstimation,
  getCosmosAssetInfo,
} from '@cosmology/core';
import {
  prompt,
  promptChain,
  promptMnemonic,
  printTransactionResponse,
  promptRpcEndpoint
} from '../utils';
import {
  assertIsDeliverTxSuccess
} from '@cosmjs/stargate';
import { Dec } from '@keplr-wallet/unit';
import { cosmos, getSigningCosmosClient } from 'osmojs';
import { signAndBroadcast, getOfflineSignerAmino } from 'cosmjs-utils';

const {
  withdrawDelegatorReward
} = cosmos.distribution.v1beta1.MessageComposer.fromPartial;

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);

  const { minAmount } = await prompt(
    [
      {
        type: 'number',
        message: 'minAmount',
        name: 'minAmount'
      }
    ],
    argv
  );

  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);
  const client = await cosmos.ClientFactory.createRPCQueryClient({ rpcEndpoint });

  // check re-stake (w display or base?)
  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken
  ).base;
  if (!denom) throw new Error('cannot find asset base unit');

  const signer = await getOfflineSignerAmino({ mnemonic: argv.mnemonic, chain });
  const stargateClient = await getSigningCosmosClient({
    rpcEndpoint,
    signer
  });

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const delegations = await client.cosmos.staking.v1beta1.delegatorDelegations({
    delegatorAddr: address
  })

  console.log(delegations);

  // NOTE: API is camel for RPC
  if (!delegations.delegationResponses || !delegations.delegationResponses.length) {
    console.log('no delegations. Exiting.');
    return;
  }

  // if (!delegations.delegation_responses || !delegations.delegation_responses.length) {
  //   console.log('no delegations. Exiting.');
  //   return;
  // }

  const messagesToClaim = [];
  let totalClaimable = new Dec(0);

  const rewards = await client.cosmos.distribution.v1beta1.delegationTotalRewards({
    delegatorAddress: address
  });

  if (rewards && rewards.rewards && rewards.rewards.length) {
    rewards.rewards.forEach((data) => {

      // const { validator_address, reward } = data;
      // NOTE: API is camel for RPC
      const { validatorAddress, reward } = data;

      if (reward && reward.length) {
        // question for later: why does reward array have other coins like ATOM in it? (for OSMO).
        const rewardWeWant = reward.find((r) => r.denom === denom);
        if (!rewardWeWant) return;

        // const value = baseUnitsToDisplayUnitsByDenom(
        //   rewardWeWant.denom.trim(),
        //   rewardWeWant.amount + ''
        // );
        // console.log('rewardWeWant.denom, rewardWeWant.amount, value', rewardWeWant.denom, rewardWeWant.amount, value);
        // totalClaimable = totalClaimable.add(new Dec(value));
        totalClaimable = totalClaimable.add(new Dec(rewardWeWant.amount));

        messagesToClaim.push(
          withdrawDelegatorReward({
            delegatorAddress: address,
            validatorAddress
          })
        );
      }
    });
  }

  if (!messagesToClaim.length) {
    console.log('no rewards. Exiting.');
    return;
  }

  const fee = await gasEstimation(
    denom,
    stargateClient,
    address,
    messagesToClaim,
    '',
    1.3
  );

  if (argv.simulate) {
    console.log(JSON.stringify(messagesToClaim, null, 2));
    console.log(JSON.stringify(fee, null, 2));
    return;
  }
  if (totalClaimable.gte(new Dec(minAmount))) {
    console.log(
      `${totalClaimable} ${denom} available, starting claim process...`
    );

    const result = await signAndBroadcast({
      client: stargateClient,
      chainId: chain.chain_id,
      address,
      msgs: messagesToClaim,
      fee,
      memo: ''
    })

    assertIsDeliverTxSuccess(result);
    stargateClient.disconnect();
    console.log(
      `⚛️  success in claiming ${totalClaimable.toString()} ${denom
      } rewards`
    );
    printTransactionResponse(result, chain);

  } else {
    console.log(
      `${minAmount} not available (${totalClaimable.toString()} < minAmount)`
    );
  }
};
