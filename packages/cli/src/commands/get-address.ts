import { promptWalletOfToken } from '../utils';

export default async (argv) => {
    const signer = await promptWalletOfToken(argv);
    const [account] = await signer.getAccounts();
    console.log(account.address)
};
