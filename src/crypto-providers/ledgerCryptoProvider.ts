import { DERIVATION_SCHEME } from '../constants'
import NamedError from '../namedError'
import {
  TxByronWitness,
  TxShelleyWitness,
  TxSigned,
  XPubKey,
} from '../transaction/transaction'
import {
  _Input,
  _Output,
  SignedTxCborHex,
  _TxAux,
  _ByronWitness,
  _ShelleyWitness,
  TxWitnessByron,
  TxWitnessShelley,
  XPubKeyHex,
  _Certificate,
  TxCertificateKeys,
  _Withdrawal,
} from '../transaction/types'
import {
  Address,
  BIP32Path,
  HwSigningData,
  Network,
} from '../types'
import {
  isDelegationCertificate,
  isStakepoolRegistrationCertificate,
  isStakingKeyDeregistrationCertificate,
  isStakingKeyRegistrationCertificate,
} from './guards'
import {
  LedgerCertificate,
  LedgerInput,
  LedgerOutput,
  LedgerWithdrawal,
  LedgerWitness,
} from './ledgerTypes'
import { CryptoProvider, _AddressParameters } from './types'
import {
  filterSigningFiles,
  findSigningPath,
  getChangeAddress,
  getSigningPath,
  isShelleyPath,
  getAddressAttributes,
} from './util'

const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default
const Ledger = require('@cardano-foundation/ledgerjs-hw-app-cardano').default
const deriveChildXpub = require('cardano-crypto.js').derivePublic

