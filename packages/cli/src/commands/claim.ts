import {
  baseUnitsToDisplayUnitsByDenom,
  gasEstimation,
} from '@cosmology/core';
import {
  prompt,
  promptChain,
  promptMnemonic,
  printTransactionResponse,
  promptRpcEndpoint
} from '../utils';
import {
  decodeCosmosSdkDecFromProto,
  assertIsDeliverTxSuccess
} from '@cosmjs/stargate';
import { Dec } from '@keplr-wallet/unit';
import { cosmos, getSigningCosmosClient } from 'osmojs';
import { signAndBroadcast, getOfflineSignerAmino } from 'cosmjs-utils';
import { assets } from 'chain-registry'
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

  const assetList = assets.find((a) => !!a.assets.find((i) => i.symbol === argv.chainToken));
  const assetInfo = assetList.assets.find(a => a.symbol === argv.chainToken);

  if (!assetInfo) throw new Error('cannot find asset base unit');

  const denom = assetInfo.base;

  const signer = await getOfflineSignerAmino({ mnemonic: argv.mnemonic, chain });
  const stargateClient = await getSigningCosmosClient({
    rpcEndpoint,
    signer
  });

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const delegations = await client.cosmos.staking.v1beta1.delegatorDelegations({
    delegatorAddr: address
  });

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
        // https://github.com/osmosis-labs/telescope/issues/247
        totalClaimable = totalClaimable.add(new Dec(decodeCosmosSdkDecFromProto(rewardWeWant.amount).toString()));
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


  const totalClaimableInDisplayUnits = new Dec(baseUnitsToDisplayUnitsByDenom(
    denom,
    totalClaimable.toString()
  ));

  if (totalClaimableInDisplayUnits.gte(new Dec(minAmount))) {

    console.log(
      `${totalClaimableInDisplayUnits} ${assetInfo.symbol} available, starting claim process...`
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
      `⚛️  success in claiming ${totalClaimableInDisplayUnits.toString()} ${assetInfo.symbol
      } rewards`
    );
    printTransactionResponse(result, chain);

  } else {
    console.log(
      `minAmount not available (${totalClaimableInDisplayUnits.toString()} < ${minAmount})`
    );
  }
};
