import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import {
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue,
  osmoDenomToSymbol,
  getOsmosisAssetInfo,
  getCosmosAssetInfo,
  convertValidatorPricesToDenomPriceHash
} from 'cosmology';

import Loader from 'react-loaders';
import LoadingIndicator from '../src/components/subComponents/LoadingIndicator';

const SelectBalances = ({
  exclusions = [],
  handleSetExclusions,
  keplr,
  balances,
  tokens,
  osmoChainConfig
}) => {
  const [displayBalances, setDisplayBalances] = useState([]);
  const [loadingBalances, setLoadingBalances] = useState(true);

  useEffect(() => {
    (async () => {
      if (!tokens || !tokens.length || !balances || !balances.result) return;
      setLoadingBalances(true);
      //   const { client, wallet: signer } = await osmoRestClient({});
      // const client

      keplr.enable(osmoChainConfig.chain_id);
      const signer = keplr.getOfflineSignerOnlyAmino(osmoChainConfig.chain_id);
      const [account] = await signer.getAccounts();
      const address = account.address;
      const accountBalances = balances;
      const display = accountBalances.result
        .map(({ denom, amount }) => {
          const symbol = osmoDenomToSymbol(denom);
          try {
            const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
            const prices = convertValidatorPricesToDenomPriceHash(tokens);
            const dollarAmount = baseUnitsToDollarValue(prices, symbol, amount);
            const assetInfo = getOsmosisAssetInfo(symbol);
            const logo = assetInfo.logo_URIs.png;
            console.log({ assetInfo });
            return {
              symbol,
              denom,
              amount,
              displayAmount,
              dollarAmount,
              logo,
              checked: !exclusions.includes(symbol)
            };
          } catch (e) {
            console.log('Token not found for symbol', symbol, e);
          }
        })
        .filter((b) => !!b)
        .sort((a, b) => {
          return b.dollarAmount - a.dollarAmount;
        });

      setLoadingBalances(false);
      setDisplayBalances(display);
    })();
  }, [tokens]);

  function handleBalanceToggle(idx) {
    setDisplayBalances(
      displayBalances.map((b, i) => {
        if (i === idx) {
          return {
            ...b,
            checked: !b.checked
          };
        }
        return b;
      })
    );
  }

  function handleNext() {
    const exclusions = [];

    for (const balance of displayBalances) {
      if (!balance.checked) exclusions.push(balance.symbol);
    }

    handleSetExclusions(exclusions);
  }

  return (
    <div>
      {/* <LoadingIndicator
        loadConfig={loadConfig}
        loading={loading}
        loadables={{
          balances,
          tokens,
          pairsSummary,
          poolsInfo
        }}
      /> */}
      <div>
        <h3
          className="main-text"
          style={{ textAlign: 'left', marginBottom: 2 }}
        >
          Balances to Reinvest
        </h3>
        <p
          className="detail-text"
          style={{ textAlign: 'left', marginBottom: 16, opacity: 0.5 }}
        >
          Select which assets to use for compounding, deselect assets that you
          want to hold. By default, all balances over $0.01 will be compounded
          every epoch.
        </p>
        <div className="balances-container">
          {loadingBalances ? (
            <Loader type="ball-rotate" />
          ) : (
            displayBalances.map((balance, i) => {
              return (
                <div className="horiz balance-row" key={balance.symbol}>
                  <input
                    type="checkbox"
                    checked={balance.checked}
                    onChange={() => handleBalanceToggle(i)}
                  />
                  <img src={balance.logo} />
                  <p className="main-text">{balance.symbol}</p>
                  <p className="detail-text" style={{ marginLeft: 'auto' }}>
                    {balance.dollarAmount < 0.01
                      ? '< $0.01'
                      : '$' + balance.dollarAmount.toFixed(2)}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <button
          className="action-button"
          style={{ width: '100%' }}
          onClick={handleNext}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SelectBalances;
