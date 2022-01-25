import prices from '../__fixtures__/coingecko/api/v3/simple/price/data.json';
import { getSwapsForRebalance } from '../src/calculators/balancer';
import { Token } from '../src/model/Token';

describe('rebalance', () => {
  it('can rebalance', async () => {
    const token = new Token({
      symbol: 'ATOM',
      osmosisID: 'abcd',
      geckoName: 'osmosis'
    });
    const swaps = await getSwapsForRebalance({
      poolPair: [token, token],
      poolAlloc: [50, 50],
      assignedPoolPurchaseWeight: 0,
      rewardToken: token,
      currentBalance: 0,
      prices
    });

    expect(swaps).toMatchSnapshot();
  });
});
