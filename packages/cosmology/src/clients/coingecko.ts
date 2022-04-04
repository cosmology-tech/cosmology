import axios from 'axios';
import { assets } from '../assets';
import { PriceHash } from '../types';
import { convertGeckoPricesToDenomPriceHash } from '../utils/osmo/utils';

/**
 * @typedef {('cosmos'|
 * 'osmosis'|
 * 'ion'|
 * 'akash-network'|
 * 'sentinel'|
 * 'iris-network'|
 * 'crypto-com-chain'|
 * 'persistence'|
 * 'regen'|
 * 'starname'|
 * 'e-money'|
 * 'e-money-eur'|
 * 'juno-network'|
 * 'likecoin'|
 * 'terrausd'|
 * 'terra-luna'|
 * 'bitcanna'|
 * 'terra-krw'|
 * 'secret'|
 * 'medibloc'|
 * 'comdex'|
 * 'stargaze'|
 * 'chihuahua-token'|
 * 'cheqd-network'|
 * 'vidulum')} CoinGeckoToken
 *
 * @typedef {Object.<CoinGeckoToken, {usd: number}>} TokenPricesUSDResponse
 *
 */

//  https://api.coingecko.com/api/v3/simple/price?ids=osmosis,ion,cosmos,terra-luna,crypto-com-chain,terrausd,secret,juno-network,persistence,terra-krw,akash-network,regen,sentinel,iris-network,starname,e-money,e-money-eur,likecoin,bitcanna,medibloc,comdex,cheqd-network,vidulum,stargaze,chihuahua-token&vs_currencies=usd

export const CoinGeckoToken = {
  // Enum
  cosmos: 'cosmos',
  osmosis: 'osmosis',
  ion: 'ion',
  'akash-network': 'akash-network',
  sentinel: 'sentinel',
  'iris-network': 'iris-network',
  'crypto-com-chain': 'crypto-com-chain',
  persistence: 'persistence',
  regen: 'regen',
  starname: 'starname',
  'e-money': 'e-money',
  'e-money-eur': 'e-money-eur',
  'juno-network': 'juno-network',
  likecoin: 'likecoin',
  terrausd: 'terrausd',
  'terra-luna': 'terra-luna',
  bitcanna: 'bitcanna',
  'terra-krw': 'terra-krw',
  secret: 'secret',
  medibloc: 'medibloc',
  comdex: 'comdex',
  'cheqd-network': 'cheqd-network',
  vidulum: 'vidulum',
  stargaze: 'stargaze',
  'chihuahua-token': 'chihuahua-token'
};

/**
 * @param {*} coins is a list of coins to check
 */

export const getPrices = async (coins = ['osmosis']) => {
  //'https://api.coingecko.com/api/v3/simple/price?ids=cosmos,osmosis,ion,akash-network,sentinel,iris-network,crypto-com-chain,persistence,regen,starname,e-money,e-money-eur,juno-network,likecoin,terrausd,terra-luna,bitcanna,terra-krw,secret,medibloc,comdex,cheqd-network,vidulum&vs_currencies=usd'
  const fetchUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join()}&vs_currencies=usd`;
  try {
    const response = await axios.get(fetchUrl);

    return response.data;
  } catch (e) {
    console.error(
      'CoinGecko API response error:',
      e.response ? e.response.data : e
    );
    return null;
  }
};

export const allGeckoAssets = () => {
  return assets
    .filter((asset) => !!asset.coingecko_id);
};

export const _getPricesFromCoinGecko = async () => {
  const geckoAssets = allGeckoAssets();
  const geckoIds = geckoAssets
    .map(asset => asset.coingecko_id);
  const prices = await getPrices(geckoIds);
  return prices;
};

export const getPricesFromCoinGecko = async (): Promise<PriceHash> => {
  const prices = await _getPricesFromCoinGecko();
  return convertGeckoPricesToDenomPriceHash(prices);
};
