import { OsmosisApiClient } from 'cosmology';
import { useEffect, useState } from 'react';

import { chains } from '@pyramation/cosmos-registry';
import { getKeplr } from '../utils/utils';
import { OfflineSigner } from '@cosmjs/launchpad';

// TODO add test env switches
const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const defaultChainId = osmoChainConfig.chain_id;

/**
 * @typedef {import('@keplr-wallet/types').Keplr} useKeplrReturnObj
 */

/**
 *
 * @param {object} param0
 * @param {string=} param0.chain_id Defaults to OSMO chain, override to access other chains
 * @returns {useKeplrReturnObj}
 */
const useKeplr = ({ chain_id = defaultChainId } = {}) => {
  const [keplr, setKeplr] = useState(getKeplr());

  useEffect(() => {
    if (!keplr) {
      setKeplr(getKeplr());
      keplr.enable(chain_id);
    }
  }, []);

  return keplr;
};

export default useKeplr;
