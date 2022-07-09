import { osmosis, cosmos, ibc } from 'osmojs';

export const messages = {
  // osmosis
  ...osmosis.gamm.v1beta1.MessageComposer.withTypeUrl,
  ...osmosis.superfluid.MessageComposer.withTypeUrl,
  ...osmosis.lockup.MessageComposer.withTypeUrl,
  // cosmos
  ...cosmos.distribution.v1beta1.MessageComposer.fromPartial,
  ...cosmos.bank.v1beta1.MessageComposer.fromPartial,
  ...cosmos.staking.v1beta1.MessageComposer.fromPartial,
  ...cosmos.gov.v1beta1.MessageComposer.fromPartial,
  // ibc
  ...ibc.applications.transfer.v1.MessageComposer.withTypeUrl
};