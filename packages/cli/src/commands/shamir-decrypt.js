import { prompt } from '../utils';
import { hexToUtf8 } from '../utils/crypt';
import * as secrets from 'secrets.js-grempe';

const questions = [
  {
    type: 'string',
    name: 'parts',
    message: 'enter the total number of parts that you have (e.g. 3)',
    required: true
  }
];

export default async (argv) => {
  const answer = await prompt(questions, argv);
  const parts = parseInt(answer.parts, 10);

  const partArray = [];
  for (let i = 0; i < parts; i++) {
    partArray.push({
      type: 'string',
      name: `shares[${i}]`,
      message: 'enter part[' + i + ']',
      required: true
    });
  }

  const { shares } = await prompt(partArray);
  const combined = secrets.combine(shares);
  console.log(hexToUtf8(combined));
};
