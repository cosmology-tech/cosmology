import { prompt, promptMnemonic } from '../utils';
import { assets } from '../assets';
import { getPrices } from '../clients/coingecko';

export default async (argv) => {
  argv = await promptMnemonic(argv);

  const { tokens } = await prompt(
    [
      {
        type: 'checkbox:token',
        name: 'tokens',
        message: 'tokens'
      }
    ],
    argv
  );

  const geckoIds = assets
    .filter(({ symbol }) => tokens.includes(symbol))
    .map((a) => a.coingecko_id);
  if (!geckoIds.length) {
    return console.log('cannot find coins');
  }
  const prices = await getPrices(geckoIds);
  console.log(prices);
};
