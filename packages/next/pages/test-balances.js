import React, { Component, useState } from 'react';
import { Bech32Address } from '@keplr-wallet/cosmos';
import { OsmosisApiClient, getCoinFromDenom } from 'cosmology';
import { chains } from '@cosmology/cosmos-registry';
import { getKeplr } from '../src/utils/utils';

// TODO add test env switches
const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const restEndpoint = osmoChainConfig.apis.rest[0].address;

const BalanceTest = (props) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [balances, setBalances] = useState([]);

  const getBalance = async () => {
    setLoading(true);
    setLoaded(false);
    setBalances([]);

    const client = new OsmosisApiClient({
      url: restEndpoint
    });

    // get public key (address)
    getKeplr().enable(osmoChainConfig.chain_id);
    const offlineSigner = getKeplr().getOfflineSigner(osmoChainConfig.chain_id);
    const accounts = await offlineSigner.getAccounts();
    const osmoAddress = accounts[0].address;
    console.log(osmoAddress);

    // get balances
    const data = await client.getBalances(osmoAddress);
    console.log({ data });

    // enrich balance data
    /**
     * @type {{
     * denom:string;
     * amount:number;
     * }[]}
     */

    if (data && data.result) {
      const balanceList = data.result;
      const enrichedBalanceList = [];
      for (const balance of balanceList) {
        const coin = getCoinFromDenom(balance.denom);
        enrichedBalanceList.push({
          ...coin,
          amount: balance.amount,
          normedAmount: balance.amount * 10 ** -6
        });
      }

      setBalances(enrichedBalanceList);
    }
    setLoading(false);
    setLoaded(true);
  };

  return (
    <div>
      <button onClick={getBalance}>Get balance</button>
      {loading
        ? 'Loading...'
        : balances.length
        ? balances.map((b) => {
            return (
              <div
                className="horiz"
                key={b.base}
                style={{ borderBottom: '1px solid #212838' }}
              >
                <img
                  src={b.logo_URIs.png}
                  width={50}
                  height={50}
                  style={{ padding: 8 }}
                />
                <div style={{ marginLeft: 16 }}>
                  <h4 className="main-text">{b.symbol}</h4>
                  <p className="detail-text" style={{ fontSize: 12 }}>
                    {b.base}
                  </p>
                </div>
                <h5
                  className="main-text"
                  style={{ marginLeft: 'auto', marginRight: 8 }}
                >
                  {b.normedAmount}
                </h5>
              </div>
            );
          })
        : loaded
        ? "Didn't find any non-zero balances."
        : ''}
    </div>
  );
};

export default BalanceTest;
