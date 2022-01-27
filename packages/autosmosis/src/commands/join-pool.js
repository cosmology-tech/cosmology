import { prompt, promptMnemonic } from '../utils';
import { assets } from '../assets';

export default async (argv) => {
  argv = await promptMnemonic(argv);

  const answers = await prompt(
    [
      {
        type: 'text',
        name: 'poolId',
        message: 'poolId'
      },
      {
        type: 'fuzzy',
        name: 'tokenIn',
        message: 'tokenIn',
        choices: assets.map(({ symbol }) => symbol)
      },
      {
        type: 'text',
        name: 'shareOutAmount',
        message: 'shareOutAmount'
      },
      // TODO later do this as a separate prompt,
      // depending on the pool
      {
        type: 'text',
        name: 'tokenInMaxs[0]',
        message: 'tokenInMaxs[0]'
      },
      {
        type: 'text',
        name: 'tokenInMaxs[1]',
        message: 'tokenInMaxs[1]'
      }
    ],
    argv
  );

  console.log(answers);
};
