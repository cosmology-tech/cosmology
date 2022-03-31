# cosmology

## testing

first start the tests

```
cd ./packages/cosmology
yarn test:watch
```

hit "p" and then type a search string to scope to your test, e.g., "keplr.bank"

## next server

if you need to edit `cosmology` and view changes in next

```sh
cd ./packages/next
yarn dev
```

## next JS flow

if you need to edit `cosmology` and view changes in next

```sh
cd ./packages/cosmology
MODULE=true yarn build
```

## CLI

if you need to edit the CLI

```sh
cd ./packages/cosmology
export MNEMONIC="mammal wrestle hybrid cart choose flee transfer filter fly object swamp rookie"
export CHAIN_ID=osmosis-testnet-0
export RPC_ENDPOINT=http://143.244.147.126:26657

yarn run dev
```

## Useful Links

### RPC Docs

https://v1.cosmos.network/rpc/v0.41.4

### LCD Docs

https://osmosis.stakesystems.io/static/openapi/

### Validator Docs

https://api-osmosis.imperator.co/swagger

### Other

https://github.com/osmosis-labs/awesome#publicly-available-endpoints

https://www.notion.so/Stake-Systems-LCD-RPC-gRPC-Instances-04a99a9a9aa14247a42944931eec7024

## other notes

Why do we sometimes use imperator validator API and sometimes the LCD Rest API?

> Iirc the reason there are two apr elements in the imperator return is bc one is swap fees and internal incentives and the other external incentives. But you'd have to double check that. Also you can't get total gamm for all pools with LCD, bc of a bug on early pools, so add a state export to your tool bag. 

> just to clarify, the api from imperator is custom. This is not something that a normal node would be capable of displaying out of the box
