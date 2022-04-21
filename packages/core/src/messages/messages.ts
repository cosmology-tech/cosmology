import { osmosis } from '@osmonauts/osmosis/main/proto/osmosis';

export const messages = {
  ...osmosis.gamm.v1beta1.json,
  ...osmosis.superfluid.json,
  ...osmosis.lockup.json
};
