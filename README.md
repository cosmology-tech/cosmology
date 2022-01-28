# autosmosis

## TODO for demo

- UI to call driver code
- driver logic completion
- implement data fetching / cosmos calls (DriverClient)
- research what RPC methods correspond to deposit for LP, bond, and then maybe IPC out of osmosis to hold UST. The RPC method is what calls whenever you do a swap, bond, or IPC

## testing

first start the tests

```
cd ./packages/autosmosis
yarn test:watch
```

hit "p" and then type a search string to scope to your test, e.g., "keplr.bank"

## next server

if you need to edit `autosmosis` and view changes in next

```sh
cd ./packages/next
yarn dev
```

## next JS flow

if you need to edit `autosmosis` and view changes in next

```sh
cd ./packages/autosmosis
MODULE=true yarn build
```

## CLI

if you need to edit the CLI

```sh
cd ./packages/autosmosis
export MNEMONIC="mammal wrestle hybrid cart choose flee transfer filter fly object swamp rookie"
export CHAIN_ID=osmosis-testnet-0
export RPC_ENDPOINT=http://143.244.147.126:26657

yarn run dev
```

## Useful Links

https://v1.cosmos.network/rpc/v0.41.4

https://github.com/osmosis-labs/awesome#publicly-available-endpoints

https://www.notion.so/Stake-Systems-LCD-RPC-gRPC-Instances-04a99a9a9aa14247a42944931eec7024

