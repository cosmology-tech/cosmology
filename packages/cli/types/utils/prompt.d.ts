export declare const getFuzzySearch: (list: any) => (answers: any, input: any) => Promise<unknown>;
export declare const getFuzzySearchNames: (nameValueItemList: any) => (answers: any, input: any) => Promise<unknown>;
export declare const decryptPrompt: (str: any, argv: any) => Promise<any>;
export declare const encryptPrompt: (str: any, argv: any) => Promise<any>;
export declare const decryptString: (str: any, argv: any) => Promise<any>;
export declare const encryptString: (str: any, argv: any) => Promise<any>;
export declare const getKeychainPassword: ({ account, service }: {
    account: any;
    service: any;
}) => Promise<unknown>;
export declare const prompt: (questions?: any[], argv?: {}) => Promise<any>;
export declare const getKeychainAccount: () => string;
export declare const promptMnemonic: (argv?: {}) => Promise<any>;
export declare const promptRpcEndpoint: (choices: string[], argv: any) => Promise<any>;
export declare const promptRestEndpoint: (choices: string[], argv: any) => Promise<any>;
export declare const promptChain: (argv: any) => Promise<any>;
export declare const promptChainIdAndChain: (argv: any) => Promise<any>;
export declare const getPools: (validator: any, argv: any) => Promise<{
    name: any;
    value: string;
}[]>;
