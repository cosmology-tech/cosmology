import { utf8ToHex } from '../utils/crypt';
import { prompt } from '../utils';
import * as secrets from 'secrets.js-grempe';

const questions = [
  {
    type: 'string',
    name: 'key',
    message: 'enter a string to encrypt',
    required: true
  },
  {
    type: 'string',
    name: 'parts',
    message: 'enter the total number of parts (e.g. 5)',
    required: true
  },
  {
    type: 'string',
    name: 'quorum',
    message: 'enter the number of parts required to decrypt (e.g. 3)',
    required: true
  }
];

export default async (argv) => {
  const answer = await prompt(questions, argv);
  const parts = parseInt(answer.parts, 10);
  const quorum = parseInt(answer.quorum, 10);
  const { key } = answer;

  const shares = secrets.share(utf8ToHex(key), parts, quorum);

  console.log(shares);

  shares.forEach((str) => {
    console.log(str);
  });
};