export const LedgerCryptoProvider: () => Promise<CryptoProvider> = async () => {
  const transport = await TransportNodeHid.create()
  const ledger = new Ledger(transport)

  const getVersion = async (): Promise<string> => {
    const { major, minor, patch } = await ledger.getVersion()
    return `Ledger app version ${major}.${minor}.${patch}`
  }

  const showAddress = async (
    paymentPath: BIP32Path, stakingPath: BIP32Path, address: Address,
  ): Promise<void> => {
    try {
      const { addressType, networkId } = getAddressAttributes(address)
      await ledger.showAddress(addressType, networkId, paymentPath, stakingPath)
    } catch (err) {
      throw NamedError('LedgerOperationError', { message: `${err.name}: ${err.message}` })
    }
  }

  const prepareInput = (input: _Input, path?: BIP32Path): LedgerInput => ({
    path,
    txHashHex: input.txHash.toString('hex'),
    outputIndex: input.outputIndex,
  })

  const prepareChangeOutput = (
    coins: number,
    changeOutput: _AddressParameters,
  ): LedgerOutput => ({
    addressTypeNibble: changeOutput.addressType, // TODO: get from address
    spendingPath: changeOutput.paymentPath,
    amountStr: `${coins}`,
    stakingPath: changeOutput.stakePath,
  })

  const prepareOutput = (
    output: _Output,
    changeOutputFiles: HwSigningData[],
    network: Network,
  ): LedgerOutput => {
    const changeAddress = getChangeAddress(changeOutputFiles, output.address, network)
    if (changeAddress && !changeAddress.address.compare(output.address)) {
      return prepareChangeOutput(output.coins, changeAddress)
    }
    return {
      amountStr: `${output.coins}`,
      addressHex: output.address.toString('hex'),
    }
  }

  const prepareStakingKeyRegistrationCert = (
    cert: _Certificate, stakeSigningFiles: HwSigningData[],
  ): LedgerCertificate => {
    if (
      !isStakingKeyRegistrationCertificate(cert) && !isStakingKeyDeregistrationCertificate(cert)
    ) throw Error()
    const path = findSigningPath(cert.pubKeyHash, stakeSigningFiles)
    return {
      type: cert.type,
      path,
    }
  }

  const prepareDelegationCert = (
    cert: _Certificate, stakeSigningFiles: HwSigningData[],
  ): LedgerCertificate => {
    if (!isDelegationCertificate(cert)) throw Error()
    const path = findSigningPath(cert.pubKeyHash, stakeSigningFiles)
    return {
      type: cert.type,
      path,
      poolKeyHashHex: cert.poolHash.toString('hex'),
    }
  }

  const prepareStakePoolRegistrationCert = (
    cert: _Certificate, stakeSigningFiles: HwSigningData[],
  ): LedgerCertificate => {
    if (!isStakepoolRegistrationCertificate(cert)) throw Error()
    const path = findSigningPath(cert.ownerPubKeys[0], stakeSigningFiles)
    // TODO: we need to iterate through the owner pubkeys
    return { // TODO: proper pool reg cert
      type: cert.type,
      path,
    }
  }

  const prepareCertificate = (
    certificate: _Certificate, stakeSigningFiles: HwSigningData[],
  ): LedgerCertificate => {
    switch (certificate.type) {
      case TxCertificateKeys.STAKING_KEY_REGISTRATION:
        return prepareStakingKeyRegistrationCert(certificate, stakeSigningFiles)
      case TxCertificateKeys.STAKING_KEY_DEREGISTRATION:
        return prepareStakingKeyRegistrationCert(certificate, stakeSigningFiles)
      case TxCertificateKeys.DELEGATION:
        return prepareDelegationCert(certificate, stakeSigningFiles)
      case TxCertificateKeys.STAKEPOOL_REGISTRATION:
        return prepareStakePoolRegistrationCert(certificate, stakeSigningFiles)
      default:
        throw Error('UnknownCertificateError')
    }
  }

  const prepareWithdrawal = (
    withdrawal: _Withdrawal, stakeSigningFiles: HwSigningData[],
  ): LedgerWithdrawal => {
    const pubKeyHash = withdrawal.address.slice(1)
    const path = findSigningPath(pubKeyHash, stakeSigningFiles)
    return {
      path,
      amountStr: `${withdrawal.coins}`,
    }
  }

  const ledgerSignTx = async (
    txAux: _TxAux, signingFiles: HwSigningData[], network: Network, changeOutputFiles: HwSigningData[],
  ): Promise<LedgerWitness[]> => {
    const { paymentSigningFiles, stakeSigningFiles } = filterSigningFiles(signingFiles)
    const inputs = txAux.inputs.map((input, i) => prepareInput(input, getSigningPath(paymentSigningFiles, i)))
    const outputs = txAux.outputs.map(
      (output) => prepareOutput(output, changeOutputFiles, network),
    )
    const certificates = txAux.certificates.map(
      (certificate) => prepareCertificate(certificate, stakeSigningFiles),
    )
    const { fee } = txAux
    const { ttl } = txAux
    const withdrawals = txAux.withdrawals.map(
      (withdrawal) => prepareWithdrawal(withdrawal, stakeSigningFiles),
    )

    const response = await ledger.signTransaction(
      network.networkId,
      network.protocolMagic,
      inputs,
      outputs,
      fee,
      ttl,
      certificates,
      withdrawals,
    )

    if (response.txHashHex !== txAux.getId()) {
      throw NamedError('TxSerializationMismatchError')
    }

    return response.witnesses.map((witness: any) => ({
      path: witness.path,
      signature: Buffer.from(witness.witnessSignatureHex, 'hex'),
    }))
  }

  const createWitnesses = async (ledgerWitnesses: LedgerWitness[], signingFiles: HwSigningData[]): Promise<{
    byronWitnesses: TxWitnessByron[]
    shelleyWitnesses: TxWitnessShelley[]
  }> => {
    const pathEquals = (
      path1: BIP32Path, path2: BIP32Path,
    ) => path1.every((element, i) => element === path2[i])

    const getSigningFileDataByPath = (
      path: BIP32Path,
    ): HwSigningData => {
      const hwSigningData = signingFiles.find((signingFile) => pathEquals(signingFile.path, path))
      if (hwSigningData) return hwSigningData
      throw NamedError('MissingHwSigningDataAtPathError', { message: path.toString() })
    }

    const byronWitnesses = ledgerWitnesses
      .filter((witness) => !isShelleyPath(witness.path))
      .map((witness) => {
        const { cborXPubKeyHex } = getSigningFileDataByPath(witness.path)
        const { pubKey, chainCode } = XPubKey(cborXPubKeyHex)
        return TxByronWitness(pubKey, witness.signature, chainCode, {})
      })

    const shelleyWitnesses = ledgerWitnesses
      .filter((witness) => isShelleyPath(witness.path))
      .map((witness) => {
        const { cborXPubKeyHex } = getSigningFileDataByPath(witness.path)
        const { pubKey } = XPubKey(cborXPubKeyHex)
        return TxShelleyWitness(pubKey, witness.signature)
      })

    return { byronWitnesses, shelleyWitnesses }
  }

  const signTx = async (
    txAux: _TxAux, signingFiles: HwSigningData[], network: Network, changeOutputFiles: HwSigningData[],
  ): Promise<SignedTxCborHex> => {
    const ledgerWitnesses = await ledgerSignTx(txAux, signingFiles, network, changeOutputFiles)
    const { byronWitnesses, shelleyWitnesses } = await createWitnesses(ledgerWitnesses, signingFiles)
    return TxSigned(txAux.unsignedTxDecoded, byronWitnesses, shelleyWitnesses)
  }

  const witnessTx = async (
    txAux: _TxAux, signingFiles: HwSigningData, network: Network, changeOutputFiles: HwSigningData[],
  ): Promise<_ShelleyWitness | _ByronWitness> => {
    const ledgerWitnesses = await ledgerSignTx(txAux, [signingFiles], network, changeOutputFiles)
    const { byronWitnesses, shelleyWitnesses } = await createWitnesses(ledgerWitnesses, [signingFiles])
    const _byronWitnesses = byronWitnesses.map((byronWitness) => ({ data: byronWitness }) as _ByronWitness)
    const _shelleyWitnesses = shelleyWitnesses.map((shelleyWitness) => (
      { data: shelleyWitness }
    ) as _ShelleyWitness)

    if (_byronWitnesses.length + _shelleyWitnesses.length !== 1) throw NamedError('MultipleWitnessesError')
    return _shelleyWitnesses.length === 1 ? _shelleyWitnesses[0] : _byronWitnesses[0]
  }

  const getXPubKey = async (path: BIP32Path): Promise<XPubKeyHex> => {
    const parentPath = path.slice(0, 3)
    const childPath = path.slice(3)
    const parentXPubKey = await ledger.getExtendedPublicKey(parentPath)

    const derivedXPubKey = childPath.reduce((xPubKey, index) => deriveChildXpub(
      xPubKey,
      index,
      DERIVATION_SCHEME.ed25519Mode,
    ), Buffer.from(parentXPubKey.publicKeyHex + parentXPubKey.chainCodeHex, 'hex')).toString('hex')

    const publicKeyHex = derivedXPubKey.slice(0, 32)
    const chainCodeHex = derivedXPubKey.slice(32)

    return publicKeyHex + chainCodeHex
  }

  return {
    getVersion,
    showAddress,
    signTx,
    witnessTx,
    getXPubKey,
  }
}
