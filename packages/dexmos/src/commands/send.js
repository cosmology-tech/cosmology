import { getCosmosAssetInfo, getOsmosisAssetInfo, cosmosRpcClient, prompt, displayUnitsToDenomUnits, getOsmosisSymbolIbcName } from '../utils';
import { signAndBroadcast, } from '../messages';
import { messages } from '../messages/native';
import Long from 'long';
import { coin, coins } from '@cosmjs/amino';
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";

import { assets } from '@pyramation/cosmos-registry';

export default async (argv) => {
    const { client, wallet } = await cosmosRpcClient(argv);
    const [account] = await wallet.getAccounts();
    // https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/aminotypes.ts#L464
    const { receiver, symbol, amount } = await prompt([
        {
            type: 'string',
            name: 'receiver',
            message: 'receiver'
        },
        {
            type: 'fuzzy:token',
            name: 'symbol',
            message: 'symbol'
        },
        {
            type: 'number',
            name: 'amount',
            message: 'amount'
        }
    ], argv);

    const assetInfo = getCosmosAssetInfo(symbol);
    const sendAmount = displayUnitsToDenomUnits(symbol, amount);
    const address = account.address;
    // const coinDenom = symbol;
    const coinDenom = "uatom";
    const { msg, fee } = messages.send({
        chainId: assetInfo.chain_id,
        fromAddress: address,
        toAddress: receiver,
        amount: coins(sendAmount, coinDenom)
    });

    // console.log({ chainId: argv.chainId, address, msg, fee });
    const res = await signAndBroadcast({ client, chainId: argv.chainId, address, msg, fee });

    console.log(res);
};
