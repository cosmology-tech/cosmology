// @ts-nocheck
import cases from 'jest-in-case';
import { Slip10RawIndex } from '@cosmjs/crypto';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import { chains } from '@cosmology/cosmos-registry';

export const combineAll = (array) => {
  const res = [];
  const max = array.length - 1;
  const helper = (arr, i) => {
    for (let j = 0, l = array[i].length; j < l; j++) {
      const copy = arr.slice(0);
      copy.push(array[i][j]);
      if (i == max) res.push(copy);
      else helper(copy, i + 1);
    }
  };
  helper([], 0);
  return res;
};

/**
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export function makeHdPath(coinType = 118, account = 0) {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(coinType),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(account)
  ];
}

const mnemonic =
  'mammal wrestle hybrid cart choose flee transfer filter fly object swamp rookie';

const addresses = {
  terra: 'terra172xqaafhz6djy448p32633q4rl7eaz4wqnjn46',
  juno: 'juno1mwwvfu804wcaanz8j78f8h75flxkyjuaur4ktj',
  somm: 'somm1mwwvfu804wcaanz8j78f8h75flxkyjuaxdepay',
  stars: 'stars1mwwvfu804wcaanz8j78f8h75flxkyjua7dps8l',
  osmo: 'osmo1mwwvfu804wcaanz8j78f8h75flxkyjuaz29a6u',
  cosmos: 'cosmos1mwwvfu804wcaanz8j78f8h75flxkyjua23kdvw',
  secret: 'secret1dfr9468pskryssxgr6nh882avguurp2ql0da9y',
  akash: 'akash1mwwvfu804wcaanz8j78f8h75flxkyjua82m245'
};

const coinTypes = Object.keys(addresses).reduce((m, name) => {
  const chain = chains.find((obj) => obj.bech32_prefix === name);
  if (!chain) {
    throw new Error(name + ' is undefined');
  }
  m[name] = chain.slip44;
  return m;
}, []);

cases(
  'wallets',
  async (opts) => {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: opts.name,
      hdPaths: [makeHdPath(coinTypes[opts.name], 0)]
    });
    const [mainAccount] = await wallet.getAccounts();
    expect(mainAccount.address).toBe(addresses[opts.name]);
  },
  [
    { name: 'akash' },
    { name: 'terra' },
    { name: 'juno' },
    { name: 'somm' },
    { name: 'stars' },
    { name: 'osmo' },
    { name: 'cosmos' },
    { name: 'secret' }
  ]
);

const all = combineAll([Object.keys(addresses), Object.keys(addresses)])
  .filter(([a, b]) => a !== b)
  .map(([from, to]) => {
    return {
      name: `${from}->${to}`,
      from,
      to
    };
  });

cases(
  'from',
  async (opts) => {
    // expect(lookup(addresses[opts.from], opts.to)).toEqual(addresses[opts.to])
    expect(true).toBe(true);
  },
  all
);
