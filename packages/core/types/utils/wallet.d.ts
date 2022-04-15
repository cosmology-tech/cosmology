import { AccountData, Secp256k1HdWallet } from '@cosmjs/amino';
import { Slip10RawIndex } from '@cosmjs/crypto';
export declare function makeHdPath(coinType?: number, account?: number): Slip10RawIndex[];
export declare const getWalletFromMnemonic: ({ mnemonic, token }: {
    mnemonic: any;
    token: any;
}) => Promise<Secp256k1HdWallet>;
export declare const getWalletFromMnemonicForChain: ({ mnemonic, chain }: {
    mnemonic: any;
    chain: any;
}) => Promise<Secp256k1HdWallet>;
export declare const getAccountFromMnemonic: ({ mnemonic, token }: {
    mnemonic: any;
    token: any;
}) => Promise<AccountData>;
