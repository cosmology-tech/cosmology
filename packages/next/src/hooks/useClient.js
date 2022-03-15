import { OsmosisApiClient } from 'cosmology';
import { useState } from 'react';

import { chains } from '@pyramation/cosmos-registry';

// TODO add test env switches
const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const defaultRestEndpoint = osmoChainConfig.apis.rest[0].address;

/**
 *
 * @param {object} param0
 * @param {string=} param0.restEndpoint Defaults to OSMO network, override to access SECRET network
 * @returns {OsmosisApiClient}
 */
const useClient = ({ restEndpoint = defaultRestEndpoint } = {}) => {
  const [client, setClient] = useState(
    new OsmosisApiClient({
      url: restEndpoint
    })
  );

  // custom logic if we dynamically switch chains?

  return client;
};

export default useClient;
