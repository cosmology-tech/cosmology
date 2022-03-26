import { prompt } from '../utils';
import { crypt } from '../utils/crypt';

const questions = [
  {
    type: 'string',
    name: 'secret',
    message: 'enter a secret to encrypt',
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
  const { salt, secret } = await prompt(questions, argv);
  console.log(crypt(salt, secret));
};
