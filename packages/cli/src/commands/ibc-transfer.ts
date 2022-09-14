import { coins } from '@cosmjs/amino';
import Long from 'long';
import {
    prompt,
    promptRpcEndpoint,
    promptRestEndpoint,
    promptMnemonic,
    printTransactionResponse
} from '../utils';
import {
    baseUnitsToDisplayUnits,
    getSellableBalanceTelescopeVersion,
    osmoDenomToSymbol
} from '@cosmology/core';
import { assertIsDeliverTxSuccess } from '@cosmjs/stargate';
import { ibc } from 'chain-registry';
import { Dec } from '@keplr-wallet/unit';
import { chains } from 'chain-registry';
import { getSigningIbcClient, ibc as ibcProto, cosmos } from 'osmojs';
import { signAndBroadcast, getOfflineSignerAmino } from 'cosmjs-utils';

const {
    transfer
} = ibcProto.applications.transfer.v1.MessageComposer.withTypeUrl;

const chainList = chains
    .map(({ chain_name }) => chain_name)
    .sort();


export default async (argv) => {
    argv = await promptMnemonic(argv);

    //
    const { fromChain } = await prompt(
        [
            {
                type: 'fuzzy',
                name: 'fromChain',
                message: 'fromChain',
                choices: chainList
            }
        ],
        argv
    );

    const { toChain } = await prompt(
        [
            {
                type: 'fuzzy',
                name: 'toChain',
                message: 'toChain',
                choices: chainList
            }
        ],
        argv
    );

    const chain = chains.find(c =>
        c.chain_name === fromChain
    );

    const chain2 = chains.find(c =>
        c.chain_name === toChain
    );

    if (!chain) {
        throw new Error('chain not found');
    }

    const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);
    const restEndpoint = await promptRestEndpoint(chain.apis.rest.map((e) => e.address), argv);

    const signer = await getOfflineSignerAmino({ mnemonic: argv.mnemonic, chain });
    const signer2 = await getOfflineSignerAmino({ mnemonic: argv.mnemonic, chain: chain2 });
    const [account] = await signer.getAccounts();
    const [toAccount] = await signer2.getAccounts();
    const { address } = account;

    const ibcClient = await getSigningIbcClient({
        rpcEndpoint,
        signer
    });
    const client = await cosmos.ClientFactory.createLCDClient({ restEndpoint });
    const accountBalances = await client.cosmos.bank.v1beta1.allBalances({
        address
    })

    if (fromChain !== 'osmosis') {
        // NOTE OSMO only
        // TODO make this more generic
        console.log('only supporting osmosis as fromChain now.')
        console.log('for into osmosis look into chain-2 info')
        return;
    }

    const display = accountBalances.balances
        .map(({ denom, amount }) => {
            if (denom.startsWith('gamm')) return;

            // NOTE OSMO only
            // TODO make this more generic
            const symbol = osmoDenomToSymbol(denom);
            if (!symbol) {
                console.log('WARNING: cannot find ' + denom);
                return;
            }
            try {
                const displayAmount = baseUnitsToDisplayUnits(symbol, amount);
                if (new Dec(displayAmount).lte(new Dec(0.0001))) return;
                return {
                    symbol,
                    denom,
                    amount,
                    displayAmount
                };
            } catch (e) {
                return {
                    symbol,
                    denom,
                    amount,
                    displayAmount: amount
                }
            }

        })
        .filter(Boolean);

    // GET THE COINS THAT THE USER IS WILLING TO PART WITH
    const availableChoices = display.map((item) => {
        return {
            name: `${item.symbol} (${item.displayAmount})`,
            value: item.symbol
        };
    });

    let { send } = await prompt(
        [
            {
                type: 'checkbox',
                name: 'send',
                message:
                    'select which coins in your wallet that you are willing to send',
                choices: availableChoices
            }
        ],
        argv
    );
    if (!Array.isArray(send)) send = [send];

    let balances = await getSellableBalanceTelescopeVersion({
        client,
        address,
        sell: send
    });

    let flipped = false;
    let ibcInfo = ibc.find(i =>
        i.chain_1.chain_name === fromChain
        &&
        i.chain_2.chain_name === toChain
    );

    if (!ibcInfo) {
        ibcInfo = ibc.find(i =>
            i.chain_1.chain_name === toChain
            &&
            i.chain_2.chain_name === fromChain
        );
        flipped = true;
    }

    if (!ibcInfo) {
        throw new Error('cannot find IBC info');
    }

    const key = flipped ? 'chain_2' : 'chain_1';
    const source_port = ibcInfo.channels[0][key].port_id;
    const source_channel = ibcInfo.channels[0][key].channel_id;

    if (balances.length !== 1) {
        throw new Error('one at a time for now');
    }

    const stamp = Date.now();
    const timeoutInNanos = (stamp + 1.2e+6) * 1e+6;

    // TODO
    // 1. don't send full balance
    // 2. deposit assets into osmosis
    // 3. save some for fees when NOT osmo (e.g. other direction) 

    const msg = transfer({
        source_port,
        source_channel,
        token: {
            denom: balances[0].denom,
            amount: balances[0].amount
        },
        sender: account.address,
        receiver: toAccount.address,
        timeout_height: undefined,
        // timeoutHeight: {
        //     revisionNumber: "1",
        //     revisionHeight: "3670610"
        // },
        // 20 mins in nanos
        timeout_timestamp: Long.fromString(timeoutInNanos + '')
    });

    const fee = {
        amount: coins(0, 'uosmo'),
        gas: '250000'
    };

    const res = await signAndBroadcast({
        client: ibcClient,
        chainId: chain.chain_id,
        address,
        msgs: [msg],
        fee,
        memo: ''
    });

    assertIsDeliverTxSuccess(res);
    ibcClient.disconnect();
    printTransactionResponse(res, chain);

};