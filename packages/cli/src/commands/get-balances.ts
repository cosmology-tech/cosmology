import {
  getPricesFromCoinGecko,
  osmoDenomToSymbol,
  baseUnitsToDisplayUnits,
  baseUnitsToDollarValue
} from '@cosmology/core';
import { promptChain, promptMnemonic, promptRpcEndpoint } from '../utils';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import { getOfflineSignerAmino } from 'cosmjs-utils';
import { osmosis } from 'osmojs';

export default async (argv) => {
  argv.chainToken = 'OSMO';

  argv = await promptMnemonic(argv);
  const { mnemonic } = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);

  const client = await osmosis.ClientFactory.createRPCQueryClient({ rpcEndpoint });
  const signer = await getOfflineSignerAmino({ mnemonic: argv.mnemonic, chain });
  const [account] = await signer.getAccounts();

  try {
    const balances = await client.cosmos.bank.v1beta1.allBalances({
      address: account.address
    })

    const prices = await getPricesFromCoinGecko();

    const display = balances.balances.map(({ denom, amount }) => {
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
