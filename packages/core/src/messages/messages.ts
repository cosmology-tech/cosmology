import { osmosis, cosmos } from 'osmojs';

export const messages = {
  ...osmosis.gamm.v1beta1.MessageComposer.withTypeUrl,
  ...osmosis.superfluid.MessageComposer.withTypeUrl,
  ...osmosis.lockup.MessageComposer.withTypeUrl,
  // native
  ...cosmos.distribution.v1beta1.MessageComposer.fromPartial,
  ...cosmos.bank.v1beta1.MessageComposer.fromPartial,
  ...cosmos.staking.v1beta1.MessageComposer.fromPartial
};