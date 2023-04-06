import { AccountData, Secp256k1HdWallet } from '@cosmjs/amino';
import { Slip10RawIndex } from '@cosmjs/crypto';

import { assets, chains } from 'chain-registry';

export function makeHdPath(coinType = 118, account = 0) {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(coinType),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(account)
  ];
}

export const getWalletFromMnemonic = async ({ mnemonic, token }): Promise<Secp256k1HdWallet> => {
  const chainFromAssets = assets.find(({ assets }) => {
    const found = assets.find(({ symbol, type_asset }) => symbol === token && type_asset !== 'ics20');
    if (found) return true;
  });
  const chain = chains.find(
    ({ chain_name }) => chain_name == chainFromAssets.chain_name
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

export const getWalletFromMnemonicForChain = async ({ mnemonic, chain }): Promise<Secp256k1HdWallet> => {

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

export const getAccountFromMnemonic = async ({ mnemonic, token }): Promise<AccountData> => {
  const wallet = await getWalletFromMnemonic({ mnemonic, token });
  const [mainAccount] = await wallet.getAccounts();
  return mainAccount;
};
