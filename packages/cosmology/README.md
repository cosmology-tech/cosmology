# cosmology

```
npm install -g cosmology
```

Use `cosmology` to manage your daily rewards and investment strategies in Osmosis and the Cosmos. Make cryptocurrency trades, join liquidity pools, and stake rewards.

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
## mnemonics

There are a few methods to deal with mnemonics. 

1. plain text env var `MNEMONIC`
2. encrypted key with a salt
3. mac OSX keychain

### METHOD 1 - plain text

(Not recommended)

```sh
export MNEMONIC="action brisk disagree just bunker design wasp hand night ghost runway fluid"
# now you can run cosmology

cosmology rebalance
```

### METHOD 2 - encrypted salt via env var `ENCRYPTED_SALT`

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

## Disclaimer

AS DESCRIBED IN THE COSMOLOGY LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.