import React, { Component, useEffect, useState } from 'react';
import {
  OsmosisApiClient,
  OsmosisValidatorClient,
  getCoinFromDenom,
  symbolsAndDisplayValuesToCoinsArray,
  getTradesRequiredToGetBalances,
  getSwaps,
  getFilteredPoolsWithValues,
  convertValidatorPricesToDenomPriceHash,
  messages,
  signAndBroadcast,
  getSigningOsmosisClient
} from 'cosmology';

import { chains } from '@pyramation/cosmos-registry';
import { getColor, getKeplr } from '../src/utils/utils';
import useRoot from '../src/hooks/useRoot';
import LoadingIndicator from '../src/components/subComponents/LoadingIndicator';
import TokenInput from '../src/components/token/TokenInput';
import {
  SigningStargateClient,
  calculateFee,
  assertIsDeliverTxSuccess,
  GasPrice
} from '@cosmjs/stargate';

// TODO add test env switches
const osmoChainConfig = chains.find((el) => el.chain_name === 'osmosis');
const restEndpoint = osmoChainConfig.apis.rest[0].address;
const rpcEndpoint = osmoChainConfig.apis.rpc[0].address;

const SwapTest = (props) => {
  const [inToken, setInToken] = useState(null);
  const [inAmount, setInAmount] = useState('0');
  const [outToken, setOutToken] = useState(null);
  const [outAmount, setOutAmount] = useState(0);

  const loadConfig = {
    loadBalances: true,
    loadTokens: true,
    loadPairsSummary: true,
    loadPoolsInfo: true
  };

  const {
    client,
    validator,
    keplr,
    balances,
    tokens,
    pairsSummary,
    poolsInfo,
    loading
  } = useRoot({
    chainConfig: osmoChainConfig,
    ...loadConfig
  });

  useEffect(() => {
    if (!loading) {
      console.log({
        balances,
        tokens,
        pairsSummary,
        poolsInfo
      });
    }
  }, [loading]);

  useEffect(() => {
    setInAmount('0');
  }, [inToken]);

  useEffect(() => {
    if (inAmount && inToken && outToken) {
      const inAmountUSD = getUSDAmountForDenom(inToken, inAmount);

      const token = tokens.find((token) => {
        return token.denom === outToken;
      });
      const outPrice = token?.price;

      if (outPrice) {
        setOutAmount(inAmountUSD / (outPrice * 10 ** -6));
      }
    }
  }, [inAmount, outToken, inToken]);
  console.log({ outAmount, outToken });

  const executeSwap = async () => {
    if (inToken && outToken && inAmount && outAmount) {
      const tokenInObj = {
        denom: inToken, // this is a denom
        amount: Number(inAmount) // this is the micro amount (10^-6)
      };

      const balances = [tokenInObj];
      const desired = [
        {
          denom: outToken,
          amount: outAmount * 0.99999
        }
      ];
      const prices = convertValidatorPricesToDenomPriceHash(tokens);
      console.log({ prices, balances, desired });

      const trades = getTradesRequiredToGetBalances({
        prices,
        balances,
        desired
      });
      console.log({ trades });

      const swaps = getSwaps({
        prices,
        pools: poolsInfo.pools,
        trades,
        pairs: pairsSummary.data
      });
      console.log({ swaps });

      keplr.enable(osmoChainConfig.chain_id);
      /*

      https://docs.keplr.app/api/cosmjs.html#types-of-offline-signers

      "Amino is used for Launchpad chains and Protobuf is used for Stargate chains."
      - [x] figure out why we're using this, seems that we should be using stargate...

      ANSWER: "However, if the msg to be sent is able to be serialized/deserialized using Amino codec you can use a signer for Amino. Also, as there are some limitations to protobuf type sign doc, there may be cases when Amino is necessary. For example, Protobuf formatted sign doc is currently not supported by Ledger Nano’s Cosmos app. Also, because protobuf sign doc is binary formatted, msgs not natively supported by Keplr may not be human-readable."

      */

      const offlineSigner = keplr.getOfflineSignerOnlyAmino(
        osmoChainConfig.chain_id
      );
      const accounts = await offlineSigner.getAccounts();
      const osmoAddress = accounts[0].address;

      const { msg, fee } = messages.swapExactAmountIn({
        sender: osmoAddress,
        routes: swaps[0].routes,
        tokenIn: tokenInObj,
        tokenOutMinAmount: outAmount * 0.95 // 1% slippage
      });
      console.log({ msg, fee });

      // const stargateClient = await SigningStargateClient.connectWithSigner(
      //     rpcEndpoint,
      //     offlineSigner
      // );

      const stargateClient = await getSigningOsmosisClient({
        rpcEndpoint,
        signer: offlineSigner
      });

      const res = await signAndBroadcast({
        client: stargateClient,
        chainId: osmoChainConfig.chain_id,
        address: osmoAddress,
        msg,
        fee,
        memo: ''
      });

      // const res = await stargateClient.signAndBroadcast(osmoAddress, [msg], fee, '');
      console.log(res);
    } else {
      alert('Make sure to define inToken, outToken, and inAmount.');
    }
  };

  // const getBalance = async () => {
  //     setLoading(true);
  //     setLoaded(false);
  //     setBalances([]);

  //     const client = new OsmosisApiClient({
  //         url: restEndpoint
  //     });

  //     // get public key (address)
  //     getKeplr().enable(osmoChainConfig.chain_id);
  //     const offlineSigner = getKeplr().getOfflineSigner(osmoChainConfig.chain_id);
  //     const accounts = await offlineSigner.getAccounts();
  //     const osmoAddress = accounts[0].address;
  //     console.log(osmoAddress);

  //     // get balances
  //     const data = await client.getBalances(osmoAddress)
  //     console.log({ data });

  //     // get prices
  //     const validator = new OsmosisValidatorClient({
  //         url: 'https://api-osmosis.imperator.co/'
  //     });
  //     const tokensAndPrices = await validator.getTokens();
  //     console.log(tokensAndPrices);

  //     const pairsSummary = await validator.getPairsSummary();
  //     console.log(pairsSummary);

  //     const poolsInfo = await client.getPools();
  //     console.log(poolsInfo);

  //     const prices = convertValidatorPricesToDenomPriceHash(tokensAndPrices);
  //     const pools = getFilteredPoolsWithValues({ prices, pools: poolsInfo.pools })

  //     console.log(prices);
  //     console.log(pools);

  //     // enrich balance data
  //     /**
  //      * @type {{
  //      * denom:string;
  //      * amount:number;
  //      * }[]}
  //      */

  //     if (data && data.result) {
  //         const balanceList = data.result;
  //         const enrichedBalanceList = [];
  //         for (let balance of balanceList) {
  //             const coin = getCoinFromDenom(balance.denom);
  //             enrichedBalanceList.push({
  //                 ...coin,
  //                 amount: balance.amount
  //             });
  //         }

  //         setBalances(enrichedBalanceList);
  //     }
  //     setLoading(false);
  //     setLoaded(true);
  // }

  function getUSDAmountForDenom(denom, inAmount = null) {
    const inTokenBalanceObj = balances.result.find((balance) => {
      return balance.denom === denom;
    });

    const tokenBalance = inAmount || inTokenBalanceObj?.amount || 0;

    const token = tokens.find((token) => {
      return token.denom === denom;
    });

    return token?.price * tokenBalance * 10 ** -6;
  }

  return (
    <div>
      <LoadingIndicator
        loadConfig={loadConfig}
        loading={loading}
        loadables={{
          balances,
          tokens,
          pairsSummary,
          poolsInfo
        }}
      />

      {tokens && tokens.length && balances && balances.result ? (
        <div
          style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}
        >
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div
              style={{
                flexBasis: 250,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch'
              }}
            >
              <p className="detail-text" style={{ marginBottom: 4 }}>
                In Token:
              </p>
              <TokenInput
                tokens={tokens}
                value={inToken}
                onChange={(v) => setInToken(v)}
              />
            </div>
            <div
              style={{
                flexBasis: 250,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="horiz" style={{ alignItems: 'flex-start' }}>
                <p className="detail-text" style={{ marginBottom: 4 }}>
                  In Amount:
                </p>
                <button
                  className="secondary-button"
                  style={{
                    height: 17.5,
                    padding: '0 8px',
                    fontSize: 11,
                    backgroundColor: '#212838',
                    marginLeft: 'auto'
                  }}
                  onClick={() => {
                    const inTokenBalanceObj = balances.result.find(
                      (balance) => {
                        return balance.denom === inToken;
                      }
                    );

                    const tokenBalance = inTokenBalanceObj?.amount || 0;
                    setInAmount(tokenBalance);
                  }}
                >
                  Max
                </button>
              </div>
              <input
                type={'number'}
                value={inAmount}
                onChange={(e) => setInAmount(e.currentTarget.value)}
              />
              <p className="detail-text">
                <b>USD Amount:</b> $
                {getUSDAmountForDenom(inToken, inAmount).toFixed(4)}
              </p>
            </div>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'flex-end', marginTop: 16 }}
          >
            <div
              style={{
                flexBasis: 250,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch'
              }}
            >
              <p className="detail-text">Out Token:</p>
              <TokenInput
                tokens={tokens}
                value={outToken}
                onChange={(v) => setOutToken(v)}
              />
            </div>
            <div
              style={{
                flexBasis: 250,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {outToken && (
                <p className="detail-text">
                  <b>Out amount (ideal):</b> $
                  {getUSDAmountForDenom(outToken, outAmount).toFixed(4)} (
                  {outAmount.toFixed(2)})
                </p>
              )}
            </div>
          </div>
          <button className="action-button" onClick={executeSwap}>
            Perform Swaps
          </button>
        </div>
      ) : (
        'Waiting for Balances and Tokens...'
      )}
      {/* <button onClick={getBalance}>Get balance</button>
        {loading ?
            'Loading...' :
            balances.length ?
                balances.map(b => {
                    return <div className='horiz' key={b.base} style={{ borderBottom: '1px solid #212838' }}>
                        <img src={b.logo_URIs.png} width={50} height={50} style={{ padding: 8 }} />
                        <div style={{ marginLeft: 16 }}>
                            <h4 className='main-text'>{b.symbol}</h4>
                            <p className='detail-text' style={{ fontSize: 12 }}>{b.base}</p>
                        </div>
                        <h5 className='main-text' style={{ marginLeft: 'auto', marginRight: 8 }}>{b.amount}</h5>
                    </div>
                })
                :
                loaded ?
                    "Didn't find any non-zero balances."
                    :
                    ""} */}
    </div>
  );
};

export default SwapTest;
