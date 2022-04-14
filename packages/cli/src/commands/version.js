import pkg from '../../package.json';

export default async (argv) => {
  console.log(pkg.version);
};
