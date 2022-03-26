import keychain from 'keychain';
import { prompt } from '../utils';
const account = 'cosmology';
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
