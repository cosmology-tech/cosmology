import {
  getWalletFromMnemonic,
  baseUnitsToDisplayUnitsByDenom,
  getCosmosAssetInfo
} from '@cosmology/core';
import { promptChain, promptMnemonic, promptRestEndpoint } from '../utils';
import { cosmos } from 'osmojs';
export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);

  const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);

  const client = await cosmos.ClientFactory.createLCDClient({ restEndpoint });

  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken
  ).base;
  if (!denom) throw new Error('cannot find asset base unit');

  const signer = await getWalletFromMnemonic({
    mnemonic: argv.mnemonic,
    token: argv.chainToken
  });

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const balances = await client.cosmos.bank.v1beta1.allBalances({
    address
  })
  if (!balances || !balances.balances || !balances.balances.length) {
    console.log('no balance!');
    return;
  }

  const bal = balances.balances.find((el) => el.denom === denom);
  const readableBalance = baseUnitsToDisplayUnitsByDenom(bal.denom, bal.amount);
  console.log({ [argv.chainToken]: readableBalance });

  console.log(JSON.stringify(balances.balances, null, 2));
};
