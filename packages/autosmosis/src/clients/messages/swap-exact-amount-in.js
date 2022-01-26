import { coins } from '@cosmjs/launchpad';

// {
//     "chain_id": "osmosis-1",
//     "account_number": "94919",
//     "sequence": "1640",
//     "fee": {
//       "gas": "250000",
//       "amount": [
//         {
//           "denom": "uosmo",
//           "amount": "0"
//         }
//       ]
//     },
//     "msgs": [
//       {
//         "type": "osmosis/gamm/swap-exact-amount-in",
//         "value": {
//           "sender": "osmo1-REDACTED",
//           "routes": [
//             {
//               "poolId": "606",
//               "tokenOutDenom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
//             }
//           ],
//           "tokenIn": {
//             "denom": "ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228",
//             "amount": "4091500000"
//           },
//           "tokenOutMinAmount": "733197"
//         }
//       }
//     ],
//     "memo": ""
//   }

export const swapExactAmountIn = ({
  sender,
  routes,
  tokenIn,
  tokenOutMinAmount
}) => {
  const fee = {
    amount: coins(0, 'uosmo'),
    gas: '250000'
  };
  const msg = {
    type: 'osmosis/gamm/swap-exact-amount-in',
    value: {
      sender: sender,
      routes,
      tokenIn,
      tokenOutMinAmount
    }
  };
  return {
    fee,
    msgs: [msg]
  };
};
