import { osmoRpcClient, prompt } from '../utils';
import { signAndBroadcast, } from '../messages';
import { messages } from '../messages/native';
import Long from 'long';
import { coin, coins } from '@cosmjs/amino';
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
// import { defaultRegistryTypes } from '@cosmjs/stargate';

// defaultRegistryTypes

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
        token: coin("500000", "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"),
        sourcePort: "transfer",
        sourceChannel: "channel-0",
        timeoutHeight: {
            revisionNumber: "1",
            revisionHeight: "1653666"
        }
        // timeoutTimestamp: new Date()
    });
    const msgte = Uint8Array.from(MsgTransfer.encode({
        sender: address,
        receiver,
        token: coin(
            "500000",
            "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
        ),
        sourcePort: "transfer",
        sourceChannel: "channel-0",
        timeoutHeight: {
            revisionNumber: Long.fromString("1"),
            revisionHeight: Long.fromString("1653666")
        },
        timeoutTimestamp: Long.fromString(Date.now() + '')
    }).finish());
    
    console.log({msgte});


    // const sendUintArray = await signAndBroadcast({ 
    //     client,
    //     chainId: argv.chainId,
    //     address,
    //     msg: msgte,
    //     fee: {
    //         amount: coins(0, 'uosmo'),
    //         gas: "130000"
    //     }
    // });

    // console.log(sendUintArray);

    // https://github.com/cosmos/cosmjs/blob/main/packages/stargate/src/aminotypes.ts#L464
    const message = {
        fee: {
            amount: coins(0, 'uosmo'),
            gas: "130000"
        },
        msg: {
            typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
            value: {
                sender: address,
                receiver,
                token: coin(
                    "500000",
                    "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
                ),
                sourcePort: "transfer",
                sourceChannel: "channel-0",
                timeoutHeight: {
                    revisionNumber: Long.fromString("1"),
                    revisionHeight: Long.fromString("1653666")
                },
                timeoutTimestamp: Long.fromString(Date.now() + '')
            }
        }
    };

    // const res = await client.sendIbcTokens(
    //     address,
    //     receiver,
    //     coin(
    //         "500000",
    //         "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
    //     ),
    //     'transfer',
    //     'channel-0',
    //     undefined,
    //     Math.floor(Date.now()/1000 + 15*60), 
    //     {
    //         amount: coins(0, 'uosmo'),
    //         gas: "130000"
    //     },
    //     ""
    // );

    // console.log(res);

    // const res2 = await signAndBroadcast({ 
    //     client,
    //     chainId: argv.chainId,
    //     address,
    //     msg: message.msg,
    //     fee: message.fee
    // });

    // console.log(res2);

    // const { transactionHash } = res2;
    // console.log({transactionHash});


    // const {
    //     sourcePort,
    //     sourceChannel,
    //     token,
    //     sender,
    //     timeoutHeight
    // } = msgt;

    const { msg, fee } = messages.transfer({
        sender: address,
        receiver,
        token: coin("500000", "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"),
        sourcePort: "transfer",
        sourceChannel: "channel-0",
        timeoutHeight: {
            revisionNumber: Long.fromString("1"),
            revisionHeight: Long.fromString("1653666")
        },
        timeoutTimestamp: Long.fromString(Date.now() + '')
    });

    // const { msg, fee } = messages.transfer({
    //     sender: address,
    //     receiver,
    //     token: coin("500000", "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"),
    //     sourcePort: "transfer",
    //     sourceChannel: "channel-0",
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
