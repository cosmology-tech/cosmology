import { promptChain, promptMnemonic } from '../utils/prompt';

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);
  console.log(JSON.stringify(chain.apis, null, 2));
};
