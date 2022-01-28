import { osmoRestClient, prompt } from '../utils';

export default async (argv) => {
    const { client, wallet } = await osmoRestClient(argv);

    const { txHash } = await prompt(
        [
            {
                type: 'string',
                name: 'txHash',
                message: 'txHash'
            }
        ],
        argv
    );

    const result = await client.getCosmosTransaction(txHash);
    console.log(result);
};
