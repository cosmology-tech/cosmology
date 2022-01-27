const fs = require('fs');
const { resolve, basename, extname } = require('path');
const glob = require('glob').sync;

const paths = glob(`${__dirname}/../chain-registry/**/*.json`);
const assets = [];
const chains = [];
paths.forEach((file) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  if (data.$schema === '../assetlist.schema.json') assets.push(data);
  if (data.$schema === '../chain.schema.json') chains.push(data);
});

fs.writeFileSync(
  `${__dirname}/../src/assets.json`,
  JSON.stringify(assets, null, 2)
);
fs.writeFileSync(
  `${__dirname}/../src/chains.json`,
  JSON.stringify(chains, null, 2)
);
