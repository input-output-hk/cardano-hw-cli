import { CryptoProvider } from './crypto-providers/types'
import {
  TxSignedOutput,
  write,
  HwSigningKeyOutput,
  HwVerificationKeyOutput,
  TxWitnessOutput,
} from './fileWriter'
import { TxAux } from './transaction/transaction'
import {
  ParsedKeyGenArguments,
  ParsedTransactionSignArguments,
  ParsedTransactionWitnessArguments,
  ParsedVerificationKeyArguments,
} from './types'
import { LedgerCryptoProvider } from './crypto-providers/ledgerCryptoProvider'
import { TrezorCryptoProvider } from './crypto-providers/trezorCryptoProvider'
import { validateUnsignedTx } from './crypto-providers/util'
import NamedError from './namedError'

const promiseTimeout = <T> (promise: Promise<T>, ms: number): Promise<T> => {
  const timeout: Promise<T> = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(new Error(`Promise timed out in ${ms} ms`))
    }, ms)
  })

  return Promise.race([
    promise,
    timeout,
  ])
}

const getCryptoProvider = async (): Promise<CryptoProvider> => {
  const cryptoProviderPromise = Promise.race([
    LedgerCryptoProvider(),
    TrezorCryptoProvider(),
  ])

  try {
    return await promiseTimeout(cryptoProviderPromise, 5000)
  } catch (e) {
    throw NamedError('HwTransportNotFoundError')
  }
}

const CommandExecutor = async () => {
  const cryptoProvider: CryptoProvider = await getCryptoProvider()

  // eslint-disable-next-line no-console
  const printVersion = async () => console.log(await cryptoProvider.getVersion())

  const createSigningKeyFile = async (
    { path, hwSigningFile, verificationKeyFile }: ParsedKeyGenArguments,
  ) => {
    const xPubKey = await cryptoProvider.getXPubKey(path)
    write(hwSigningFile, HwSigningKeyOutput(xPubKey, path))
    write(verificationKeyFile, HwVerificationKeyOutput(xPubKey, path))
  }

  const createVerificationKeyFile = (
    { verificationKeyFile, hwSigningFileData }: ParsedVerificationKeyArguments,
  ) => {
    write(verificationKeyFile, HwVerificationKeyOutput(
      hwSigningFileData.cborXPubKeyHex,
      hwSigningFileData.path,
    ))
  }

  const createSignedTx = async (args: ParsedTransactionSignArguments) => {
    const txAux = TxAux(args.txBodyFileData.cborHex)
    validateUnsignedTx(txAux, args.hwSigningFileData)
    const signedTx = await cryptoProvider.signTx(
      txAux, args.hwSigningFileData, args.network, args.changeOutputKeyFileData,
    )
    write(args.outFile, TxSignedOutput(signedTx))
  }

  const createTxWitness = async (args: ParsedTransactionWitnessArguments) => {
    const txAux = TxAux(args.txBodyFileData.cborHex)
    validateUnsignedTx(txAux, [args.hwSigningFileData])
    const txWitness = await cryptoProvider.witnessTx(
      txAux, args.hwSigningFileData, args.network, args.changeOutputKeyFileData,
    )
    write(args.outFile, TxWitnessOutput(txWitness))
  }

  return {
    printVersion,
    createSigningKeyFile,
    createVerificationKeyFile,
    createSignedTx,
    createTxWitness,
  }
}

export {
  CommandExecutor,
}
