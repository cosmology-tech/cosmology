import { readFileSync, writeFileSync } from 'fs';
import { assets } from '@pyramation/cosmos-registry';
import { prompt } from '../utils';
import { OsmosisApiClient } from '..';
import { OsmosisValidatorClient } from '../clients/validator';
import { baseUnitsToDisplayUnits, osmoRestClient } from '../utils';
import { convertWeightsIntoCoins, convertValidatorPricesToDenomPriceHash, osmoDenomToSymbol, convertCoinsToDisplayValues, getTradesRequiredToGetBalances } from '../utils/osmo';

export default async (argv) => {

    const actions = [];

    const validator = new OsmosisValidatorClient();
    const api = new OsmosisApiClient();

    const getPools = async (argv) => {
        if (argv.poolId) return [];
        const pools = await validator.getPools();
        return Object.keys(pools).map(poolId => {
            if (pools[poolId][0].liquidity > argv['liquidity-limit']) {
                return {
                    name: pools[poolId].map(a => a.symbol).join('/'),
                    value: poolId
                };
            }
        }).filter(Boolean);
    };

    if (!argv['liquidity-limit']) argv['liquidity-limit'] = 100_000;

    const { client, wallet } = await osmoRestClient(argv);
    const [account] = await wallet.getAccounts();

    const accountBalances = await client.getBalances(account.address);
    const display = accountBalances.result.map(({ denom, amount }) => {
        const symbol = osmoDenomToSymbol(denom);
        const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
        return {
            symbol,
            denom,
            amount,
            displayAmount
        };
    });



    // GET THE COINS THAT THE USER IS WILLING TO PART WITH

    const availableChoices = display.map((item) => {
        return {
            name: `${item.symbol} (${item.displayAmount})`,
            value: item
        };
    });

    const { available } = await prompt([
        {
            type: 'checkbox',
            name: 'available',
            message: 'select which coins in your wallet that you are willing to sell',
            choices: availableChoices
        }
    ], argv);



    // WHICH POOLS TO INVEST?

    const poolList = await getPools(argv);
    let { poolId } = await prompt(
        [
            {
                type: 'checkbox',
                name: 'poolId',
                message: 'choose pools to invest in',
                choices: poolList
            }
        ],
        argv
    );

    if (!Array.isArray(poolId)) poolId = [poolId];



    // WHICH TOKENS TO INVEST?

    const assetList = assets.reduce(
        (m, { assets }) => [...m, ...assets.map(({ symbol }) => symbol)],
        []
    ).sort();

    let { token } = await prompt(
        [
            {
                type: 'checkbox',
                name: 'token',
                message: 'choose tokens to invest in',
                choices: assetList
            }
        ],
        argv
    );
    if (!Array.isArray(token)) token = [token];

    // WEIGHTS?

    const tokenWeightQuestions = token.map(t => {
        return {
            type: 'number',
            name: `tokenWeights[${t}][weight]`,
            message: `enter weight for ${t}`
        }
    });

    const { tokenWeights } = await prompt(
        tokenWeightQuestions,
        argv
    );

    const poolWeightQuestions = poolId.map(p => {
        const str = `gamm/pool/${p}`;
        const name = poolList.find(({ value }) => value == p + '').name;
        return {
            type: 'number',
            name: `poolWeights[${str}][weight]`,
            message: `enter weight for pool ${name} (${p})`
        }
    });

    const { poolWeights } = await prompt(
        poolWeightQuestions,
        argv
    );

    const weights = [
        ...Object.keys(poolWeights).map(gamm => {
            const weight = poolWeights[gamm].weight;
            return {
                denom: gamm,
                weight
            };
        }),
        ...Object.keys(tokenWeights).map(symbol => {
            const weight = tokenWeights[symbol].weight;
            return {
                symbol,
                weight
            };
        })
    ];

    // get pricing and pools info...

    const allTokens = await validator.getTokens();
    const prices = convertValidatorPricesToDenomPriceHash(allTokens);
    const pools = await api.getPoolsPretty();

    const result = convertWeightsIntoCoins({ weights, pools, prices, balances: available });

    // console.log(result);

    // pools
    for (let i = 0; i < result.pools.length; i++) {
        const desired = result.pools[i].coins;
        const trades = getTradesRequiredToGetBalances({ prices, balances: available, desired })
        const a = {
            name: result.pools[i].name,
            trades
        };

        actions.push({
            type: 'pool',
            name: result.pools[i].name,
            trades
        });

        console.log(`\nSWAPS for ${result.pools[i].name}`);
        trades.forEach(({ sell, buy, beliefValue }) => {
            console.log(`TRADE $${beliefValue} worth of ${sell.symbol} for ${buy.symbol}`);
        });

    }


    // coins
    const trades = getTradesRequiredToGetBalances({ prices, balances: available, desired: result.coins })
    console.log(`\nSWAPS for STAKING`);
    trades.forEach(({ sell, buy, beliefValue }) => {
        actions.push({
            type: 'coin',
            name: buy.symbol,
            trade: { sell, buy, beliefValue }
        });
        console.log(`TRADE $${beliefValue} worth of ${sell.symbol} for ${buy.symbol}`);
    });
    console.log('\n\nSpecify an outfile for the recipe file:');

    let { outfile } = await prompt([
        {
            type: 'file',
            name: 'outfile',
            message: 'outfile'
        }
    ], argv);
    if (!outfile.endsWith('.json')) outfile = outfile + '.json';
    writeFileSync(outfile, JSON.stringify(actions, null, 2));

    // console.log(trades);
    // console.log({
    //     available,
    //     weights
    // });

};
