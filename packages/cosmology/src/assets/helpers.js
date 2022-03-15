// need to figure out typescript compatability
// import { Coin } from '../cosmology-types';
import assetList from './assetlist.json';

// /**
//  *
//  * @param {string} denom
//  * @returns {Coin}
//  */
export const getCoinFromDenom = (denom) => {
  for (const asset of assetList.assets) {
    if (asset.base === denom) {
      return asset;
    }
  }
  return null;
};
