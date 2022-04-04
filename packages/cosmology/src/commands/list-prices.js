import { prompt } from '../utils';
import { assets } from '../assets';
import {
  getPrices,
  _getPricesFromCoinGecko,
  allGeckoAssets
} from '../clients/coingecko';

export default async (argv) => {
  const { all } = await prompt(
    [
      {
        type: 'confirm',
        name: 'all',
        message: 'list all?'
      }
    ],
    argv
  );

  if (all) argv.tokens = false;

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

  if (all) {
    const prices = await _getPricesFromCoinGecko();
    console.log(prices);
  } else {
    const geckoIds = assets
      .filter(({ symbol }) => tokens.includes(symbol))
      .map((a) => a.coingecko_id);
    if (!geckoIds.length) {
      return console.log('cannot find coins');
    }
    const prices = await getPrices(geckoIds);
    console.log(prices);
  }
};
