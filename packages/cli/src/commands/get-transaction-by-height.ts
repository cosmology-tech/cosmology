import { prompt, promptChain, promptRestEndpoint } from '../utils';
import { cosmos } from 'osmojs';
import Long from 'long';

export default async (argv) => {
  const chain = await promptChain(argv);
  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);
  const client = await cosmos.ClientFactory.createLCDClient({ restEndpoint });
  const { height } = await prompt(
    [
      {
        type: 'string',
        name: 'height',
        message: 'height'
      }
    ],
    argv
  );

  const data = await client.cosmos.base.tendermint.v1beta1.getBlockByHeight({
    height: Long.fromValue(height)
  });

  console.log(data);
};

