import { prompt, promptMnemonic } from '../utils';
import { Secp256k1HdWallet } from '@cosmjs/amino';
import { assets, chains } from '@pyramation/cosmos-registry';
import { getAccountFromMnemonic } from '../utils/wallet';
const assetList = assets.reduce(
  (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
  []
);

export default async (argv) => {
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
  const { mnemonic } = argv;
  const account = await getAccountFromMnemonic({ mnemonic, token });
  console.log(account.address);
};
