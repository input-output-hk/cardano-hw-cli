import { isArrayOfType } from '../guards'
import NamedError from '../namedError'
import {
  isDelegationCert,
  isStakepoolRegistrationCert,
  isStakingKeyDeregistrationCert,
  isTxInput,
  isTxMultiHostNameRelay,
  isTxOutput,
  isTxSingleHostIPRelay,
  isTxSingleHostNameRelay,
  isTxStakingKeyRegistrationCert,
  isWithdrawalsMap,
} from './guards'
import {
  _Input,
  _Output,
  _DelegationCert,
  _StakingKeyRegistrationCert,
  _StakingKeyDeregistrationCert,
  _StakepoolRegistrationCert,
  _Withdrawal,
  _UnsignedTxDecoded,
  _UnsignedTxParsed,
  TxBodyKeys,
  TxCertificateKeys,
  _Certificate,
  TxRelayTypes,
  _PoolRelay,
  _SingleHostIPRelay,
  _SingleHostNameRelay,
  _MultiHostNameRelay,
  TxInput,
  TxOutput,
} from './types'

const parseTxInputs = (
  txInputs: any[],
): _Input[] => {
  if (isArrayOfType<TxInput>(txInputs, isTxInput)) {
    return txInputs.map(([txHash, outputIndex]): _Input => ({ txHash, outputIndex }))
  }
  throw NamedError('TxInputParseError')
}

const parseTxOutputs = (
  txOutputs: any[],
): _Output[] => {
  if (isArrayOfType<TxOutput>(txOutputs, isTxOutput)) {
    return txOutputs.map(([address, coins]): _Output => ({ address, coins }))
  }
  throw NamedError('TxOutputParseError')
}

const parseRelay = (poolRelay: any): _PoolRelay => {
  const parseSingleHostIPRelay = (relay : any): _SingleHostIPRelay => {
    if (isTxSingleHostIPRelay(relay)) {
      const [type, portNumber, ipv4, ipv6] = relay
      return {
        type,
        portNumber,
        ipv4,
        ipv6,
      }
    }
    throw NamedError('TxSingleHostIPRelayParseError')
  }
  const parseSingleHostNameRelay = (relay : any): _SingleHostNameRelay => {
    if (isTxSingleHostNameRelay(relay)) {
      const [type, portNumber, dnsName] = relay
      return {
        type,
        portNumber,
        dnsName,
      }
    }
    throw NamedError('TxSingleHostNameRelayParseError')
  }
  const parseMultiHostNameRelay = (relay : any): _MultiHostNameRelay => {
    if (isTxMultiHostNameRelay(relay)) {
      const [type, dnsName] = relay
      return {
        type,
        dnsName,
      }
    }
    throw NamedError('TxMultiHostNameRelayParseError')
  }
  switch (poolRelay[0]) {
    case TxRelayTypes.SINGLE_HOST_IP:
      return parseSingleHostIPRelay(poolRelay)
    case TxRelayTypes.SINGLE_HOST_NAME:
      return parseSingleHostNameRelay(poolRelay)
    case TxRelayTypes.MULTI_HOST_NAME:
      return parseMultiHostNameRelay(poolRelay)
    default: throw Error('Unsupported relay type')
  }
}

const parseTxCerts = (txCertificates: any[]): _Certificate[] => {
  const stakeKeyRegistrationCertParser = (
    txCertificate: any,
  ): _StakingKeyRegistrationCert => {
    if (isTxStakingKeyRegistrationCert(txCertificate)) {
      const [type, [, pubKeyHash]] = txCertificate
      return ({ type, pubKeyHash })
    }
    throw NamedError('TxStakingKeyRegistrationCertParseError')
  }

  const stakeKeyDeregistrationCertParser = (
    txCertificate: any,
  ): _StakingKeyDeregistrationCert => {
    if (isStakingKeyDeregistrationCert(txCertificate)) {
      const [type, [, pubKeyHash]] = txCertificate
      return ({ type, pubKeyHash })
    }
    throw NamedError('TxStakingKeyDeregistrationCertParseError')
  }

  const delegationCertParser = (
    txCertificate: any,
  ): _DelegationCert => {
    if (isDelegationCert(txCertificate)) {
      const [type, [, pubKeyHash], poolHash] = txCertificate
      return ({ type, pubKeyHash, poolHash })
    }
    throw NamedError('TxDelegationCertParseError')
  }

  const stakepoolRegistrationCertParser = (
    txCertificate: any,
  ): _StakepoolRegistrationCert => {
    if (isStakepoolRegistrationCert(txCertificate)) {
      const [
        type,
        poolKeyHash,
        vrfPubKeyHash,
        pledge,
        cost,
        { value },
        rewardAddress,
        poolOwnersPubKeyHashes,
        relays,
        [metadataUrl, metadataHash],
      ] = txCertificate
      return ({
        type,
        poolKeyHash,
        vrfPubKeyHash,
        pledge,
        cost,
        margin: { numerator: value[0], denominator: value[1] }, // tagged
        rewardAddress,
        poolOwnersPubKeyHashes,
        relays: relays.map(parseRelay),
        metadata: { metadataUrl, metadataHash },
      })
    }
    throw NamedError('TxStakepoolRegistrationCertParseError')
  }

  const parseTxCert = (cert: any) => {
    switch (cert[0]) {
      case TxCertificateKeys.STAKING_KEY_REGISTRATION:
        return stakeKeyRegistrationCertParser(cert)
      case TxCertificateKeys.STAKING_KEY_DEREGISTRATION:
        return stakeKeyDeregistrationCertParser(cert)
      case TxCertificateKeys.DELEGATION:
        return delegationCertParser(cert)
      case TxCertificateKeys.STAKEPOOL_REGISTRATION:
        return stakepoolRegistrationCertParser(cert)
      default: throw Error('Unsupported certificate type')
    }
  }

  return txCertificates.map(
    (certificate) => parseTxCert(certificate),
  )
}

const parseTxWithdrawals = (
  withdrawals: Map<Buffer, number>,
): _Withdrawal[] => {
  if (isWithdrawalsMap(withdrawals)) {
    return Array.from(withdrawals).map(([address, coins]): _Withdrawal => ({ address, coins }))
  }
  throw NamedError('WithrawalsParseError')
}

const parseUnsignedTx = ([txBody, meta]: _UnsignedTxDecoded): _UnsignedTxParsed => {
  const inputs = parseTxInputs(txBody.get(TxBodyKeys.INPUTS))
  const outputs = parseTxOutputs(txBody.get(TxBodyKeys.OUTPUTS))
  const fee = txBody.get(TxBodyKeys.FEE) as number
  const ttl = txBody.get(TxBodyKeys.TTL) as number
  const certificates = parseTxCerts(
    txBody.get(TxBodyKeys.CERTIFICATES) || [],
  )
  const withdrawals = parseTxWithdrawals(
    txBody.get(TxBodyKeys.WITHDRAWALS) || new Map(),
  )
  const metaDataHash = txBody.get(TxBodyKeys.META_DATA_HASH) as Buffer
  return {
    inputs,
    outputs,
    fee,
    ttl,
    certificates,
    withdrawals,
    metaDataHash,
    meta,
  }
}

export {
  parseUnsignedTx,
}
