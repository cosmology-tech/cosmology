import { OsmosisApiClient, OsmosisValidatorClient } from 'cosmology';
import { useEffect, useState } from 'react';

import { chains } from '@cosmology/cosmos-registry';
import useClient from './useClient';
import useValidator from './useValidator';
import useKeplr from './useKeplr';

// TODO add test env switches
const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
// const defaultRestEndpoint = osmoChainConfig.apis.rest[0].address;

/**
 * @typedef {{
 * keplr: import('@keplr-wallet/types').Keplr,
 * client: OsmosisApiClient,
 * validator: OsmosisValidatorClient,
 * balances: Object,
 * tokens: Array,
 * pairsSummary: Object,
 * poolsInfo: Object,
 * loading: boolean,
 * }} useRootReturnObj
 */

/**
 *
 * @param {object} param0
 * @param {object=} param0.chainConfig Defaults to OSMO network, override to access SECRET network
 * @param {boolean=} param0.loadBalances
 * @param {boolean=} param0.loadTokens
 * @param {boolean=} param0.loadPairsSummary
 * @param {boolean=} param0.loadPoolsInfo
 * @returns {useRootReturnObj}
 */
const useRoot = ({
  chainConfig = osmoChainConfig,
  loadBalances = false,
  loadTokens = false,
  loadPairsSummary = false,
  loadPoolsInfo = false
}) => {
  const client = useClient();
  const validator = useValidator();
  const keplr = useKeplr();

  const [balances, setBalances] = useState({});
  const [tokens, setTokens] = useState([]);
  const [pairsSummary, setPairsSummary] = useState({});
  const [poolsInfo, setPoolsInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      async function balanceLoader() {
        try {
          // this will probably need to be edited for when we also load other networks (SECRET)
          const offlineSigner = keplr.getOfflineSigner(chainConfig.chain_id);
          const accounts = await offlineSigner.getAccounts();
          const osmoAddress = accounts[0].address;
          const balances = await client.getBalances(osmoAddress);
          return balances;
        } catch (e) {
          console.error('There was an error loading balances:', e);
          return [];
        }
      }

      const loaderConfig = [
        {
          id: 'balances',
          shouldLoad: loadBalances,
          setter: setBalances,
          asyncLoader: balanceLoader
        },
        {
          id: 'tokens',
          shouldLoad: loadTokens,
          setter: setTokens,
          asyncLoader: validator.getTokens
        },
        {
          id: 'pairs-summary',
          shouldLoad: loadPairsSummary,
          setter: setPairsSummary,
          asyncLoader: validator.getPairsSummary
        },
        {
          id: 'pool-info',
          shouldLoad: loadPoolsInfo,
          setter: setPoolsInfo,
          asyncLoader: client.getPools
        }
      ];

      async function genericLoader({ id, shouldLoad, setter, asyncLoader }) {
        // console.log("Loading ", id);
        try {
          if (shouldLoad) {
            const data = await asyncLoader();
            // console.log("Loaded", id, ":", data);
            return setter(data);
          }
        } catch (e) {
          console.error(`Unable to load for loader id "${id}":`, e);
        }
      }

      await Promise.all([
        balanceLoader,
        ...loaderConfig.filter((c) => c.shouldLoad).map((c) => genericLoader(c))
      ]);
      setLoading(false);
    })();
  }, []);

  return {
    client,
    validator,
    keplr,
    balances,
    tokens,
    pairsSummary,
    poolsInfo,
    loading
  };
};

export default useRoot;
