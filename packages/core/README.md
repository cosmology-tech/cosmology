# @cosmology/core

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmology/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmology/actions/workflows/run-tests.yml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmology/blob/main/LICENSE"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmology/core"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmology?filename=packages%2Fcore%2Fpackage.json"></a>
</p>

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
import { messages } from '@cosmology/core';
import { FEES } from 'osmojs';
import { coin } from '@cosmjs/amino';

const fee = FEES.osmosis.swapExactAmountIn('low'); // low, medium, high
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
  lookupRoutesForTrade,
  getPoolsPricesPairs,
  calculateAmountWithSlippage
} from '@cosmology/core';

import { osmosis } from 'osmojs';

const {
  swapExactAmountIn
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

const client = await osmosis.ClientFactory.createRPCQueryClient({ rpcEndpoint });

const {
  pools,
  prices,
  pairs,
  prettyPools
} = await getPoolsPricesPairs(client);

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

const fee = FEES.osmosis.swapExactAmountIn(argv.fee || 'low'); // low, medium, high
const msg = swapExactAmountIn({
  sender: address, // osmo address
  routes, // TradeRoute 
  tokenIn: coin(amount, denom), // Coin
  tokenOutMinAmount // number as string with no decimals
});
```
### `joinPool`

The join command will join a pool.

```js
import { coin } from '@cosmjs/amino';
import { osmosis } from 'osmojs';

const {
  joinPool
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

const fee = FEES.osmosis.joinPool(argv.fee || 'low'); // low, medium, high
const msg = joinPool({
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
import { osmosis } from 'osmojs';

const {
  lockTokens
} = osmosis.lockup.MessageComposer.withTypeUrl;

const msg = lockTokens({
  owner, // osmo address
  coins, // Coin[]
  duration // duration as string
});

```
### `withdrawDelegatorReward`


Claim rewards from staking.

```js
import { cosmos } from 'osmojs';

const {
  withdrawDelegatorReward
} = cosmos.distribution.v1beta1.MessageComposer.fromPartial;

const msg = withdrawDelegatorReward({
  delegator_address: address,
  validator_address: validator_address
});
```
### `delegate`

Delegate to a validator.

```js
import { cosmos } from 'osmojs';

const {
  delegate
} = cosmos.staking.v1beta1.MessageComposer.fromPartial;

const msg = delegate({
  delegator_address,
  validator_address,
  amount: {
    amount,
    denom
  }
});
```
## known issues

* defaults to NOT using pools with less than 100k in liquidity
* smaller tokens with volatility may need higher slippage values


## Credits

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.tech/validator)

Code built with the help of these related projects:

* [@osmonauts/telescope](https://github.com/osmosis-labs/telescope) a "babel for the Cosmos", Telescope is a TypeScript Transpiler for Cosmos Protobufs.
* [osmojs](https://github.com/osmosis-labs/osmojs) OsmosJS makes it easy to compose and broadcast Osmosis and Cosmos messages.

## Disclaimer

AS DESCRIBED IN THE COSMOLOGY LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating Cosmology will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the Cosmology app or Cosmology CLI, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
