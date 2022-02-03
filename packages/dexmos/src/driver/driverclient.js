import { CoinGeckoToken, getPrices } from '../clients/coingecko'
import { assets } from '../assets'

export class DriverClient {
  static getWalletBalances () {
    return { LUNA: 13, OSMO: 50, STARS: 2000 }
  }

  static async swap (inputCoin, targetCoin, amount) {
    return null
  }

  static joinPool (poolId, amount) {}

  static lockTokens (poolId) {}

  /**
   *
   * @param {string} txHash
   * @returns {Promise<('success'|'failed'|'running'|'queued')>}
   */
  static async pollStatus (txHash) {
    return "success"
  }

  static async getPrices (coins) {
    const coinsInGeckoFormat = coins.map(coin => {
      const geckoAsset = assets.find(({ symbol }) => symbol === coin)
      return geckoAsset.coingecko_id
    })

    const pricesInGeckoFormat = await getPrices(coinsInGeckoFormat)

    var prices = {}
    Object.keys(pricesInGeckoFormat).map(geckoId => {
      const geckoAsset = assets.find(({ coingecko_id }) => coingecko_id === geckoId)
      prices[geckoAsset.symbol] = pricesInGeckoFormat[geckoId].usd
    })

    return prices
  }
}
