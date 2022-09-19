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
  promptRestEndpoint,
  promptRpcEndpoint,
  getFuzzySearch,
  getFuzzySearchNames

} from '../utils';
import {
  assertIsDeliverTxSuccess
} from '@cosmjs/stargate';
import { cosmos, getSigningCosmosClient } from 'osmojs';
import { signAndBroadcast, getOfflineSignerAmino } from 'cosmjs-utils';

// TODO research why Amino does not work — likely not enabled on backend?
const {
  withdrawValidatorCommission
} = cosmos.distribution.v1beta1.MessageComposer.fromPartial;

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);
  const client = await cosmos.ClientFactory.createLCDClient({ restEndpoint });

  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken
  ).base;
  if (!denom) throw new Error('cannot find asset base unit');

  const signer = await getOfflineSignerAmino({ mnemonic: argv.mnemonic, chain });
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);
  const stargateClient = await getSigningCosmosClient({
    rpcEndpoint,
    signer
  });

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const data = await client.cosmos.staking.v1beta1.validators({
    // The validator bond status. Must be either 'bonded', 'unbonded', or 'unbonding'.
    // status: 'bonded'
    status: 'BOND_STATUS_BONDED'
  })

  const validators = data.validators.filter(validator => {
    return !validator.jailed
    // validator.status === 'BOND_STATUS_BONDED'
  });

  const choices = validators.map(validator => {
    return {
      name: validator.description.moniker,
      value: validator.operator_address
    }
  });

  const { validator_address } = await prompt(
    [
      {
        type: 'autocomplete',
        name: 'validator_address',
        message: 'validator_address',
        source: getFuzzySearchNames(choices)
      }
    ],
    argv
  );

  const msg = withdrawValidatorCommission({
    validatorAddress: validator_address
  });

  const fee = await gasEstimation(
    denom,
    stargateClient,
    address,
    [msg],
    '',
    1.3
  );

  if (argv.simulate) {
    console.log(JSON.stringify(msg, null, 2));
    console.log(JSON.stringify(fee, null, 2));
    return;
  }

  const result = await signAndBroadcast({
    client: stargateClient,
    chainId: chain.chain_id,
    address,
    msgs: [msg],
    fee,
    memo: ''
  })

  assertIsDeliverTxSuccess(result);
  stargateClient.disconnect();
  printTransactionResponse(result, chain);

};
