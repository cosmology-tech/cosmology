import { AccountData, Secp256k1HdWallet } from '@cosmjs/amino';
export declare const promptOsmoWallet: (argv: any) => Promise<Secp256k1HdWallet>;
export declare const promptCosmosChainWallet: (chain: any, argv: any) => Promise<Secp256k1HdWallet>;
export declare const promptWalletOfToken: (argv: any) => Promise<Secp256k1HdWallet>;
export declare const promptAccountOfToken: (argv: any) => Promise<AccountData>;
