import { baseUnitsToDollarValue } from '../utils/chain';
import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import {
  convertValidatorPricesToDenomPriceHash,
  osmoDenomToSymbol
} from '../utils/osmo';
import { OsmosisValidatorClient } from '../clients/validator';
import { Dec, IntPretty } from '@keplr-wallet/unit';

export default async (argv) => {
  const { client, wallet } = await osmoRestClient(argv);
  const [account] = await wallet.getAccounts();
  const validator = new OsmosisValidatorClient();

  try {
    const balances = await client.getBalances(account.address);

    const allTokens = await validator.getTokens();
    const prices = convertValidatorPricesToDenomPriceHash(allTokens);

    const display = balances.result.map(({ denom, amount }) => {
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
    });
    console.log(display);
  } catch (e) {
    console.log(e);
    console.log('error fetching balances');
  }
};
