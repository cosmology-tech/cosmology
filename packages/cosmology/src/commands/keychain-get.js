import { decryptString, getKeychainPassword, prompt } from '../utils';
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

  const pass = await getKeychainPassword({ account, service: name });
  if (!pass) {
    throw new Error(`cannot get ${name}`);
  }
  const decrypted = await decryptString(pass, argv);
  console.log(decrypted);
};
