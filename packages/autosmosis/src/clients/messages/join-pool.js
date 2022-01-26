import { coins } from '@cosmjs/launchpad';

// {
//   "chain_id": "osmosis-1",
//   "account_number": "94919",
//   "sequence": "1641",
//   "fee": {
//     "gas": "140000",
//     "amount": [
//       {
//         "denom": "uosmo",
//         "amount": "0"
//       }
//     ]
//   },
//   "msgs": [
//     {
//       "type": "osmosis/gamm/join-pool",
//       "value": {
//         "sender": "osmo1-REDACTED",
//         "poolId": "606",
//         "shareOutAmount": "1942022303966623524281",
//         "tokenInMaxs": [
//           {
//             "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
//             "amount": "512529"
//           },
//           {
//             "denom": "ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228",
//             "amount": "2822669590"
//           }
//         ]
//       }
//     }
//   ],
//   "memo": ""
// }

export const joinPool = ({
  osmosisAddress,
  poolId,
  shareOutAmount,
  tokenInMaxs
}) => {
  const fee = {
    amount: coins(0, 'uosmo'),
    gas: '140000'
  };
  /** @type {MsgDelegate} */
  const msg = {
    type: 'osmosis/gamm/join-pool',
    value: {
      sender: osmosisAddress,
      poolId,
      shareOutAmount,
      tokenInMaxs
    }
  };
  return {
    fee,
    msgs: [msg]
  };
};
