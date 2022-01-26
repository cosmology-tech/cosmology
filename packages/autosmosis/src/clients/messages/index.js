import { coins, coin } from '@cosmjs/launchpad';

export * from './join-pool';
export * from './swap-exact-amount-in';
export * from './join-swap-extern-amount-in';
export * from './lock-tokens';

export const demo = () => {
  // MsgDelegate
  const msg = {
    type: 'cosmos-sdk/MsgDelegate',
    value: {
      delegator_address: 'address',
      validator_address: 'cosmosvaloper1yfkkk04ve8a0sugj4fe6q6zxuvmvza8r3arurr',
      amount: coin(300000, 'ustake')
    }
  };
  const fee = {
    amount: coins(2000, 'ucosm'),
    gas: '180000' // 180k
  };
};
