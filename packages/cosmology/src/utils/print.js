import c from 'ansi-colors';

export const printSwap = (swap) => {
  const {
    trade: { sell, buy, beliefValue },
    routes
  } = swap;

  console.log(
    `TRADE ${c.bold.yellow(
      sell.displayAmount + ''
    )} ($${beliefValue}) worth of ${c.bold.red(sell.symbol)} for ${c.bold.green(
      buy.symbol
    )}`
  );
  const r = routes
    .map((r) => [r.tokenInSymbol, r.tokenOutSymbol].join('->'))
    .join(', ')
    .toLowerCase();
  console.log(c.gray(`  routes: ${r}`));
};

export const printTransactionResponse = (res) => {
  if (res.code == 0) {
    console.log(`success at height: ${res.height}`);
    console.log(`TX: ${res.transactionHash}`);
    console.log(`\n`);
  } else {
    console.log('TX failed:');
    console.log(res.rawLog);
    process.exit(1);
  }
};
