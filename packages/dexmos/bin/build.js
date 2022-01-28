const fs = require('fs');
const path = require('path');
const glob = require('glob').sync;
const Case = require('case');
const srcDir = path.resolve(`${__dirname}/../src/commands`);

const paths = glob(`${srcDir}/**.js`).map((file) => {
  const [, name] = file.match(/\/(.*)\.js$/);
  return {
    name: path.basename(name),
    param: Case.kebab(path.basename(name)),
    safe: Case.snake(path.basename(name)),
    path: file.replace(srcDir, './commands').replace(/\.js$/, '')
  };
});

const imports = paths
  .map((f) => {
    return [`import _${f.safe} from '${f.path}';`];
  })
  .join('\n');

const out = `
${imports}
const Commands = {};
${paths
  .map((a) => {
    return `Commands['${a.param}'] = _${a.safe};`;
  })
  .join('\n')}

  export { Commands }; 

  `;

fs.writeFileSync(`${__dirname}/../src/cmds.js`, out);