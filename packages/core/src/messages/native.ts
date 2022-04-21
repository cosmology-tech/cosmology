import { cosmos, ibc } from '@osmonauts/osmosis';

export const native = {
  ...cosmos.staking.v1beta1.messages,
  ...cosmos.distribution.v1beta1.messages,
  ...cosmos.gov.v1beta1.messages,
  ...cosmos.bank.v1beta1.messages,
  ...ibc.applications.transfer.v1.messages
};
