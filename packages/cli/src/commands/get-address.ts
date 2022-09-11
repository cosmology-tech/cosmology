import { promptOsmoWallet } from '../utils';

export default async (argv) => {
    const signer = await promptOsmoWallet(argv);
    const [account] = await signer.getAccounts();
    console.log(account.address)
};
