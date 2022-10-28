export const ibcChannels: {
    counterpartyChainId: string;
    sourceChannelId: string;
    destChannelId: string;
    coinMinimalDenom: string;
}[];
export const EmbedChainInfos: ({
    rpc: string;
    rest: string;
    chainId: string;
    chainName: string;
    stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    };
    bip44: {
        coinType: number;
    };
    bech32Config: any;
    currencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    }[];
    feeCurrencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    }[];
    features: string[];
    explorerUrlToTx: string;
    coinType?: undefined;
    gasPriceStep?: undefined;
} | {
    rpc: string;
    rest: string;
    chainId: string;
    chainName: string;
    stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    };
    bip44: {
        coinType: number;
    };
    bech32Config: any;
    currencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    }[];
    feeCurrencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    }[];
    coinType: number;
    features: string[];
    explorerUrlToTx: string;
    gasPriceStep?: undefined;
} | {
    rpc: string;
    rest: string;
    chainId: string;
    chainName: string;
    stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    };
    bip44: {
        coinType: number;
    };
    bech32Config: any;
    currencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    }[];
    feeCurrencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinGeckoId: string;
        coinImageUrl: string;
    }[];
    gasPriceStep: {
        low: number;
        average: number;
        high: number;
    };
    features: string[];
    explorerUrlToTx: string;
    coinType?: undefined;
} | {
    rpc: string;
    rest: string;
    chainId: string;
    chainName: string;
    stakeCurrency: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinImageUrl: string;
        coinGeckoId?: undefined;
    };
    bip44: {
        coinType: number;
    };
    bech32Config: any;
    currencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinImageUrl: string;
    }[];
    feeCurrencies: {
        coinDenom: string;
        coinMinimalDenom: string;
        coinDecimals: number;
        coinImageUrl: string;
    }[];
    features: string[];
    explorerUrlToTx: string;
    coinType?: undefined;
    gasPriceStep?: undefined;
})[];
