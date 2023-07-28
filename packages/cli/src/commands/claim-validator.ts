import {
  baseUnitsToDisplayUnitsByDenom,
  gasEstimation,
  getCosmosAssetInfo,
} from '@cosmology/core';
import { coins as aminoCoins } from '@cosmjs/amino';

import {
  prompt,
  promptChain,
  promptMnemonic,
  printTransactionResponse,
  promptRpcEndpoint,
  getFuzzySearch,
  getFuzzySearchNames

} from '../utils';
import {
  assertIsDeliverTxSuccess
} from '@cosmjs/stargate';
import { cosmos, getSigningCosmosClient } from 'osmojs';
import { signAndBroadcast, getOfflineSignerAmino, getOfflineSignerProto } from 'cosmjs-utils';

// TODO research why Amino does not work — likely not enabled on backend?
const {
  withdrawValidatorCommission
} = cosmos.distribution.v1beta1.MessageComposer.fromPartial;

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);

  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken
      && a.type_asset !== 'ics20'
  ).base;
  if (!denom) throw new Error('cannot find asset base unit');

  const { mnemonic } = await promptMnemonic(argv);
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);
  const client = await cosmos.ClientFactory.createRPCQueryClient({ rpcEndpoint });
  const signer = await getOfflineSignerProto({ mnemonic, chain });
  const stargateClient = await getSigningCosmosClient({
    rpcEndpoint,
    signer
  });

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const data = await client.cosmos.staking.v1beta1.validators({
    // status: 'BOND_STATUS_BONDED'
    status: cosmos.staking.v1beta1.bondStatusToJSON(
      cosmos.staking.v1beta1.BondStatus.BOND_STATUS_BONDED
    )
  })

  const validators = data.validators.filter(validator => {
    return !validator.jailed
    // validator.status === 'BOND_STATUS_BONDED'
  });

  const choices = validators.map(validator => {
    return {
      name: validator.description.moniker,
      value: validator.operatorAddress
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

  let estGasMult = 1.3;
  if (argv.estGasMult) {
    estGasMult = Number(argv.estGasMult);
  }

  let fee = await gasEstimation(
    denom,
    stargateClient,
    address,
    [msg],
    '',
    1.3
  );

  // yarn dev claim-validator --chainToken JUNO --keychain your-val --gas 200000 --fee 15254 --feeDenom ujuno 

  if (/^[0-9]+$/.test(argv.fee)) {
    console.log('found a fee!');
    if (!argv.feeDenom) {
      throw new Error('requires --feeDenom')
    }
    if (!argv.gas) {
      throw new Error('requires --gas')
    }
    fee = {
      amount: aminoCoins(argv.fee, argv.feeDenom),
      gas: String(argv.gas)
    }
  }

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
