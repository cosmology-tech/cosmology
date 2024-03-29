import { prompt, promptChain, promptRestEndpoint } from '../utils';
import { cosmos } from 'osmojs';

export default async (argv) => {
  const chain = await promptChain(argv);
  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);
  const client = await cosmos.ClientFactory.createLCDClient({ restEndpoint });
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

  const data = await client.cosmos.tx.v1beta1.getTx({
    hash: txHash
  });

  console.log(data);
};

