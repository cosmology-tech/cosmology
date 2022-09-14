import {
  baseUnitsToDisplayUnitsByDenom,
  CosmosApiClient,
  gasEstimation,
  getCosmosAssetInfo,
  getWalletFromMnemonic
} from '@cosmology/core';
import {
  prompt,
  promptChain,
  promptMnemonic,
  printTransactionResponse,
  promptRestEndpoint,
  promptRpcEndpoint
} from '../utils';
import {
  SigningStargateClient,
  assertIsDeliverTxSuccess
} from '@cosmjs/stargate';
import { Dec } from '@keplr-wallet/unit';
import { cosmos, getSigningCosmosClient } from 'osmojs';

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

  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);

  const client = new CosmosApiClient({
    url: restEndpoint
  });

  // check re-stake (w display or base?)
  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken
  ).base;
  if (!denom) throw new Error('cannot find asset base unit');
  const defaultGasPrice = '0.0025' + denom;

  const signer = await getWalletFromMnemonic({
    mnemonic: argv.mnemonic,
    token: argv.chainToken
  });

  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);

  const stargateClient = await getSigningCosmosClient({
    rpcEndpoint,
    signer
  });

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const delegations = await client.getDelegations(address);

  if (!delegations.result || !delegations.result.length) {
    console.log('no delegations. Exiting.');
  }

  const messagesToClaim = [];
  let totalClaimable = new Dec(0);

  const rewards = await client.getRewards(address);
  if (rewards && rewards.rewards && rewards.rewards.length) {
    rewards.rewards.forEach((data) => {
      const { validator_address, reward } = data;

      if (reward && reward.length) {
        // question for later: why does reward array have other coins like ATOM in it? (for OSMO).
        const rewardWeWant = reward.find((r) => r.denom === denom);
        if (!rewardWeWant) return;

        const value = baseUnitsToDisplayUnitsByDenom(
          rewardWeWant.denom,
          rewardWeWant.amount
        );
        totalClaimable = totalClaimable.add(new Dec(value));

        messagesToClaim.push(
          withdrawDelegatorReward({
            delegator_address: address,
            validator_address
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
      `${totalClaimable} ${argv.chainToken} available, starting claim process...`
    );
    stargateClient.signAndBroadcast(address, messagesToClaim, fee, '').then(
      (result) => {
        try {
          assertIsDeliverTxSuccess(result);
          stargateClient.disconnect();
          console.log(
            `⚛️  success in claiming ${totalClaimable.toString()} ${argv.chainToken
            } rewards`
          );
          printTransactionResponse(result, chain);
        } catch (error) {
          console.log(error);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    console.log(
      `${minAmount} not available (${totalClaimable.toString()} < minAmount)`
    );
  }
};
