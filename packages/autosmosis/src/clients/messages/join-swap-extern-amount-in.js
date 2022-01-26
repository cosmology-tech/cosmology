import { coins } from '@cosmjs/launchpad';

// {
//     "chain_id": "osmosis-1",
//     "account_number": "172682",
//     "sequence": "50",
//     "fee": {
//       "gas": "140000",
//       "amount": [
//         {
//           "denom": "uosmo",
//           "amount": "0"
//         }
//       ]
//     },
//     "msgs": [
//       {
//         "type": "osmosis/gamm/join-swap-extern-amount-in",
//         "value": {
//           "sender": "osmo1g555venwsrmwnemfhcwe5j5wnd9er32nmvfhpd",
//           "poolId": "560",
//           "tokenIn": {
//             "denom": "ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC",
//             "amount": "82788355"
//           },
//           "shareOutMinAmount": "1179420360346868359"
//         }
//       }
//     ],
//     "memo": ""
//   }

export const joinSwapExternAmountIn = ({
  osmosisAddress,
  poolId,
  tokenIn,
  shareOutMinAmount
}) => {
  const fee = {
    amount: coins(0, 'uosmo'),
    gas: '140000'
  };
  /** @type {MsgDelegate} */
  const msg = {
    type: 'osmosis/gamm/join-swap-extern-amount-in',
    value: {
      sender: osmosisAddress,
      poolId,
      tokenIn,
      shareOutMinAmount
    }
  };
  return {
    fee,
    msgs: [msg]
  };
};
