import keychain from 'keychain';
import { filter } from 'fuzzy';
import { assets as osmosisAssets } from '../assets';
import { assets, chains } from '@cosmology/cosmos-registry';
import { prompt as inquirerer } from 'inquirerer';
import { getChain, getChainByChainId } from './chain';
import { crypt, decrypt } from './crypt';

const assetList = assets
  .reduce((m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)], [])
  .sort();

export const getFuzzySearch = (list) => {
  return (answers, input) => {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        const fuzzyResult = filter(input, list);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, 25);
    });
  };
};

export const getFuzzySearchNames = (nameValueItemList) => {
  const list = nameValueItemList.map(({ name, value }) => name);
  return (answers, input) => {
    input = input || '';
    return new Promise(function (resolve) {
      setTimeout(function () {
        const fuzzyResult = filter(input, list);
        resolve(
          fuzzyResult.map(function (el) {
            return nameValueItemList.find(
              ({ name, value }) => el.original == name
            );
          })
        );
      }, 25);
    });
  };
};

const coinSymbols = osmosisAssets.map(({ symbol }) => symbol).sort();
const allChains = chains.map((a) => a.chain_id);

const transform = (questions) => {
  return questions.map((q) => {
    if (q.type === 'fuzzy') {
      const choices = q.choices;
      delete q.choices;
      return {
        ...q,
        type: 'autocomplete',
        source: getFuzzySearch(choices)
      };
    } else if (q.type === 'fuzzy:token') {
      return {
        ...q,
        type: 'autocomplete',
        source: getFuzzySearch(coinSymbols)
      };
    } else if (q.type === 'fuzzy:objects') {
      const choices = q.choices;
      delete q.choices;
      return {
        ...q,
        type: 'autocomplete',
        source: getFuzzySearchNames(choices)
      };
    } else if (q.type === 'fuzzy:chain') {
      return {
        ...q,
        type: 'autocomplete',
        source: getFuzzySearch(allChains)
      };
    } else if (q.type === 'checkbox:token') {
      return {
        ...q,
        type: 'checkbox',
        choices: coinSymbols
      };
    } else {
      return q;
    }
  });
};

const cryptQuestions = [
  {
    type: 'password',
    name: 'encrypted_salt',
    message: 'enter the encrypted salt',
    required: true
  },
  {
    type: 'password',
    name: 'salt',
    message: 'enter the salt',
    required: true
  }
];

export const decryptPrompt = async (str, argv) => {
  const { encrypted_salt, salt } = await prompt(cryptQuestions, argv);
  const decrypted_str = decrypt(decrypt(salt, encrypted_salt), str);
  argv.encrypted_salt = encrypted_salt;
  argv.salt = salt;
  return decrypted_str;
};

export const encryptPrompt = async (str, argv) => {
  const { encrypted_salt, salt } = await prompt(cryptQuestions, argv);
  const encrypted_str = crypt(decrypt(salt, encrypted_salt), str);
  argv.encrypted_salt = encrypted_salt;
  argv.salt = salt;
  return encrypted_str;
};

export const decryptString = async (str, argv) => {
  return await decryptPrompt(str, argv);
};

export const encryptString = async (str, argv) => {
  return await encryptPrompt(str, argv);
};

export const getKeychainPassword = ({ account, service }) => {
  return new Promise((resolve, reject) => {
    keychain.getPassword({ account, service }, async (err, pass) => {
      if (err) return reject(err);
      resolve(pass);
    });
  });
};

export const prompt = async (questions = [], argv = {}) => {
  if (process.env.SALT) {
    argv.salt = process.env.SALT;
  }
  if (process.env.ENCRYPTED_SALT) {
    argv.encrypted_salt = process.env.ENCRYPTED_SALT;
  }
  questions = transform(questions);
  return await inquirerer(questions, argv);
};

export const promptMnemonic = async (argv = {}) => {
  if (argv.keychain) {
    const pass = await getKeychainPassword({
      account: 'cosmology',
      service: argv.keychain
    });
    if (!pass) {
      throw new Error(`cannot get ${argv.keychain}`);
    }
    const decrypted = await decryptString(pass, argv);
    argv.mnemonic = decrypted;
  } else if (process.env.SALT || process.env.ENCRYPTED_SALT || argv.encrypted) {
    if (process.env.MNEMONIC) {
      argv.mnemonic = await decryptPrompt(process.env.MNEMONIC, argv);
    }
  } else {
    if (process.env.MNEMONIC) {
      argv.mnemonic = process.env.MNEMONIC;
    }
  }

  return await prompt(
    [
      {
        type: 'password',
        name: 'mnemonic',
        message: 'mnemonic'
      }
    ],
    argv
  );
};

export const promptChain = async (argv) => {
  const { chainToken } = await prompt(
    [
      {
        type: 'fuzzy',
        name: 'chainToken',
        message: 'chainToken',
        choices: assetList
      }
    ],
    argv
  );
  argv.chainToken = chainToken;
  return await getChain({ token: chainToken });
};

export const promptChainIdAndChain = async (argv) => {
  const { chainId } = await prompt(
    [
      {
        type: 'fuzzy',
        name: 'chainId',
        message: 'chainId',
        choices: chains.map((c) => c.chain_id).sort()
      }
    ],
    argv
  );
  argv.chainId = chainId;
  return await getChainByChainId(chainId);
};

export const getPools = async (validator, argv) => {
  if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;
  const pools = await validator.getPools();
  return Object.keys(pools)
    .map((poolId) => {
      if (pools[poolId][0].liquidity > argv['liquidity-limit']) {
        return {
          name: pools[poolId].map((a) => a.symbol).join('/'),
          value: poolId
        };
      }
    })
    .filter(Boolean);
};
