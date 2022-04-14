import { prompt } from '../utils';
import { crypt, decrypt } from '../utils/crypt';

const questions = [
  {
    type: 'string',
    name: 'str',
    message: 'enter a string to encrypt',
    required: true
  },
  {
    type: 'password',
    name: 'encrypted_salt',
    message: 'enter the encrypted salt',
    required: true
  },
  {
    type: 'password',
    name: 'salt',
    message: 'enter the salt',
    required: true
  }
];

export default async (argv) => {
  const { encrypted_salt, salt, str } = await prompt(questions, argv);
  const encrypted_str = crypt(decrypt(salt, encrypted_salt), str);
  console.log(encrypted_str);
};
