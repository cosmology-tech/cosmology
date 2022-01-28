import { OsmosisApiClient } from '../clients/osmosis';
import { prompt } from '../utils';

export default async (argv) => {
  let pools;

  const { includeDetails } = await prompt(
    [
      {
        type: 'confirm',
        name: 'includeDetails',
        message: 'include details, like images?',
        default: false
      }
    ],
    argv
  );

  try {
    const client = new OsmosisApiClient();
    pools = await client.getPoolsPretty({ includeDetails });
  } catch (e) {
     console.log(e);
    return console.log('error fetching pools');
  }
  console.log(pools);
};
