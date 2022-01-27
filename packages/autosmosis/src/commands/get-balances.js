import { prompt, promptOsmoWallet, promptWalletOfToken } from '../utils';
import { promptChain, promptMnemonic } from '../utils';

import { OsmosisApiClient } from '../clients/osmosis';
export default async (argv) => {
  argv.token = 'OSMO';
  const osmosTestnetRests = ['http://143.244.147.126:1317'];

  const chain = await promptChain(argv);
  const wallet = await promptOsmoWallet(argv);
  const [account] = await wallet.getAccounts();

  try {
    const rest = chain.apis.rest.map(({ address }) => address);
    const questions = [
      {
        type: 'list',
        name: 'restUrl',
        message: 'restUrl',
        choices: [...rest, ...osmosTestnetRests]
      }
    ];
    const { restUrl } = await prompt(questions, argv);
    if (osmosTestnetRests.includes(restUrl)) {
      console.log('WARN: using TESTNET');
    }
    // 'https://lcd-osmosis.keplr.app/'
    const client = new OsmosisApiClient({
      url: restUrl
    });
    const balances = await client.getBalances(account.address);
    console.log(balances);
  } catch (e) {
    console.log('error fetching balances');
  }
};
