import { coins } from '@cosmjs/launchpad';

// {
//     "chain_id": "osmosis-1",
//     "account_number": "94919",
//     "sequence": "1642",
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
//         "type": "osmosis/lockup/lock-tokens",
//         "value": {
//           "owner": "osmo1-REDACTED",
//           "duration": "1209600000000000",
//           "coins": [
//             {
//               "amount": "1942022303966623524281",
//               "denom": "gamm/pool/606"
//             }
//           ]
//         }
//       }
//     ],
//     "memo": ""
//   }

export const lockTokens = ({ osmosisAddress, duration, coins }) => {
  const fee = {
    amount: coins(0, 'uosmo'),
    gas: '250000'
  };
  /** @type {MsgDelegate} */
  const msg = {
    type: 'osmosis/lockup/lock-tokens',
    value: {
      owner: osmosisAddress,
      duration,
      coins
    }
  };
  return {
    fee,
    msgs: [msg]
  };
};
