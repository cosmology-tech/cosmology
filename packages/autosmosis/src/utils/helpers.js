import { prompt, promptMnemonic } from './prompt';
import { assets, chains } from '@pyramation/cosmos-registry';
import { getAccountFromMnemonic, getWalletFromMnemonic } from '../utils/wallet';
const assetList = assets.reduce(
  (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
  []
);

export const promptOsmoWallet = async (argv) => {
  argv = await promptMnemonic(argv);
  const { mnemonic } = argv;
  const account = await getWalletFromMnemonic({ mnemonic, token: 'OSMO' });
  console.log('WARNING: LUNA and some wallets are NOT correct (TODO hdPath)');
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
  console.log('WARNING: LUNA and some wallets are NOT correct (TODO hdPath)');
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
  console.log('WARNING: LUNA and some wallets are NOT correct (TODO hdPath)');
  return account;
};
