import { OsmosisValidatorClient } from 'dexmos';
import { useState } from 'react';

// TODO add test env switches
const defaultValidatorUrl = 'https://api-osmosis.imperator.co/';

/**
 *
 * @param {object} param0
 * @param {string=} param0.url Defaults to OSMO network, override to access SECRET network
 * @returns {OsmosisValidatorClient}
 */
const useValidator = ({ url = defaultValidatorUrl } = {}) => {
  const [validator, setValidator] = useState(
    new OsmosisValidatorClient({
      url
    })
  );

  // custom logic if we dynamically switch chains?

  return validator;
};

export default useValidator;
