// @ts-nocheck
import { aminos } from '../src/messages/aminos';
import { meta as metaInfo } from '../src/messages/meta';

it('aminos', async () => {
  const additions = Object.keys(aminos).reduce((m, key) => {
    const meta = metaInfo[key];
    const { toAmino, fromAmino } = aminos[key];
    m[meta.amino] = {
      aminoType: meta.type,
      toAmino,
      fromAmino
    };
    return m;
  }, {});
  expect(additions).toMatchSnapshot();
});
it('lockTokens.fromAmino', async () => {
  const fromAmino = aminos.lockTokens.fromAmino({
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
  const toAmino = aminos.lockTokens.toAmino({
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

it('lockTokens multiple aminos', async () => {
  const toAmino = aminos.lockTokens.toAmino({
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
  const fromAmino = aminos.lockTokens.fromAmino(toAmino);
  expect(fromAmino).toMatchSnapshot();
});
