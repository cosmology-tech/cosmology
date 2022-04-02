import c from 'ansi-colors';
import { BroadcastTxResponse, PoolAllocation, Swap } from '../types'

export const printSwapForPoolAllocation = (pool: PoolAllocation): void => {
  console.log(`\nSWAPS for ${c.bold.magenta(pool.name)}`);
};

export const printSwap = (swap: Swap): void => {
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

export const printOsmoTransactionResponse = (res: BroadcastTxResponse) => {
  if (res.code == 0) {
    console.log(c.bold.green(`success at height: ${res.height}`));
    console.log(`TX: https://www.mintscan.io/osmosis/txs/${res.transactionHash}`);
    console.log(`\n`);
  } else {
    console.log(c.bold.red('TX failed:'));
    console.log(res.rawLog);
    console.log(`TX: https://www.mintscan.io/osmosis/txs/${res.transactionHash}`);
    process.exit(1);
  }
};