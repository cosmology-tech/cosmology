import { RestClient } from './rest';
import { ValidatorToken, CoinSymbol, ValidatorPoolApr, ValidatorPair, ValidatorTokenPrice } from '../types';
export declare class OsmosisValidatorClient extends RestClient {
    constructor({ url }?: {
        url?: string;
    });
    getPools(): Promise<unknown>;
    getTokens(): Promise<ValidatorToken[]>;
    getToken(symbol: CoinSymbol): Promise<ValidatorToken[]>;
    getTokenPrice(symbol: CoinSymbol): Promise<ValidatorTokenPrice[]>;
    getPoolAprs(): Promise<ValidatorPoolApr[]>;
    getPoolApr(symbol: CoinSymbol): Promise<ValidatorPoolApr[]>;
    getPairsSummary(): Promise<ValidatorPair[]>;
}
