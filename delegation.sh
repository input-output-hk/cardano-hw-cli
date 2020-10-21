#!/bin/bash

export CARDANO_NODE_SOCKET_PATH=/home/david/cnode/sockets/node.socket

echo "[cardano-cli] Creating protocol.json"
cardano-cli shelley query protocol-parameters \
--mainnet \
--out-file protocol.json
echo ""
read -n 1 -s -r -p ""

echo "[cardano-hw-cli] Creating payment files"
sudo ./cardano-hw-cli shelley address key-gen \
--path 1852H/1815H/0H/0/0 \
--verification-key-file payment.vkey \
--hw-signing-file payment.hwsfile
echo ""
read -n 1 -s -r -p ""

echo "[cardano-hw-cli] Creating stake files"
sudo ./cardano-hw-cli shelley address key-gen \
--path 1852H/1815H/0H/2/0 \
--verification-key-file stake.vkey \
--hw-signing-file stake.hwsfile
echo ""
read -n 1 -s -r -p ""

echo "[cardano-hw-cli] Building address file"
cardano-cli shelley address build \
--payment-verification-key-file payment.vkey \
--stake-verification-key-file stake.vkey \
--out-file payment.addr \
--mainnet
echo ""
read -n 1 -s -r -p ""

echo "[cardano-hw-cli] Get utxos"
utxo=$(cardano-cli shelley query utxo \
--address $(cat payment.addr) \
--mainnet \
| sed -n 3p \
| sed 's/ \+/ /g')
utxoArr=($utxo)
utxoAddress=${utxoArr[0]}
utxoIndex=${utxoArr[1]}
utxoAmount=${utxoArr[2]}
echo utxoAddress: $utxoAddress
echo utxoIndex: $utxoIndex
echo utxoAmount: $utxoAmount
echo ""
read -n 1 -s -r -p ""

fee=190000
utxoSend=$(expr ${utxoAmount} - ${fee})

echo "[cardano-cli] Getting query tip and ttl"
queryTip=($(cardano-cli shelley query tip \
--mainnet \
| sed -n 4p))
ttl=$(expr ${queryTip[1]} + 3600)
echo slotNo: ${queryTip[1]}
echo ttl: ${ttl}
echo ""
read -n 1 -s -r -p ""

echo "[cardano-cli] Create delegation cert"
cardano-cli shelley stake-address delegation-certificate \
--staking-verification-key-file stake.vkey \
--stake-pool-verification-key-file cold.vkey \
--out-file delegation.cert
echo ""
read -n 1 -s -r -p ""

echo "[cardano-cli] Building tx.raw"
cardano-cli shelley transaction build-raw \
--tx-in ${utxoAddress}\#${utxoIndex} \
--tx-out $(cat payment.addr)+${utxoSend} \
--certificate-file delegation.cert \
--ttl ${ttl} \
--fee ${fee} \
--out-file tx.raw
echo ""
read -n 1 -s -r -p ""

echo "[cardano-hw-cli] Signing transaction"
sudo ./cardano-hw-cli shelley transaction sign \
--tx-body-file tx.raw \
--hw-signing-file payment.hwsfile \
--hw-signing-file stake.hwsfile \
--mainnet \
--out-file tx.signed
echo ""
