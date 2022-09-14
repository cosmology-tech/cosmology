import { osmosis } from 'osmojs';
import { promptChain, promptRestEndpoint } from '../utils';

export default async (argv) => {
  let pools;

  argv.chainToken = 'OSMO';

  const chain = await promptChain(argv);
  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);
  const client = await osmosis.ClientFactory.createLCDClient({ restEndpoint });

  try {
    pools = await client.osmosis.gamm.v1beta1.pools()
  } catch (e) {
    console.log(e);
    return console.log('error fetching pools');
  }
  console.log(JSON.stringify(pools, null, 2));
};
