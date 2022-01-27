import { prompt, promptMnemonic } from '../utils';
import { assets } from '../assets';

export default async (argv) => {
  argv = await promptMnemonic(argv);

  const answers = await prompt(
    [
      {
        type: 'fuzzy',
        name: 'tokenIn',
        message: 'tokenIn',
        choices: assets.map(({ symbol }) => symbol)
      }
    ],
    argv
  );

  console.log(answers);
};
