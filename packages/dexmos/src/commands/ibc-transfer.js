import { getOsmosisSymbolIbcName, displayUnitsToDenomUnits, getNameOfChain, osmoRpcClient, prompt, getOsmosisAssetIbcInfo } from '../utils';
import { signAndBroadcast, } from '../messages';
import { messages } from '../messages/native';
import Long from 'long';
import { coin, coins } from '@cosmjs/amino';

export default async (argv) => {
    const { client, wallet } = await osmoRpcClient(argv);
    const [account] = await wallet.getAccounts();
    // https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/aminotypes.ts#L464
    const { receiver, symbol, toChain, fromChain, amount } = await prompt([
        {
            type: 'string',
            name: 'receiver',
            message: 'receiver'
        },
        {
            type: 'fuzzy:chain',
            name: 'toChain',
            message: 'toChain'
        },
        {
            type: 'fuzzy:chain',
            name: 'fromChain',
            message: 'fromChain'
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

    const shouldBeOsmo = getNameOfChain(fromChain);
    if (shouldBeOsmo !== 'osmosis') {
        throw new Error('we only support transfers out of osmosis currently.');
    }

    const sendAmount = displayUnitsToDenomUnits(symbol, amount);
    const ibcName = getOsmosisSymbolIbcName(symbol);
    const ibcInfo = getOsmosisAssetIbcInfo(symbol);
    const address = account.address;

    const { msg, fee } = messages.transfer({
        sender: address,
        receiver,
        token: coin(sendAmount, ibcName),
        sourcePort: "transfer",
        sourceChannel: ibcInfo.dst_channel,
        timeoutHeight: {
            // TODO calculate this properly
            revisionNumber: Long.fromString("1"),
            revisionHeight: Long.fromString("1653666")
        },
        // TODO calculate this properly
        timeoutTimestamp: Long.fromString(Date.now() + '')
    });

    console.log({ chainId: argv.chainId, address, msg, fee });
    const res = await signAndBroadcast({ client, chainId: argv.chainId, address, msg, fee });
    console.log(res);
};
