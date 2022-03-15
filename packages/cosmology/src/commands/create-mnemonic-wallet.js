import { Secp256k1HdWallet } from '@cosmjs/amino';
import { prompt } from '../utils';

export default async (argv) => {
  const { length } = await prompt(
    [
      {
        _: true,
        type: 'number',
        name: 'length',
        message: 'length',
        default: 12
      }
    ],
    argv
  );

  const wallet = await Secp256k1HdWallet.generate(length);
  console.log(wallet.secret.data);
};
