import { osmoRpcClient, prompt } from '../utils';
import { signAndBroadcast, } from '../messages';
import { messages } from '../messages/native';
import Long from 'long';
import { coin } from '@cosmjs/amino';
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";

export default async (argv) => {
    const { client, wallet } = await osmoRpcClient(argv);
    const [account] = await wallet.getAccounts();
    // https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/aminotypes.ts#L464
    const { receiver } = await prompt([
        {
            type: 'string',
            name: 'receiver',
            message: 'receiver'
        }
    ], argv);

    // try {
    const address = account.address;
    const msgt = MsgTransfer.fromJSON({
        sender: address,
        receiver,
        token: coin("500000", "ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED"),
        sourcePort: "transfer",
        sourceChannel: "channel-42",
        timeoutHeight: {
            revisionNumber: "1",
            revisionHeight: "1653666"
        }
    });
    const {
        sourcePort,
        sourceChannel,
        token,
        sender,
        timeoutHeight
    } = msgt;

    const { msg, fee } = messages.transfer({
        sourcePort,
        sourceChannel,
        receiver,
        token,
        sender,
        timeoutHeight
    });
    // const { msg, fee } = messages.transfer({
    //     sender: address,
    //     receiver,
    //     token: coin("500000", "ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED"),
    //     sourcePort: "transfer",
    //     sourceChannel: "channel-42",
    //     timeoutHeight: {
    //         revisionNumber: Long.fromString("1"),
    //         revisionHeight: Long.fromString("1653666")
    //     }
    // });

    console.log({ chainId: argv.chainId, address, msg, fee });
    const res = await signAndBroadcast({ client, chainId: argv.chainId, address, msg, fee });

    console.log(res);
    // } catch (e) {
    // console.log('error ' + e);
    // }
};
