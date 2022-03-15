import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import { osmoDenomToSymbol } from '../utils/osmo';

export default async (argv) => {
  const { client, wallet } = await osmoRestClient(argv);
  const [account] = await wallet.getAccounts();

  try {
    const balances = await client.getBalances(account.address);
    const display = balances.result.map(({ denom, amount }) => {
      const symbol = osmoDenomToSymbol(denom);
      const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
      return {
        symbol,
        denom,
        amount,
        displayAmount
      };
    });
    console.log(display);
  } catch (e) {
    console.log(e);
    console.log('error fetching balances');
  }
};
