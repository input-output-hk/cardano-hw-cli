/* eslint-disable max-len */
const assert = require('assert')
const { TxAux } = require('../../../../src/transaction/transaction')
const { LedgerCryptoProvider } = require('../../../../src/crypto-providers/ledgerCryptoProvider')
const { NETWORKS, HARDENED_THRESHOLD } = require('../../../../src/constants')

const signingFiles = {
  payment0: {
    type: 0,
    path: [
      1852 + HARDENED_THRESHOLD,
      1815 + HARDENED_THRESHOLD,
      0 + HARDENED_THRESHOLD,
      0,
      0,
    ],
    cborXPubKeyHex: '5840cd2b047d1a803eee059769cffb3dfd0a4b9327e55bc78aa962d9bd4f720db0b2914ba07fb381f23c5c09bce26587bdf359aab7ea8f4192adbf93a38fd893ccea',
  },
  stake0: {
    type: 1,
    path: [
      1852 + HARDENED_THRESHOLD,
      1815 + HARDENED_THRESHOLD,
      0 + HARDENED_THRESHOLD,
      2,
      0,
    ],
    cborXPubKeyHex: '584066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e8e977e956d29810dbfbda9c8ea667585982454e401c68578623d4b86bc7eb7b58',
  },
}

const transactions = {
  SimpleTransaction: {
    unsignedCborHex: '82a40081825820941a33cf9d39bba4102c4eff8bd54efd72cf93e65a023a4475ba48a58fc0de000001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a002b2b4b021a00029b75031a00a8474cf6',
    hwSigningFiles: [signingFiles.payment0],
    signedTxCborHex: '83a40081825820941a33cf9d39bba4102c4eff8bd54efd72cf93e65a023a4475ba48a58fc0de000001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a002b2b4b021a00029b75031a00a8474ca10081825820cd2b047d1a803eee059769cffb3dfd0a4b9327e55bc78aa962d9bd4f720db0b2584093cbb49246dffb2cb2ca2c18e75039bdb4f80730bb9478045c4b8ef5494145a71bd59a478df4ec0dd22e78c9fc919918f4404115fafb10fa4f218b269d3e220af6',
    witnessCborHex: '82f7825820cd2b047d1a803eee059769cffb3dfd0a4b9327e55bc78aa962d9bd4f720db0b2584093cbb49246dffb2cb2ca2c18e75039bdb4f80730bb9478045c4b8ef5494145a71bd59a478df4ec0dd22e78c9fc919918f4404115fafb10fa4f218b269d3e220a',
  },
  WithWithdrawal: {
    unsignedCborHex: '82a50081825820bc8bf52ea894fb8e442fe3eea628be87d0c9a37baef185b70eb00a5c8a849d3b0001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a00311cba021a0002c431031a00ac30b105a1581de11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a000ded3af6',
    hwSigningFiles: [signingFiles.payment0, signingFiles.stake0],
    signedTxCborHex: '83a50081825820bc8bf52ea894fb8e442fe3eea628be87d0c9a37baef185b70eb00a5c8a849d3b0001818258390114c16d7f43243bd81478e68b9db53a8528fd4fb1078d58d54a7f11241d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a00311cba021a0002c431031a00ac30b105a1581de11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c1a000ded3aa10082825820cd2b047d1a803eee059769cffb3dfd0a4b9327e55bc78aa962d9bd4f720db0b25840501a09efd212efd741574e63e9ff6c701746cac68ddcba3af5ef655ff1e724399adef1eb258ffdb34fd09d7b91c4b2f612bfba083b2debaa87ed93fcf4bc1f0882582066610efd336e1137c525937b76511fbcf2a0e6bcf0d340a67bcb39bc870d85e85840eeb76938fd9676a34ba0710dc27810d087507b3a75ac6f67543b0b22405c927ad9f575a258aa7ed1dd1bbf3d24596315ffba8d630e0a1ea8d105826b865b3808f6',
    witnessCborHex: '',
  },
}

async function testTxSigning(cryptoProvider, transaction) {
  const txAux = TxAux(transaction.unsignedCborHex)
  const signedTxCborHex = await cryptoProvider.signTx(
    txAux,
    transaction.hwSigningFiles,
    NETWORKS.MAINNET,
  )
  assert.deepStrictEqual(signedTxCborHex, transaction.signedTxCborHex)
}

describe('Ledger tx signing', () => {
  let cryptoProvider
  before(async () => {
    cryptoProvider = await LedgerCryptoProvider()
  })
  Object.entries(transactions).forEach(([txType, tx]) => it(
    txType, async () => testTxSigning(cryptoProvider, tx),
  ).timeout(100000))
})
