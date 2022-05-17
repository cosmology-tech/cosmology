# @cosmology/core

```
npm install @cosmology/core
```

Use `cosmology` to build web3 applications on top of Osmosis and the Cosmos. Make cryptocurrency trades, join liquidity pools, and stake rewards.

## usage

### stargate client

For osmosis, first get your signer/wallet and stargate signing client.

```js
import { 
  getWalletFromMnemonic,
  getSigningOsmosisClient
} from '@cosmology/core';
const signer = await getWalletFromMnemonic({mnemonic, token: 'OSMO'});
const client = await getSigningOsmosisClient({
  rpcEndpoint: rpcEndpoint,
  signer
});
```

For other chains, simply create a signing stargate client

```js
import {
  SigningStargateClient
} from '@cosmjs/stargate';
import { 
  getWalletFromMnemonic
} from '@cosmology/core';

const signer = await getWalletFromMnemonic({mnemonic, token: 'AKT'});
const client = await SigningStargateClient.connectWithSigner(
  rpcEndpoint,
  signer
);
```

### broadcasting messages

Once you have your messages, you can broadcast them with `signAndBroadcast`:

```js
import { signAndBroadcast } from '@cosmology/core';
const res = await signAndBroadcast({
  client: stargateClient,
  chainId: argv.chainId, // e.g. 'osmosis-1'
  address,
  msg,
  fee,
  memo: ''
});
```

## commands

### `swapExactAmountIn`

The swap command will make a trade between two currencies.

```js
import { messages, getOsmoFee } from '@cosmology/core';
import { coin } from '@cosmjs/amino';

const fee = getOsmoFee('swapExactAmountIn');
const msg = messages.swapExactAmountIn({
  sender: address, // osmo address
  routes, // TradeRoute 
  tokenIn: coin(amount, denom), // Coin
  tokenOutMinAmount // number as string with no decimals
});
```

#### `lookupRoutesForTrade`

For swaps, you'll need a `TradeRoute` for it to work:

```js
import { 
  messages,
  lookupRoutesForTrade,
  prettyPool,
  OsmosisApiClient,
  calculateAmountWithSlippage
} from '@cosmology/core';

const api = new OsmosisApiClient({
  url: restEndpoint
});
const lcdPools = await api.getPools();
const pools = lcdPools.pools.map((pool) => prettyPool(pool));

const routes = lookupRoutesForTrade({
  pools,
  trade: {
    sell: {
      denom: tokenIn.denom,
      amount: tokenInAmount
    },
    buy: {
      denom: tokenOut.denom,
      amount: tokenOutAmount
    },
    beliefValue: value
  },
  pairs
}).map((tradeRoute) => {
  const {
    poolId,
    tokenOutDenom
  } = tradeRoute;
  return {
    poolId,
    tokenOutDenom
  };
});

const tokenOutMinAmount = calculateAmountWithSlippage(
  buy.amount,
  slippage
);

const fee = getOsmoFee('swapExactAmountIn');
const msg = messages.swapExactAmountIn({
  sender: address, // osmo address
  routes, // TradeRoute 
  tokenIn: coin(amount, denom), // Coin
  tokenOutMinAmount // number as string with no decimals
});
```
### `joinPool`

The join command will join a pool.

```js
import { messages, getOsmoFee } from '@cosmology/core';
import { coin } from '@cosmjs/amino';

const fee = getOsmoFee('swapExactAmountIn');
const msg = messages.joinPool({
  poolId, // string!
  sender: account.address, // osmo address
  shareOutAmount, // number as string with no decimals
  tokenInMaxs // Coin[]
});
```

To calculate `shareOutAmount`, you will need one of two methods. See below.
#### `calculateCoinsNeededInPoolForValue`

If you want to specify a dollar value to invest in a pool:

```js
coinsNeeded = calculateCoinsNeededInPoolForValue(prices, poolInfo, value);
```
#### `calculateMaxCoinsForPool`

if you want to invest the maximum amount possible for a pool:

```js
coinsNeeded = calculateMaxCoinsForPool(prices, poolInfo, balances);
```
#### `calculateShareOutAmount`

Once you have the coins needed from either `calculateCoinsNeededInPoolForValue` or `calculateMaxCoinsForPool`, you can use `calculateShareOutAmount` to get the `shareOutAmount` for the pool:

```js
const shareOutAmount = calculateShareOutAmount(poolInfo, coinsNeeded);
```

### `lockTokens`

The lock command will lock your gamms tokens for staking so you can earn rewards.

```js
import { messages } from '@cosmology/core';
const msg = messages.lockTokens({
  owner, // osmom address
  coins, // Coin[]
  duration // duration as string
});

```
### `withdrawDelegatorReward`

Claim rewards from staking.

```js
const msg = messages.withdrawDelegatorReward({
  delegatorAddress: address,
  validatorAddress: validator_address
});
```
### `delegate`

Delegate to a validator.

```js
const msg = messages.delegate({
  delegatorAddress,
  validatorAddress,
  amount,
  denom
});
```
## known issues

* defaults to NOT using pools with less than 100k in liquidity
* smaller tokens with volatility may need higher slippage values

## Disclaimer

AS DESCRIBED IN THE COSMOLOGY LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Cosmology will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Cosmology app or Cosmology CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
