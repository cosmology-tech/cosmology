import {
  calculateFee,
  GasPrice,
  SigningStargateClient
} from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import { BroadcastTxResponse } from '../types';
export { getSigningOsmosisClient } from 'osmojs';


export const signAndBroadcast = async ({
  client,
  chainId,
  address,
  msg,
  fee,
  memo = ''
}: {
  client: SigningStargateClient,
  chainId: string,
  address: string,
  msg: any,
  fee: any,
  memo: string
}): Promise<BroadcastTxResponse> => {
  const { accountNumber, sequence } = await client.getSequence(address);
  const txRaw = await client.sign(address, [msg], fee, memo, {
    accountNumber: accountNumber,
    sequence: sequence,
    chainId
  });
  const txBytes = TxRaw.encode(txRaw).finish();
  return await client.broadcastTx(txBytes);
};

export const signAndBroadcastBatch = async ({
  client,
  chainId,
  address,
  msgs,
  fee,
  memo = ''
}: {
  client: SigningStargateClient,
  chainId: string,
  address: string,
  msgs: any[],
  fee: any,
  memo: string
}) => {
  const { accountNumber, sequence } = await client.getSequence(address);
  const txRaw = await client.sign(address, msgs, fee, memo, {
    accountNumber: accountNumber,
    sequence: sequence,
    chainId
  });
  const txBytes = TxRaw.encode(txRaw).finish();
  return await client.broadcastTx(txBytes);
};

export const estimateOsmoFee = async (client: SigningStargateClient, address: string, msgs: any[], memo: string) => {
  const gasPrice = GasPrice.fromString('0.025uosmo');
  const gasEstimation = await client.simulate(address, msgs, memo);
  const fee = calculateFee(Math.round(gasEstimation * 1.3), gasPrice);
  return fee;
};

export const noDecimals = (num) => {
  return new IntPretty(new Dec(num)).maxDecimals(0).locale(false).toString();
};
