#!/bin/bash

PROTO_PATH=./protobuf
OUT_DIR=./out/proto

# FILES=`find protobuf/osmosis -type f -name "*.proto"`

FILES="protobuf/osmosis/mint/v1beta1/query.proto protobuf/osmosis/mint/v1beta1/genesis.proto protobuf/osmosis/mint/v1beta1/mint.proto protobuf/osmosis/incentives/tx.proto protobuf/osmosis/incentives/gauge.proto protobuf/osmosis/incentives/query.proto protobuf/osmosis/incentives/genesis.proto protobuf/osmosis/incentives/params.proto protobuf/osmosis/gamm/pool-models/balancer/balancerPool.proto protobuf/osmosis/gamm/v1beta1/tx.proto protobuf/osmosis/gamm/v1beta1/query.proto protobuf/osmosis/gamm/v1beta1/genesis.proto protobuf/osmosis/superfluid/tx.proto protobuf/osmosis/superfluid/gov.proto protobuf/osmosis/superfluid/query.proto protobuf/osmosis/superfluid/genesis.proto protobuf/osmosis/superfluid/superfluid.proto protobuf/osmosis/superfluid/params.proto protobuf/osmosis/epochs/query.proto protobuf/osmosis/epochs/genesis.proto protobuf/osmosis/txfees/v1beta1/gov.proto protobuf/osmosis/txfees/v1beta1/feetoken.proto protobuf/osmosis/txfees/v1beta1/query.proto protobuf/osmosis/txfees/v1beta1/genesis.proto protobuf/osmosis/pool-incentives/v1beta1/gov.proto protobuf/osmosis/pool-incentives/v1beta1/incentives.proto protobuf/osmosis/pool-incentives/v1beta1/query.proto protobuf/osmosis/pool-incentives/v1beta1/genesis.proto protobuf/osmosis/lockup/tx.proto protobuf/osmosis/lockup/query.proto protobuf/osmosis/lockup/genesis.proto protobuf/osmosis/lockup/lock.proto protobuf/osmosis/claim/v1beta1/claim.proto protobuf/osmosis/claim/v1beta1/query.proto protobuf/osmosis/claim/v1beta1/genesis.proto protobuf/osmosis/claim/v1beta1/params.proto protobuf/osmosis/store/v1beta1/tree.proto"

# when running files as the input, I was getting this error, so I instead created a for loop
# osmosis/gamm/v1beta1/tx.proto:9:9: "osmosis.gamm.v1beta1.Msg" is already defined in file "osmosis/gamm/pool-models/balancer/tx.proto".
# FILES=protobuf/osmosis/gamm/v1beta1/tx.proto

# echo $FILES;

protoc \
    --plugin="./node_modules/.bin/protoc-gen-ts_proto" \
    --ts_proto_out="${OUT_DIR}" \
    --proto_path="${PROTO_PATH}" \
    --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=true" \
    ${FILES}

# mkdir -p ${OUT_DIR}


# # --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=true,outputTypeRegistry=true,outputSchema=true" \

# for x in ${FILES}
# do
# protoc \
#     --plugin="./node_modules/.bin/protoc-gen-ts_proto" \
#     --ts_proto_out="${OUT_DIR}" \
#     --proto_path="${PROTO_PATH}" \
#     --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=true" \
#     ${x}    
# done
