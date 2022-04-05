// @ts-nocheck
import { getPoolAprs } from '../src/utils/osmo';
import { OsmosisValidatorClient } from '../__fixtures__/clients/validator';
import { OsmosisApiClient } from '../__fixtures__/clients/api';

const validator = new OsmosisValidatorClient();
const api = new OsmosisApiClient();

it('APRs', async () => {
  const result = await getPoolAprs({
    api,
    validator,
    poolIds: ['606', '600'],
    liquidityLimit: 100_000,
    lockup: '14'
  });
  // console.log(result);
});
