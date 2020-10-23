# Usage
For running commands with ledger, you might need to use `sudo`

## Generate public verification key and hardware wallet signing file
```
cardano-hw-cli shelley address key-gen
--path PATH                     Derivation path to the key we want to sign with.
--verification-key-file FILE    Output filepath of the verification key.
--hw-signing-file FILE          Output filepath of the hardware wallet signing file.
```

## Generate public verification key
```
cardano-hw-cli shelley key verification-key
--hw-signing-file FILE          Input filepath of the hardware wallet signing file.
--verification-key-file FILE    Output filepath of the verification key.
```

## Sign transaction
```
cardano-hw-cli shelley transaction sign
--tx-body-file FILE                    Input filepath of the TxBody.
--hw-signing-file FILE                 Input filepath of the hardware wallet signing file (one or more).
--change-output-key-file FILE          Input filepath of the hardware wallet signing file.
--mainnet | --testnet-magic NATURAL    Use the mainnet magic id or specify testnet magic id.
--out-file FILE                        Output filepath of the Tx.
```

## Witness transaction
```
cardano-hw-cli shelley transaction sign
--tx-body-file FILE                    Input filepath of the TxBody.
--hw-signing-file FILE                 Input filepath of the hardware wallet signing file.
--change-output-key-file File          Input filepath of the hardware wallet signing file.
--mainnet | --testnet-magic NATURAL    Use the mainnet magic id or specify testnet magic id.
--out-file FILE                        Output filepath of the Tx.
```

# Show address on device
```
cardano-hw-cli shelley address show 
  --payment-path PAYMENTPATH    Payment derivation path.
  --staking-path STAKINGPATH    Stake derivation path.
  --address-file ADDRESS        Input filepath of the address.
```

## Check device version
```
cardano-hw-cli device version
```

# Related links
Read https://docs.google.com/document/d/1AqBsMkKT3V2dOEWYyH9cvrHoXEcHkQs1CfQfEXaVv3Q to learn more about hardware wallet signing files.