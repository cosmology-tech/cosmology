import { prompt, promptMnemonic } from '../utils';
import { assets } from '../assets';
import { getPrices } from '../clients/coingecko';

export default async (argv) => {
  argv = await promptMnemonic(argv);

  const { token } = await prompt(
    [
      {
        type: 'fuzzy',
        name: 'token',
        message: 'token',
        choices: assets.map(({ symbol }) => symbol)
      }
    ],
    argv
  );

  const rec = assets.find(({ symbol }) => symbol === token);
  const geckoId = rec?.coingecko_id;
  if (!geckoId) {
    return console.log('cannot find coin');
  }
  const price = await getPrices([geckoId]);
  console.log(price[geckoId]);
};
