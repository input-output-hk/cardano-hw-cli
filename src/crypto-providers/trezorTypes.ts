/* eslint-disable camelcase */
import { BIP32Path } from '../types'

export type TrezorCertificatePointer = {
  blockIndex: number
  txIndex: number
  certificateIndex: number
}

export type TrezorInput = {
  path?: string | BIP32Path
  prev_hash: string
  prev_index: number
}

type TrezorAddressParameters = {
  addressType: number
  path: string | BIP32Path
  stakingPath?: string | BIP32Path
  stakingKeyHash?: string
  certificatePointer?: TrezorCertificatePointer
}

export type TrezorOutput =
  | {
    addressParameters: TrezorAddressParameters
    amount: string
  }
  | {
    address: string
    amount: string
  }

export type TrezorWithdrawal = {
  path: string | BIP32Path
  amount: string
}

export type TrezorPoolOwner = {
  staking_key_hash?: string;
  staking_key_path?: Array<number>;
}

export type TrezorPoolRelay = {
  type: number;
  ipv4_address?: string;
  ipv6_address?: string;
  host_name?: string;
  port?: number;
}

export type TrezorPoolMetadata = {
  url: string;
  hash: string;
}

export type TrezorPoolParameters = {
  pool_id: string
  vrf_key_hash: string
  pledge: string
  cost: string
  margin_numerator: string
  margin_denominator: string
  reward_account: string
  owners: Array<TrezorPoolOwner>
  relays: Array<TrezorPoolRelay>
  metadata: TrezorPoolMetadata
}
export type TrezorTxCertificate = {
  type: number
  path?: Array<number>
  pool?: string
  pool_parameters?: TrezorPoolParameters
}
