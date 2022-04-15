import { Secp256k1HdWallet } from '@cosmjs/amino';
import { prompt, encryptPrompt } from '../utils';

export default async (argv) => {
  const { length, encrypt } = await prompt(
    [
      {
        _: true,
        type: 'number',
        name: 'length',
        message: 'length',
        default: 12
      },
      { type: 'confirm', name: 'encrypt', message: 'encrypt' }
    ],
    argv
  );

  let fn = async (str, argv) => {
    return str;
  };
  if (encrypt) fn = encryptPrompt;

  const wallet = await Secp256k1HdWallet.generate(length);
  let mnemonic = wallet.secret.data;
  mnemonic = await fn(mnemonic, argv);
  console.log(mnemonic);
};
