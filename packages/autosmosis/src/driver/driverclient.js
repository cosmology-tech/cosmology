export class DriverClient {
    static getWalletBalances() {
      return { LUNA: 13, OSMO: 50, STARS: 2000 }
    }
  
    static swap(inputCoin, targetCoin, amount) {

    }
  
    static joinPool(poolId, amount) {

    }
  
    static lockTokens(poolId) {

    }
  
    static getPrices(coins) {
      // var prices = geckoPrice(coins)
      // return prices
      return { "LUNA": 59.9, "OSMO": 5.31, "STARS": 0.5321, "ATOM": 30.31 }
      // return {"medibloc":{"usd":0.0365264},"cosmos":{"usd":36.63},"terra-luna":{"usd":68.91},"crypto-com-chain":{"usd":0.366689},"akash-network":{"usd":1.81},"juno-network":{"usd":18.14},"terrausd":{"usd":1.02},"osmosis":{"usd":9.1},"comdex":{"usd":4.13},"persistence":{"usd":3.89},"secret":{"usd":5.3},"bitcanna":{"usd":0.131344},"e-money":{"usd":1.13},"cheqd-network":{"usd":0.108305},"regen":{"usd":1.4},"likecoin":{"usd":0.02503058},"terra-krw":{"usd":0.00084594},"ion":{"usd":12307.17},"sentinel":{"usd":0.01176001},"starname":{"usd":0.056813},"e-money-eur":{"usd":1.1},"vidulum":{"usd":0.278524},"iris-network":{"usd":0.069877}}
    }
}
