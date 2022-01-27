import { Secp256k1HdWallet } from '@cosmjs/amino';
import { assets, chains } from '@pyramation/cosmos-registry';

export const getWalletFromMnemonic = async ({ mnemonic, token }) => {
  const chainFromAssets = assets.find(({ assets }) => {
    const found = assets.find(({ symbol }) => symbol === token);
    if (found) return true;
  });
  const chain = chains.find(
    ({ chain_id }) => chain_id == chainFromAssets.chain_id
  );

  try {
    const { bech32_prefix } = chain;
    // The BIP-32/SLIP-10 derivation paths. Defaults to the Cosmos Hub/ATOM path
    // const hdPaths = `m/44'/${coinType}'/${account}'/0/${index}`;
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: bech32_prefix
      // TODO use the `slip44` from chain
      // hdPaths: makeHdPath(coinType, index)
    });
    return wallet;
    // console.log('prefix', chain.bech32_prefix);
    // console.log('slip44', chain.slip44);
  } catch (e) {
    console.log('bad mnemonic');
  }
};

export const getAccountFromMnemonic = async ({ mnemonic, token }) => {
  const wallet = await getWalletFromMnemonic({ mnemonic, token });
  const [mainAccount] = await wallet.getAccounts();
  return mainAccount;
};
