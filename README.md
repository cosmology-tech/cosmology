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
