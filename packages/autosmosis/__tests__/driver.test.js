import prices from '../__fixtures__/coingecko/api/v3/simple/price/data.json'
import { getAllSwaps } from '../src/driver/driver'
import { Token } from '../src/model/Token'

describe('testGetAllSwaps', () => {
  it('can calculate all necessary swaps', async () => {
    const swaps = await getAllSwaps([
      { "type": "coin", "coin": "UST", "weight": 0.3 },
      { "type": "pool", "pool": { "coin1": "LUNA", "coin2": "UST", "id": 562, "balance": 0.5 }, "weight": 0.3 },
      { "type": "pool", "pool": { "coin1": "ATOM", "coin2": "STARS", "id": 611, "balance": 0.7 }, "weight": 0.4 }
    ])

    expect(swaps).length === 6

    expect(swaps[0].inputCoin === "OSMO")
    expect(swaps[0].targetCoin === "UST")
    expect(swaps[0].amount > 0)

    expect(swaps[5].inputCoin === "OSMO")
    expect(swaps[5].targetCoin === "UST")
    expect(swaps[5].amount > 0)
    // .toEqual([
    //   { "inputCoin": "LUNA", "targetCoin": "UST", "amount": 13 },
    //   { "inputCoin": "OSMO", "targetCoin": "UST", "amount": 50 },
    //   { "inputCoin": "STARS", "targetCoin": "UST", "amount": 2000 },
    //   { "inputCoin": "UST", "targetCoin": "LUNA", "amount": 316.25 },
    //   { "inputCoin": "UST", "targetCoin": "ATOM", "amount": 590.35 },
    //   { "inputCoin": "UST", "targetCoin": "STARS", "amount": 7.73 },
    // ])
  })
})
