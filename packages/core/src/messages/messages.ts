// import { osmosis } from '@osmonauts/osmosis';

// export const messages = {
//   ...osmosis.gamm.v1beta1.json,
//   ...osmosis.superfluid.json,
//   ...osmosis.lockup.json
// };

import * as gamm from '@osmonauts/osmosis/main/proto/osmosis/gamm/v1beta1/tx.registry';
import * as superfluid from '@osmonauts/osmosis/main/proto/osmosis/superfluid/tx.registry';
import * as lockup from '@osmonauts/osmosis/main/proto/osmosis/lockup/tx.registry';

export const messages = {
  ...gamm.MessageComposer.withTypeUrl,
  ...superfluid.MessageComposer.withTypeUrl,
  ...lockup.MessageComposer.withTypeUrl
};
