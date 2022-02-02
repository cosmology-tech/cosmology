// @ts-nocheck
import validatorPricesFixture from '../__fixtures__/validator/tokens/v2/all/data.json';
import pairsFixture from '../__fixtures__/validator/pairs/v1/summary/data.json';
import poolsFixture from '../__fixtures__/lcd/osmosis/gamm/v1beta1/pools/data.json';
import lockedPoolsFixture from '../__fixtures__/lcd/osmosis/lockup/v1beta1/account_locked_coins/osmo1/data.json';

import {
    getPoolAprs
} from '../src/utils/osmo';
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
        lockup: "14"
    });
    console.log(result);
});

