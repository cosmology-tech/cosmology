import { osmosis } from '@cosmonauts/osmosis/main/proto/osmosis';

export const messages = {
  ...osmosis.gamm.v1beta1.json,
  ...osmosis.superfluid.json,
  ...osmosis.lockup.json
};
