import { AminoTypes, SigningStargateClient } from '@cosmjs/stargate';
import { Registry } from '@cosmjs/proto-signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { coins } from '@cosmjs/amino';
import { defaultRegistryTypes } from '@cosmjs/stargate';

import { aminos } from './aminos';
import { meta as metaInfo } from './meta';

export const getClient = async ({ rpcEndpoint, wallet }) => {
  // registry
  const registry = new Registry(defaultRegistryTypes);

  // aminotypes
  const aminoTypes = new AminoTypes({
    additions: Object.keys(aminos).reduce((m, key) => {
      const meta = metaInfo[key];
      const { toAmino, fromAmino } = aminos[key];
      m[meta.amino] = {
        aminoType: meta.type,
        toAmino,
        fromAmino
      };
      return m;
    }, {})
  });

  // register the goods
  Object.keys(aminos).forEach((key) => {
    const meta = metaInfo[key];
    registry.register(meta.amino, meta.osmosis);
  });

  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { registry: registry, aminoTypes: aminoTypes }
  );

  return client;
};

export const signAndBroadcast = async ({
  client,
  chainId,
  address,
  msg,
  fee,
  memo = 'dexmos.finance'
}) => {
  const { accountNumber, sequence } = await client.getSequence(address);
  const txRaw = await client.sign(address, [msg], fee, memo, {
    accountNumber: accountNumber,
    sequence: sequence,
    chainId
  });
  const txBytes = TxRaw.encode(txRaw).finish();
  return await client.broadcastTx(txBytes);
};

export const generateOsmoMessage = (name, msg) => {
  if (!metaInfo[name]) throw new Error('missing message.');
  const gas = metaInfo[name].gas + ''; // TEST if needs string or if number is ok
  const fee = {
    amount: coins(0, 'uosmo'),
    gas
  };

  return {
    fee,
    msg: {
      typeUrl: metaInfo[name].amino,
      value: msg
    }
  };
};

