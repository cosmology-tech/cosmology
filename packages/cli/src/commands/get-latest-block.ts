import { promptChain, promptRestEndpoint } from '../utils';
import { cosmos } from 'osmojs';

export default async (argv) => {
  const chain = await promptChain(argv);
  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);
  const client = await cosmos.ClientFactory.createLCDClient({ restEndpoint });
  const data = await client.cosmos.base.tendermint.v1beta1.getLatestBlock();
  console.log(data);
};
