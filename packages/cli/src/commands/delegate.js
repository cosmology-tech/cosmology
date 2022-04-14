import { prompt } from '../utils/prompt';
import { CosmosApiClient } from '../clients/cosmos';
import {
  displayUnitsToDenomUnits,
  getWalletFromMnemonic,
  baseUnitsToDisplayUnitsByDenom,
  getCosmosAssetInfo,
  printTransactionResponse,
  gasEstimation
} from '../utils';
import { promptChain, promptMnemonic } from '../utils/prompt';
import {
  SigningStargateClient,
  assertIsDeliverTxSuccess
} from '@cosmjs/stargate';
import { messages } from '../messages/native';
import { noDecimals } from '../messages';
import { Dec } from '@keplr-wallet/unit';

export default async (argv) => {
  argv = await promptMnemonic(argv);
  const chain = await promptChain(argv);

  const { minAmount } = await prompt(
    [
      {
        type: 'number',
        message: 'minAmount',
        name: 'minAmount'
      }
    ],
    argv
  );

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

  const [mainAccount] = await signer.getAccounts();

  const { address } = mainAccount;

  const delegations = await client.getDelegations(address);

  const validators = [];
  if (delegations.result && delegations.result.length) {
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

  const balances = await client.getBalances(address);
  if (!balances || !balances.result || !balances.result.length) {
    console.log('no balance!');
    return;
  }

  const bal = balances.result.find((el) => el.denom === denom);

  if (!bal) {
    console.log(`no ${argv.chainToken} balance!`);
    return;
  }
  const readableBalance = baseUnitsToDisplayUnitsByDenom(bal.denom, bal.amount);

  const availBal = new Dec(readableBalance);
  if (availBal.lt(new Dec(minAmount))) {
    console.log(
      `${readableBalance} ${argv.chainToken} is not enough. Exiting...`
    );
    return;
  }

  console.log(`${readableBalance} ${argv.chainToken} available`);

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

  const messagesToDelegate = [];
  const suggested = availBal.sub(new Dec(0.02));
  if (suggested.lte(new Dec(0.01))) {
    console.log('not enough to delegate. exiting.');
    return;
  }

  const { amount: displayAmount } = await prompt(
    [
      {
        type: 'number',
        message: 'amount',
        name: 'amount',
        default: suggested.toString(),
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
      amount: noDecimals(amount),
      denom
    })
  );

  const fee = await gasEstimation(
    denom,
    stargateClient,
    address,
    messagesToDelegate,
    '',
    1.3
  );

  stargateClient.signAndBroadcast(address, messagesToDelegate, fee, '').then(
    (result) => {
      try {
        assertIsDeliverTxSuccess(result);
        stargateClient.disconnect();
        console.log(
          `⚛️  success in staking ${displayAmount} ${argv.chainToken}`
        );
        printTransactionResponse(result, chain);
      } catch (error) {
        console.log(error);
      }
    },
    (error) => {
      console.log(error);
    }
  );
};
