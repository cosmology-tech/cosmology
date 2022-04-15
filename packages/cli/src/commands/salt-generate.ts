import { randomBytes } from 'crypto';
import { prompt } from '../utils';

const questions = [
  {
    type: 'string',
    name: 'saltBytes',
    message: 'enter the salt num bytes (e.g. 16)',
    required: true
  }
];

export default async (argv) => {
  const { saltBytes } = await prompt(questions, argv);
  const buf = randomBytes(parseInt(saltBytes, 10));
  console.log(buf.toString('base64'));
};
