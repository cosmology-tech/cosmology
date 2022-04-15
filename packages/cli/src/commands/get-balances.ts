import {
  getPricesFromCoinGecko,
  osmoDenomToSymbol,
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue
} from '@cosmology/core';
import { promptOsmoRestClient } from '../utils';
import { Dec, IntPretty } from '@keplr-wallet/unit';

export default async (argv) => {
  const { client, signer } = await promptOsmoRestClient(argv);
  const [account] = await signer.getAccounts();

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
