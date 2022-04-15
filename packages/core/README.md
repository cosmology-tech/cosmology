# @cosmology/core

```
npm install @cosmology/core
```

Use `cosmology` to manage your daily rewards and investment strategies in Osmosis and the Cosmos. Make cryptocurrency trades, join liquidity pools, and stake rewards.

## usage
## commands

### `swapExactAmountIn`

The swap command will make a trade between two currencies.

```js
import { messages } from '@cosmology/core';
import { coin } from '@cosmjs/amino';

const { msg, fee } = messages.swapExactAmountIn({
  sender: address, // osmo address
  routes, // TradeRoute 
  tokenIn: coin(amount, denom), // Coin
  tokenOutMinAmount // number as string with no decimals
});
```
### `joinPool`

The join command will join a pool.

```js
import { messages } from '@cosmology/core';
import { coin } from '@cosmjs/amino';

const { msg, fee } = messages.joinPool({
  poolId, // string!
  sender: account.address, // osmo address
  shareOutAmount, // number as string with no decimals
  tokenInMaxs // Coin[]
});

```
### `lockTokens`

The lock command will lock your gamms tokens for staking so you can earn rewards.

```js
import { messages } from '@cosmology/core';
const { msg, fee } = messages.lockTokens({
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
