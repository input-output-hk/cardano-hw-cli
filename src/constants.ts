import { Network, NetworkIds } from './types'

export const NETWORKS: {[key: string]: Network} = {
  MAINNET: {
    networkId: NetworkIds.MAINNET,
    protocolMagic: 764824073,
  },
  TESTNET: {
    networkId: NetworkIds.TESTNET,
    protocolMagic: 42,
  },
}

export const DERIVATION_SCHEME = {
  type: 'v2',
  ed25519Mode: 2,
  keyfileVersion: '2.0.0',
}

export const HARDENED_THRESHOLD = 0x80000000
