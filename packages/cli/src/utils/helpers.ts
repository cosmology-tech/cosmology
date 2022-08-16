import { prompt, promptMnemonic } from './prompt';
import { assets, chains } from 'chain-registry';
import {
  getAccountFromMnemonic,
  getWalletFromMnemonic,
  getWalletFromMnemonicForChain
} from '@cosmology/core';
import { AccountData, Secp256k1HdWallet } from '@cosmjs/amino';

const assetList = assets.reduce(
  (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
  []
);

export const promptOsmoWallet = async (argv): Promise<Secp256k1HdWallet> => {
  argv = await promptMnemonic(argv);
  const { mnemonic } = argv;
  return await getWalletFromMnemonic({ mnemonic, token: 'OSMO' });
};

export const promptCosmosChainWallet = async (chain, argv): Promise<Secp256k1HdWallet> => {
  argv = await promptMnemonic(argv);
  const { mnemonic } = argv;
  return await getWalletFromMnemonicForChain({ mnemonic, chain });
};

export const promptWalletOfToken = async (argv): Promise<Secp256k1HdWallet> => {
  argv = await promptMnemonic(argv);

  const { token } = await prompt(
    [
      {
        type: 'fuzzy',
        name: 'token',
        message: 'token',
        choices: assetList
      }
    ],
    argv
  );
  argv.token = token;
  const { mnemonic } = argv;
  const account = await getWalletFromMnemonic({ mnemonic, token });
  return account;
};

export const promptAccountOfToken = async (argv): Promise<AccountData> => {
  argv = await promptMnemonic(argv);

  const { token } = await prompt(
    [
      {
        type: 'fuzzy',
        name: 'token',
        message: 'token',
        choices: assetList
      }
    ],
    argv
  );
  argv.token = token;
  const { mnemonic } = argv;
  return await getAccountFromMnemonic({ mnemonic, token });
};
