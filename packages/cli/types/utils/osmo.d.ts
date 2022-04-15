import { OsmosisApiClient } from '@cosmology/core';
export declare const promptOsmoSigningClient: (argv: any) => Promise<{
    client: import("@cosmjs/stargate").SigningStargateClient;
    signer: any;
}>;
export declare const promptOsmoRestClient: (argv: any) => Promise<{
    client: OsmosisApiClient;
    signer: any;
}>;
export declare const osmoRestClientOnly: (argv: any) => Promise<OsmosisApiClient>;
