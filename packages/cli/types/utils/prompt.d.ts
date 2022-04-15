export function getFuzzySearch(list: any): (answers: any, input: any) => Promise<any>;
export function getFuzzySearchNames(nameValueItemList: any): (answers: any, input: any) => Promise<any>;
export function decryptPrompt(str: any, argv: any): Promise<any>;
export function encryptPrompt(str: any, argv: any): Promise<any>;
export function decryptString(str: any, argv: any): Promise<any>;
export function encryptString(str: any, argv: any): Promise<any>;
export function getKeychainPassword({ account, service }: {
    account: any;
    service: any;
}): Promise<any>;
export function prompt(questions?: any[], argv?: {}): Promise<any>;
export function getKeychainAccount(): string;
export function promptMnemonic(argv?: {}): Promise<any>;
export function promptChain(argv: any): Promise<any>;
export function promptChainIdAndChain(argv: any): Promise<any>;
export function getPools(validator: any, argv: any): Promise<{
    name: any;
    value: string;
}[]>;
