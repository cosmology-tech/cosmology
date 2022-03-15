export interface DenomUnits {
  denom: string
  exponent: number
  aliases?: string[]
}

export interface Coin {
  description?: string
  denom_units: DenomUnits[]
  base: string // this is the denom
  name: string
  display: string
  symbol: string
  logo_URIs: {
    png: string
    svg?: string
  }
  coingecko_id?: string
}
