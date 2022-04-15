import keychain from 'keychain';
import { prompt, getKeychainAccount } from '../utils';
const account = getKeychainAccount();
export default async (argv) => {
  const { name } = await prompt(
    [
      {
        type: 'string',
        name: 'name',
        message: 'name'
      }
    ],
    argv
  );
  await keychain.deletePassword({ account, service: name });
};
