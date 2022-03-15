import { Secp256k1HdWallet } from '@cosmjs/amino';
import { Slip10RawIndex } from '@cosmjs/crypto';

import { assets, chains } from '@cosmology/cosmos-registry';

export function makeHdPath(coinType = 118, account = 0) {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(coinType),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(account)
  ];
}

export const getWalletFromMnemonic = async ({ mnemonic, token }) => {
  const chainFromAssets = assets.find(({ assets }) => {
    const found = assets.find(({ symbol }) => symbol === token);
    if (found) return true;
  });
  const chain = chains.find(
    ({ chain_id }) => chain_id == chainFromAssets.chain_id
  );

  try {
    const { bech32_prefix, slip44 } = chain;
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: bech32_prefix,
      hdPaths: [makeHdPath(slip44, 0)]
    });
    return wallet;
  } catch (e) {
    console.log('bad mnemonic');
  }
};

export const getWalletFromMnemonicForChain = async ({ mnemonic, chain }) => {
  try {
    const { bech32_prefix, slip44 } = chain;
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: bech32_prefix,
      hdPaths: [makeHdPath(slip44, 0)]
    });
    return wallet;
  } catch (e) {
    console.log('bad mnemonic');
  }
};

export const getAccountFromMnemonic = async ({ mnemonic, token }) => {
  const wallet = await getWalletFromMnemonic({ mnemonic, token });
  const [mainAccount] = await wallet.getAccounts();
  return mainAccount;
};
