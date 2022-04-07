export class OsmosisValidatorClient extends RestClient {
    constructor({ url }?: {
        url?: string;
    });
    getPools(): Promise<any>;
    /**
     * @returns {Promise<ValidatorToken[]>}
     */
    getTokens(): Promise<ValidatorToken[]>;
    /**
     * @param {CoinSymbol} symbol
     * @returns {Promise<ValidatorToken[]>}
     */
    getToken(symbol: CoinSymbol): Promise<ValidatorToken[]>;
    /**
     * @param {CoinSymbol} symbol
     * @returns {Promise<ValidatorTokenPrice[]>}
     */
    getTokenPrice(symbol: CoinSymbol): Promise<ValidatorTokenPrice[]>;
    /**
     * @returns {Promise<ValidatorPoolApr[]>}
     */
    getPoolAprs(): Promise<ValidatorPoolApr[]>;
    /**
     * @param {CoinSymbol} symbol
     * @returns {Promise<ValidatorPoolApr[]>}
     */
    getPoolApr(symbol: CoinSymbol): Promise<ValidatorPoolApr[]>;
    /**
     * @returns {Promise<ValidatorPair[]>}
     */
    getPairsSummary(): Promise<ValidatorPair[]>;
}
import { RestClient } from "./rest";
import { ValidatorToken } from "../types";
import { CoinSymbol } from "../types";
import { ValidatorTokenPrice } from "../types";
import { ValidatorPoolApr } from "../types";
import { ValidatorPair } from "../types";
