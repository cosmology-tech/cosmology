const sources = [
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/txfees/v1beta1/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/txfees/v1beta1/gov.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/txfees/v1beta1/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/txfees/v1beta1/feetoken.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/superfluid/tx.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/superfluid/superfluid.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/superfluid/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/superfluid/params.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/superfluid/gov.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/superfluid/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/store/v1beta1/tree.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/pool-incentives/v1beta1/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/pool-incentives/v1beta1/incentives.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/pool-incentives/v1beta1/gov.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/pool-incentives/v1beta1/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/mint/v1beta1/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/mint/v1beta1/mint.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/mint/v1beta1/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/lockup/tx.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/lockup/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/lockup/lock.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/lockup/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/incentives/tx.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/incentives/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/incentives/params.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/incentives/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/incentives/gauge.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/gamm/v1beta1/tx.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/gamm/v1beta1/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/gamm/v1beta1/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/gamm/pool-models/balancer/tx.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/gamm/pool-models/balancer/balancerPool.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/epochs/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/epochs/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/claim/v1beta1/query.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/claim/v1beta1/params.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/claim/v1beta1/genesis.proto',
  'https://raw.githubusercontent.com/osmosis-labs/osmosis/main/proto/osmosis/claim/v1beta1/claim.proto'
];

const { default: axios } = require('axios');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const { basename, dirname } = require('path');

const getProto = async (url) => {
  const file = await axios.get(url);
  const urlObj = new URL(url);
  const { pathname } = urlObj;

  const filename = basename(pathname);
  const dir = dirname(pathname);

  const contents = file.data;

  const filePath = path.resolve(
    path.join(__dirname, '/../proto/definitions/', dir)
  );

  mkdirp.sync(filePath);

  fs.writeFileSync(path.join(filePath, filename), contents);

  return {
    filename,
    dir,
    contents
  };
};

(async () => {
  for (const source of sources) {
    await getProto(source);
  }
})();
