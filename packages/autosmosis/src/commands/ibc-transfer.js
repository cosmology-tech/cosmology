import { osmoRpcClient, prompt } from '../utils';
import { signAndBroadcast, } from '../messages';
import { messages } from '../messages/native';

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
        const { msg, fee } = messages.transfer({
            sender: address,
            receiver,
            token: {
                "denom": "ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED",
                "amount": "500000"
            },
            sourcePort: "transfer",
            sourceChannel: "channel-42",
            timeoutHeight: {
                revisionNumber: "1",
                revisionHeight: "1653666"
            }
        });

        console.log({ chainId: argv.chainId, address, msg, fee });
        const res = await signAndBroadcast({ client, chainId: argv.chainId, address, msg, fee });

        console.log(res);
    // } catch (e) {
        // console.log('error ' + e);
    // }
};
