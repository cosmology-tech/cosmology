export declare const getCosmosAssetInfo: (symbol: any) => import("@chain-registry/types").AssetList;
export declare const getOsmosisAssetInfo: (symbol: any) => any;
export declare const getCosmosAssetInfoByDenom: (denom: any) => import("@chain-registry/types").AssetList;
export declare const getOsmosisAssetInfoByDenom: (denom: any) => any;
export declare const getOsmosisAssetIbcInfo: (symbol: any) => any;
export declare const getOsmosisAssetDenom: (symbol: any) => any;
export declare const getNameOfChain: (chain_id: any) => string;
export declare const getChainByChainId: (chain_id: any) => import("@chain-registry/types").Chain;
export declare const getBaseAndDisplayUnitsGenericCosmos: (symbol: any) => {
    base: import("@chain-registry/types").AssetDenomUnit;
    display: import("@chain-registry/types").AssetDenomUnit;
};
export declare const getBaseAndDisplayUnits: (symbol: any) => {
    base: any;
    display: any;
};
export declare const getBaseAndDisplayUnitsByDenom: (denom: any) => {
    base: any;
    display: any;
};
export declare const getOsmosisSymbolIbcName: (symbol: any) => any;
export declare const displayUnitsToDenomUnits: (symbol: any, amount: any) => string;
export declare const getPrice: (prices: any, symbol: any) => any;
export declare const displayUnitsToDollarValue: (prices: any, symbol: any, amount: any) => string;
export declare const displayUnitsToDollarValueByDenom: (prices: any, denom: any, amount: any) => string;
export declare const baseUnitsToDollarValueByDenom: (prices: any, denom: any, amount: any) => string;
export declare const baseUnitsToDollarValue: (prices: any, symbol: any, amount: any) => string;
export declare const dollarValueToDisplayUnits: (prices: any, symbol: any, amount: any) => string;
export declare const dollarValueToDenomUnits: (prices: any, symbol: any, amount: any) => string;
export declare const baseUnitsToDisplayUnits: (symbol: any, amount: any) => string;
export declare const baseUnitsToDisplayUnitsByDenom: (denom: any, amount: any) => string;
export declare const getChain: ({ token }: {
    token: any;
}) => Promise<import("@chain-registry/types").Chain>;
