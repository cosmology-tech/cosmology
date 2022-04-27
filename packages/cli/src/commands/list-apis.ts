import { promptChain } from '../utils';

export default async (argv) => {
  const chain = await promptChain(argv);
  console.log(JSON.stringify(chain.apis, null, 2));
};
