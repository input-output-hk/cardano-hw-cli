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
} from './types'

const parseTxInputs = (
  txInputs: any[],
): _Input[] => txInputs.map(([txHash, outputIndex]): _Input => ({ txHash, outputIndex }))

const parseTxOutputs = (
  txOutputs: any[],
): _Output[] => txOutputs.map(([address, coins]): _Output => ({ address, coins }))

const parseRelay = (poolRelay: any): _PoolRelay => {
  const parseSingleHostIPRelay = (relay : any): _SingleHostIPRelay => {
    const [type, portNumber, ipv4, ipv6] = relay
    return {
      type,
      portNumber,
      ipv4,
      ipv6,
    }
  }
  const parseSingleHostNameRelay = (relay : any): _SingleHostNameRelay => {
    const [type, portNumber, dnsName] = relay
    return {
      type,
      portNumber,
      dnsName,
    }
  }
  const parseMultiHostNameRelay = (relay : any): _MultiHostNameRelay => {
    const [type, dnsName] = relay
    return {
      type,
      dnsName,
    }
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
    [type, [, pubKeyHash]]: any,
  ): _StakingKeyRegistrationCert => ({ type, pubKeyHash })

  const stakeKeyDeregistrationCertParser = (
    [type, [, pubKeyHash]]: any,
  ): _StakingKeyDeregistrationCert => ({ type, pubKeyHash })

  const delegationCertParser = (
    [type, [, pubKeyHash], poolHash]: any,
  ): _DelegationCert => ({ type, pubKeyHash, poolHash })

  const stakepoolRegistrationCertParser = (
    [
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
    ]: any,
  ): _StakepoolRegistrationCert => ({
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
): _Withdrawal[] => Array.from(withdrawals).map(([address, coins]): _Withdrawal => ({ address, coins }))

const parseUnsignedTx = ([txBody, meta]: _UnsignedTxDecoded): _UnsignedTxParsed => {
  const inputs = parseTxInputs(txBody.get(TxBodyKeys.INPUTS))
  const outputs = parseTxOutputs(txBody.get(TxBodyKeys.OUTPUTS))
  const fee = `${txBody.get(TxBodyKeys.FEE)}`
  const ttl = `${txBody.get(TxBodyKeys.TTL)}`
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
