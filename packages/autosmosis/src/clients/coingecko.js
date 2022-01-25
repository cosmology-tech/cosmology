import axios from 'axios';

const config = {
  fetchUrl:
    'https://api.coingecko.com/api/v3/simple/price?ids=cosmos,osmosis,ion,akash-network,sentinel,iris-network,crypto-com-chain,persistence,regen,starname,e-money,e-money-eur,juno-network,likecoin,terrausd,terra-luna,bitcanna,terra-krw,secret,medibloc,comdex,cheqd-network,vidulum&vs_currencies=usd'
};

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
 * 'cheqd-network'|
 * 'vidulum')} CoinGeckoToken
 *
 * @typedef {Object.<string, {usd: number}>} TokenPricesUSDResponse
 *
 */

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
  vidulum: 'vidulum'
};

/**
 *
 * @returns {Promise<TokenPricesUSDResponse>}
 */
export async function getPrice() {
  try {
    const response = await axios.get(config.fetchUrl);

    return response.data;
  } catch (e) {
    console.error(
      'CoinGecko API response error:',
      e.response ? e.response.data : e
    );
    return null;
  }
}
