import { osmosis } from 'osmojs';

export const messages = {
  ...osmosis.gamm.v1beta1.MessageComposer.withTypeUrl,
  ...osmosis.superfluid.MessageComposer.withTypeUrl,
  ...osmosis.lockup.MessageComposer.withTypeUrl
};