import { prompt } from '../utils';
import { decrypt } from '../utils/crypt';

const questions = [
  {
    type: 'string',
    name: 'str',
    message: 'enter a string to decrypt',
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
  const { salt, str } = await prompt(questions, argv);
  console.log(decrypt(salt, str));
};
