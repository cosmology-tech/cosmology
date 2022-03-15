import { prompt, promptChainIdAndChain } from '../prompt';
import { promptCosmosChainWallet } from '../helpers';
import { getSigningOsmosisClient } from '../../messages';
import { CosmosApiClient } from '../../clients/cosmos';

export const cosmosRpcClient = async (argv) => {
  const chain = await promptChainIdAndChain(argv);
  const wallet = await promptCosmosChainWallet(chain, argv);

  try {
    const rpc = chain.apis.rpc
      .map(({ address }) => address)
      .map((value) => {
        return {
          name: `${value} (mainnet)`,
          value
        };
      });
    if (process.env.CHAIN_ID) {
      argv.chainId = process.env.CHAIN_ID;
    }
    if (process.env.RPC_ENDPOINT) {
      argv.rpcEndpoint = process.env.RPC_ENDPOINT;
    }

    const questions = [
      {
        type: 'list',
        name: 'rpcEndpoint',
        message: 'rpcEndpoint',
        choices: [...rpc]
      }
    ];
    const { rpcEndpoint } = await prompt(questions, argv);

    const client = await getSigningOsmosisClient({
      rpcEndpoint: rpcEndpoint,
      signer: wallet
    });

    // argv.chainId = chainId;
    argv.rpcEndpoint = rpcEndpoint;

    return { client, wallet };
  } catch (e) {
    console.log('error ' + e);
  }
};

export const cosmosRestClient = async (argv) => {
  const chain = await promptChainIdAndChain(argv);
  const wallet = await promptCosmosChainWallet(chain, argv);

  try {
    const rest = chain.apis.rest
      .map(({ address }) => address)
      .map((value) => {
        return {
          name: `${value} (mainnet)`,
          value
        };
      });
    if (process.env.CHAIN_ID) {
      argv.chainId = process.env.CHAIN_ID;
    }
    if (process.env.REST_ENDPOINT) {
      argv.restEndpoint = process.env.REST_ENDPOINT;
    }

    const questions = [
      {
        type: 'list',
        name: 'restEndpoint',
        message: 'restEndpoint',
        choices: [...rest]
      }
    ];
    const { restEndpoint } = await prompt(questions, argv);

    const client = new CosmosApiClient({
      url: restEndpoint
    });

    // argv.chainId = chainId;
    argv.restEndpoint = restEndpoint;

    return { client, wallet };
  } catch (e) {
    console.log('error ' + e);
  }
};
