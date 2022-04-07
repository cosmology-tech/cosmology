import { OsmosisApiClient } from '../../clients/osmosis';
export declare const promptOsmoSigningClient: (argv: any) => Promise<{
    client: any;
    signer: import("@cosmjs/amino").Secp256k1HdWallet;
}>;
export declare const promptOsmoRestClient: (argv: any) => Promise<{
    client: OsmosisApiClient;
    signer: import("@cosmjs/amino").Secp256k1HdWallet;
}>;
export declare const osmoRestClientOnly: (argv: any) => Promise<OsmosisApiClient>;
