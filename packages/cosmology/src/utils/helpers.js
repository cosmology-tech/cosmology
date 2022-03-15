import { prompt, promptMnemonic } from './prompt';
import { assets, chains } from '@cosmology/cosmos-registry';
import {
  getAccountFromMnemonic,
  getWalletFromMnemonic,
  getWalletFromMnemonicForChain
} from '../utils/wallet';

const assetList = assets.reduce(
  (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
  []
);

export const promptOsmoWallet = async (argv) => {
  argv = await promptMnemonic(argv);
  const { mnemonic } = argv;
  const account = await getWalletFromMnemonic({ mnemonic, token: 'OSMO' });
  return account;
};

export const promptCosmosChainWallet = async (chain, argv) => {
  argv = await promptMnemonic(argv);
  const { mnemonic } = argv;
  const account = await getWalletFromMnemonicForChain({ mnemonic, chain });
  return account;
};

export const promptWalletOfToken = async (argv) => {
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

export const promptAccountOfToken = async (argv) => {
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
  const account = await getAccountFromMnemonic({ mnemonic, token });
  return account;
};
