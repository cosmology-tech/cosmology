# @cosmology/cli

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmology/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmology/actions/workflows/run-tests.yml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmology/blob/main/LICENSE"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmology/cli"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmology?filename=packages%2Fcli%2Fpackage.json"></a>
</p>

```
npm install -g @cosmology/cli
```

Use `cosmology` to build web3 applications on top of Osmosis and the Cosmos. Make cryptocurrency trades, join liquidity pools, and stake rewards.

## usage

### CLI and user prompts

Not sure what to do? Simply type `cosmology`. It will prompt you with options. 

```
$ cosmology 
? [cmd] what do you want to do? 
  keychain-del 
  keychain-get 
  keychain-set 
❯ list-apis 
  list-pools 
  list-prices 
  load-recipe 
```

Then once you learn the api, you can start supplying the parameters.

```
cosmology <commandname>
```
## commands

### `rebalance`

The rebalance command will make a series of swaps on your behalf. It will prompt you to choose the coins you are willing to sell to create a new balance based on the pools you want to enter.

```sh
cosmology rebalance 
```

Example with parameters

```sh
cosmology rebalance \
    --chainId osmosis-1 \
    --restEndpoint https://lcd-osmosis.blockapsis.com \
    --rpcEndpoint https://osmosis.validator.network \
    --slippage 1 
```

### `join`

The join command will join a pool.

```sh
cosmology join 
```

Example with parameters

```sh
cosmology join \
    --keychain my-mnemonic-name \
    --chainId osmosis-1 \
    --restEndpoint https://lcd-osmosis.blockapsis.com \
    --poolId 601
    --max
```

### `lock`

The lock command will lock your gamms tokens for staking so you can earn rewards.

```sh
cosmology lock 
```

Example with parameters

```
cosmology lock \
    --keychain my-mnemonic-name \
    --chainId osmosis-1 \
    --restEndpoint https://lcd-osmosis.blockapsis.com \
    --poolId 601 \
    --duration 14
```

### `claim`

Claim rewards from staking.

```
cosmology claim
```

Example with parameters

```
cosmology claim \
  --keychain my-mnemonic-name \
  --chainToken CMDX \
  --minAmount 1 \
  --restEndpoint https://rest.comdex.one \
  --rpcEndpoint https://rpc.comdex.one
```

### `delegate`

Stake tokens to a validator.

```
cosmology delegate
```

Example with parameters

```
cosmology delegate \
  --keychain my-mnemonic-name \
  --chainToken CMDX \
  --minAmount 1 \
  --restEndpoint https://rest.comdex.one \
  --rpcEndpoint https://rpc.comdex.one \
  --validatorAddress comdexvaloper1mzxzxkzajancc63gtwt9x9zw2qfv9k9ar7ka34
```
## env vars

While everything can be done with parameters, you can also just supply env vars and cosmology won't prompt you for those values:

| env var              | optional           | description                                               |
| -------------------- | ------------------ | --------------------------------------------------------- |
| `MNEMONIC`           | Yes                | cosmos mnemonic, either plain-text or encrypted           |
| `ENCRYPTED_SALT`     | Yes                | used for encrypting/decrypting mnemonics                  |
| `KEYCHAIN_ACCOUNT`   | Yes                | used for storing info in OSX keychain account             |
| `CHAIN_ID`           | Yes                | used for getting chain info, e.g. osmosis-1               |
| `REST_ENDPOINT`      | Yes                | used for setting LCD endpoint                             |
| `RPC_ENDPOINT`       | Yes                | used for setting RCP endpoint                             |

## mnemonics

There are a few methods to deal with mnemonics. 

1. plain text env var `MNEMONIC`
2. encrypted key with a salt
3. mac OSX keychain

### METHOD 1 - plain text

(Not recommended) [video here](https://www.youtube.com/watch?v=K46jMo5pjvQ)

```sh
export MNEMONIC="action brisk disagree just bunker design wasp hand night ghost runway fluid"
# now you can run cosmology

cosmology rebalance
```

### METHOD 2 - encrypted salt via env var `ENCRYPTED_SALT`

[video here](https://www.youtube.com/watch?v=gHIpLZOpHaw)

The encrypted salt is the recommended usage so that you don't store plain-text mnemonics.
#### 1 First, generate a salt.

```sh
cosmology salt-generate --saltBytes 64
> GRHeG5r9nojio7PmCuNnLEh0Hglwvw1Bn87ipIMeyhPFVJk9i5eWtno7m7pa8FPRjbsd2LqCjEsR8/Hiyp9lLg==
```

#### 2 Now encrypt this salt value

(Yes, we are encrypting a salt with a salt, or password)

```sh
cosmology salt-encrypt \
     --secret GRHeG5r9nojio7PmCuNnLEh0Hglwvw1Bn87ipIMeyhPFVJk9i5eWtno7m7pa8FPRjbsd2LqCjEsR8/Hiyp9lLg==
 ```

 Now, store that value securely, and remember your password. Test the `salt-encrypt` and `salt-decrypt` commands a few times so you understand how it works. 

#### 3 Now you can use it in env var `ENCRYPTED_SALT`

```sh
export ENCRYPTED_SALT=U2FsdGVkX183aSMtLlWua/uig/Qqd99TBILc63iW1AsJaKGykZGPvA/DXByjYtws7drSVlipMPsMLrePajBtRyFP7tZOLrlUuL+xlhcsRAm0DcTRV+VDsnDQVykSDhSyl1RYf03SsLgUsYMvsixWFA==

# now the user will be prompted for "salt" which is the password used to decrypt the encryption key
# the mnemonic will be automatically decrypted by the system
cosmology
```
### METHOD 3 - keychain

[video here](https://www.youtube.com/watch?v=gHIpLZOpHaw)

We can leverage the Mac OSX keychain. Don't worry though, we ONLY use encryption via the encrypted salt, even if some of you happen to trust storing mnemonics in OSX keychain. We only store encrypted values, period.
### 1 create an encryption key and encrypt it as described in the previous step

create an `ENCRYPTED_SALT` and store it securely.

### 2 add your mnemonic to your keychain

* `name` is how you'll reference 
* `password` is your actual mnemonic
* `salt` is the salt for your encrypted salt key

```
$ cosmology keychain-set
? [name] name my-special-mnemonic-name-1
? [password] password [hidden]
? [salt] enter the salt [hidden]
```

Test it!

```
$ cosmology keychain-get \
 --name my-special-mnemonic-name-1
```

## testing

first start the tests

```
cd ./packages/cosmology
yarn test:watch
```

hit "p" and then type a search string to scope to the name your test
## developing the CLI

if you need to edit the CLI

```sh
cd ./packages/cosmology
export MNEMONIC="mammal wrestle hybrid cart choose flee transfer filter fly object swamp rookie"
export CHAIN_ID=osmosis-testnet-0
export RPC_ENDPOINT=http://143.244.147.126:26657

yarn run dev
```

## Useful Links for Developers of Cosmology

### RPC Docs

https://v1.cosmos.network/rpc/v0.41.4

### LCD Docs

https://osmosis.stakesystems.io/static/openapi/

### Validator Docs

https://api-osmosis.imperator.co/swagger

### Other

https://github.com/osmosis-labs/awesome#publicly-available-endpoints

https://www.notion.so/Stake-Systems-LCD-RPC-gRPC-Instances-04a99a9a9aa14247a42944931eec7024

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
