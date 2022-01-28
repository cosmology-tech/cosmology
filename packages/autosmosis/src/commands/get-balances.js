import { osmoRestClient } from '../utils';

export default async (argv) => {
  const { client, wallet } = await osmoRestClient(argv);
  const [account] = await wallet.getAccounts();

  try {
    const balances = await client.getBalances(account.address);
    console.log(balances);
  } catch (e) {
    console.log('error fetching balances');
  }
};
