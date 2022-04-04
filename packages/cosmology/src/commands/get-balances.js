import { baseUnitsToDollarValue } from '../utils/chain';
import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import { osmoDenomToSymbol } from '../utils/osmo';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import { getPricesFromCoinGecko } from '../clients/coingecko';

export default async (argv) => {
  const { client, wallet } = await osmoRestClient(argv);
  const [account] = await wallet.getAccounts();

  try {
    const balances = await client.getBalances(account.address);

    const prices = await getPricesFromCoinGecko();

    const display = balances.result.map(({ denom, amount }) => {
      try {
        const symbol = osmoDenomToSymbol(denom);
        const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
        const value = new IntPretty(
          new Dec(baseUnitsToDollarValue(prices, symbol, amount))
        )
          .maxDecimals(2)
          .toString();

        return {
          value: `$${value}`,
          symbol,
          denom,
          amount,
          displayAmount
        };
      } catch (e) {
        return {
          value: `unknown`,
          symbol: denom,
          denom,
          amount
        };
      }
    });
    console.log(display);
  } catch (e) {
    console.log(e);
    console.log('error fetching balances');
  }
};
