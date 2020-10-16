#!/bin/bash

echo "[cardano-cli] Getting query tip and ttl"
queryTip=($(cardano-cli shelley query tip \
--mainnet \
| sed -n 4p))
ttl=$(expr ${queryTip[1]} + 3600)
echo slotNo: ${queryTip[1]}
echo ttl: ${ttl}