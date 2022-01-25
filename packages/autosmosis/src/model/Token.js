export class Token {
  /**
   *
   * @param {object} param0
   * @param {string} param0.symbol
   * @param {string} param0.osmosisID
   * @param {string} param0.geckoName
   */
  constructor({ symbol, osmosisID, geckoName }) {
    this.symbol = symbol;
    this.osmosisID = osmosisID;
    this.geckoName = geckoName;
  }

  /**
   *
   * @param {Token} otherToken
   * @returns {boolean}
   */
  isEqual = (otherToken) => {
    return this.osmosisID === otherToken.osmosisID;
  };
}
