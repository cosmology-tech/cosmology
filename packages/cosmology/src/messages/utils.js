import { AminoTypes, SigningStargateClient } from '@cosmjs/stargate';
import { Registry } from '@cosmjs/proto-signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { coins } from '@cosmjs/amino';
import { defaultRegistryTypes } from '@cosmjs/stargate';

import { aminos } from './aminos';
import { meta as metaInfo } from './meta';

export const getSigningOsmosisClient = async ({ rpcEndpoint, signer }) => {
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
    signer,
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
  memo = ''
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

const retry = require('retry');

function getCosmosTx({ cosmos, transactionHash }) {
  const operation = retry.operation({
    retries: 5,
    factor: 2,
    minTimeout: 1 * 1000,
    maxTimeout: 60 * 1000
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      let results;
      let err;
      try {
        results = await cosmos.getCosmosTransaction(transactionHash);
      } catch (e) {
        console.log(e);
        err = true;
      }

      if (operation.retry(err)) {
        return;
      }

      // perhaps a tautology but semantics are that we
      // want to ensure tx is in the chain
      if (results.tx_response.txhash === transactionHash) {
        resolve(results);
      } else {
        reject(operation.mainError());
      }
    });
  });
}

export const signAndBroadcastTilTxExists = async ({
  client,
  cosmos,
  chainId,
  address,
  msg,
  fee,
  memo = ''
}) => {
  const result = await signAndBroadcast({
    client,
    chainId,
    address,
    msg,
    fee,
    memo
  });

  if (result.transactionHash) {
    const results = await getCosmosTx({
      cosmos,
      transactionHash: result.transactionHash
    });
    return results;
  }

  console.log(result);
  throw new Error('no tx hash');
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
