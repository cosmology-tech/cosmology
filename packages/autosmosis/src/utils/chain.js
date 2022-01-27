import { assets, chains } from '@pyramation/cosmos-registry';
import { prompt } from './prompt';

const assetList = assets.reduce(
  (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
  []
);

export const getChain = async ({ token }) => {
  const chainFromAssets = assets.find(({ assets }) => {
    const found = assets.find(({ symbol }) => symbol === token);
    if (found) return true;
  });
  const chain = chains.find(
    ({ chain_id }) => chain_id == chainFromAssets.chain_id
  );
  return chain;
};

export const promptChain = async (argv) => {
  const { token } = await prompt(
    [
      {
        type: 'fuzzy',
        name: 'token',
        message: 'token',
        choices: assetList
      }
    ],
    argv
  );
  argv.token = token;
  return await getChain({ token });
};
