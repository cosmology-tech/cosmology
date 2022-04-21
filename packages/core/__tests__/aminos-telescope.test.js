// @ts-nocheck
import { osmosis } from '@osmonauts/osmosis';

it('aminos', async () => {
  const additions = {
    ...osmosis.gamm.v1beta1.AminoConverter,
    ...osmosis.lockup.AminoConverter,
    ...osmosis.superfluid.AminoConverter
  };
  expect(additions).toMatchSnapshot();
});

it('lockTokens.fromAmino', async () => {
  const fromAmino = osmosis.lockup.AminoConverter[
    '/osmosis.lockup.MsgLockTokens'
  ].fromAmino({
    owner: 'osmo1addresshere',
    coins: [
      {
        denom: 'mydenom',
        amount: '1000'
      }
    ],
    duration: {
      seconds: '100',
      nanos: 0
    }
  });
  expect(fromAmino).toMatchSnapshot();
});
it('lockTokens.toAmino', async () => {
  const toAmino = osmosis.lockup.AminoConverter[
    '/osmosis.lockup.MsgLockTokens'
  ].toAmino({
    owner: 'osmo1addresshere',
    coins: [
      {
        denom: 'mydenom',
        amount: '1000'
      }
    ],
    duration: {
      seconds: '100',
      nanos: 0
    }
  });
  expect(toAmino).toMatchSnapshot();
});
