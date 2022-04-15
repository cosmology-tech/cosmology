import { osmosis } from '../../src/proto/generated/codecimpl';

it('fromObject', () => {
  const msg = osmosis.lockup.MsgLockTokens.fromObject({
    owner: 'osmo1RedactedAddress',
    duration: {
      seconds: '1209600',
      nanos: 0
    },
    coins: [
      {
        amount: '10236850525923652977',
        denom: 'gamm/pool/3'
      }
    ]
  });
  console.log(JSON.stringify(msg, null, 2));
  expect(msg).toMatchSnapshot();
});
it('fromObject', () => {
  const msg = osmosis.lockup.MsgLockTokens.fromObject({
    owner: 'osmo1RedactedAddress',
    duration: {
      seconds: '1209600',
      nanos: 0
    },
    coins: [
      {
        amount: '10236850525923652977',
        denom: 'gamm/pool/3'
      }
    ]
  });
  console.log(JSON.stringify(msg, null, 2));
});

// it('fromPartial', () => {
//   const msg = osmosis.lockup.MsgLockTokens
//     owner: 'osmo1RedactedAddress',
//     duration: '1209600',
//     coins: [
//       {
//         amount: '10236850525923652977',
//         denom: 'gamm/pool/3'
//       }
//     ]
//   });
//   console.log(JSON.stringify(msg, null, 2));
// });
