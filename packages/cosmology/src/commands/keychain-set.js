import keychain from 'keychain';
import { encryptString, prompt } from '../utils';
const account = 'cosmology';
export default async (argv) => {
  const { name, password } = await prompt(
    [
      {
        type: 'string',
        name: 'name',
        message: 'name'
      },
      {
        type: 'password',
        name: 'password',
        message: 'password'
      }
    ],
    argv
  );

  const encrypted = await encryptString(password, argv);
  if (argv.encrypted) {
    await keychain.setPassword({ account, service: name, password });
  } else {
    await keychain.setPassword({ account, service: name, password: encrypted });
  }
  console.log('Password set');
};
