import {
  convertCoinsToDisplayValues,
  osmoDenomToSymbol,
  symbolToOsmoDenom
} from '..';
import { prompt } from '../utils/prompt';
import { CosmosApiClient } from '../clients/cosmos';
import {
  baseUnitsToDisplayUnits,
  displayUnitsToDenomUnits,
  getCosmosAssetInfoByDenom,
  getWalletFromMnemonic,
  getBaseAndDisplayUnitsByDenom,
  baseUnitsToDisplayUnitsByDenom,
  getCosmosAssetInfo
} from '../utils';
import { promptChain, promptMnemonic } from '../utils/prompt';
import {
  SigningStargateClient,
  calculateFee,
  assertIsDeliverTxSuccess,
  GasPrice
} from '@cosmjs/stargate';
import { messages } from '../messages/native';

// TODO certain calc'd values cosmjs doesn't like...
// ? [amount] amount 0.05329299999999999
// /Users/pyramation/code/dexmos/dexmos/node_modules/@cosmjs/amino/build/coins.js:26
//             throw new Error("Invalid unsigned integer string format");

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);

  // const { minAmount } = await prompt([
  //     {
  //         type: 'number',
  //         message: 'minAmount',
  //         name: 'minAmount'
  //     }
  // ], argv);

  //   const url = await findAvailableUrl(chain.chain_id, chain.apis.rest.map(r=>r.address))
  //   console.log({url});

  const { restEndpoint } = await prompt(
    [
      {
        type: 'list',
        message: 'restEndpoint',
        name: 'restEndpoint',
        choices: chain.apis.rest.map((e) => e.address)
      }
    ],
    argv
  );

  const client = new CosmosApiClient({
    url: restEndpoint
  });

  // check re-stake (w display or base?)
  const denom = getCosmosAssetInfo(argv.chainToken).assets.find(
    (a) => a.symbol === argv.chainToken
  ).base;
  if (!denom) throw new Error('cannot find asset base unit');
  const defaultGasPrice = '0.0025' + denom;

  const signer = await getWalletFromMnemonic({
    mnemonic: argv.mnemonic,
    token: argv.chainToken
  });

  const { rpcEndpoint } = await prompt(
    [
      {
        type: 'list',
        message: 'rpcEndpoint',
        name: 'rpcEndpoint',
        choices: chain.apis.rpc.map((e) => e.address)
      }
    ],
    argv
  );

  const stargateClient = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    signer
  );

  const getAddress = async () => {
    const accounts = await signer.getAccounts();
    return accounts[0].address;
  };

  const getFee = (gas, gasPrice) => {
    if (!gas) gas = 200_000;
    if (!gasPrice) gasPrice = GasPrice.fromString(defaultGasPrice);
    return calculateFee(gas, gasPrice);
  };

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;
  //   console.log(address);

  const delegations = await client.getDelegations(address);

  const validators = [];
  if (delegations.result && delegations.result.length) {
    console.log(delegations.result);
    const vals = delegations.result.map(
      (val) => val.delegation.validator_address
    );
    for (let v = 0; v < vals.length; v++) {
      const info = await client.getValidatorInfo(vals[v]);
      validators.push({
        name: info.validator.description.moniker,
        value: vals[v]
      });
    }
  }

  const { validatorAddress } = await prompt(
    [
      {
        type: 'list',
        message: 'validatorAddress',
        name: 'validatorAddress',
        choices: validators
      }
    ],
    argv
  );

  console.log(validatorAddress);

  const balances = await client.getBalances(address);
  if (!balances || !balances.result || !balances.result.length) {
    console.log('no balance!');
    return;
  }

  const bal = balances.result.find((el) => el.denom === denom);
  const readableBalance = baseUnitsToDisplayUnitsByDenom(bal.denom, bal.amount);
  console.log({ readableBalance });

  const simulate = async (address, msgs, memo, modifier) => {
    const estimate = await stargateClient.simulate(address, msgs, memo);
    console.log({ estimate });
    return parseInt(estimate * (modifier || 1.5));
  };

  const getGasPrice = async (address, msgs, memo, modifier) => {
    let fee;
    let gas;
    try {
      gas = await simulate(address, msgs, memo);
      fee = getFee(gas);
      //   fee = getFee(gas, gasPrice)
      console.log(fee);
      return fee;
      //   const feeAmount = Number(fee.amount[0].amount);
      //   return feeAmount;
    } catch (error) {
      console.log(error);
    }
  };

  const messagesToDelegate = [];

  const { amount: displayAmount } = await prompt(
    [
      {
        type: 'number',
        message: 'amount',
        name: 'amount',
        default: readableBalance - 0.02,
        choices: validators
      }
    ],
    argv
  );

  const amount = await displayUnitsToDenomUnits(argv.chainToken, displayAmount);

  messagesToDelegate.push(
    messages.delegate({
      delegatorAddress: address,
      validatorAddress: validatorAddress,
      amount: amount + '',
      denom
    })
  );

  const fee = await getGasPrice(address, messagesToDelegate);

  if (denom === 'uhuahua') {
    // literally wtf (needs a 10x + 1)
    fee.amount[0].amount = `${fee.amount[0].amount}1`;
  }
  if (denom === 'ucmdx') {
    // literally wtf (needs a 10x + 1)
    fee.amount[0].amount = `${fee.amount[0].amount}1`;
  }

  stargateClient.signAndBroadcast(address, messagesToDelegate, fee, '').then(
    (result) => {
      try {
        assertIsDeliverTxSuccess(result);
        stargateClient.disconnect();
        console.log('⚛️');
        console.log('success!');
      } catch (error) {
        console.log(error);
      }
    },
    (error) => {
      console.log(error);
    }
  );
};
