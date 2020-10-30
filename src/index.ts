/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const cbor = require('borc')
const { blake2b }  = require('cardano-crypto.js')
// import { TxAux } from './transaction/txBuilder'

const a = '82a50081825820897c3429f794c44aecbe6f2e4f292836f3153f85ce2026b86a13ecbdbadaa05700018182581d60daad04ed2b7f69e2a9be582e37091739fa036a14c1c22f88061d43c71b0055a275925d560f021a000249f00319138804818a03581c61891bbdc08431a1d4d4911903dad04705f82e29a87e54cc77db217f582092c4a889cca979e804327595768d107295ad7cb6e9a787ef6b23b757ba3433381b0000b5e620f480001a1dcd6500d81e82030a581de05e3b888f476e3634020b43079cf27437aee4432648a7580bc24a7f1281581c122a946b9ad3d2ddf029d3a828f0468aece76895f15c9efbd69b427780f6f6'

const decoded = cbor.decode(a)

// const _coins = Number(24103998870869519)
// const _address = decoded[0].get(1)[0][0]

// console.log(_coins, _address)

// console.log(decoded[0].get(1)[0][1])
// console.log(decoded[0].set(1, [[_address, _coins]]))

// const encoded = cbor.encode(decoded).toString('hex')

// console.log(encoded)

// function Output(coins, address) {
//   function encodeCBOR(encoder) {
//     return encoder.pushAny([address, coins])
//   }
//   return {
//     encodeCBOR,
//   }
// }

// const decoder = new cbor.Decoder({
//   tags: {
//     2: (val) => null,
//   },
// })

const { BigNumber } = require('bignumber.js')

const _encode = (gen, object) => {
  const bigNumHex = object.toString(16).padStart(16, '0')
  const xyz = Buffer.from(`1b${bigNumHex}`, 'hex')
  return gen.pushWrite(xyz, 0, xyz.length)
}

const encoder = new cbor.Encoder({
  genTypes: [
    [BigNumber, _encode],
  ],
})

// console.log(decoder)

// console.log(decoder.decodeFirst(Buffer.from(a, 'hex'))[0].get(1)[0][1])

// encodeBigNum()

console.log(encoder.finalize(encoder.pushAny(decoded)).toString('hex'))

// console.log(cbor.encode(Buffer.from(a, 'hex')).toString('hex'))

// console.log(encoder..encode(Output(_coins, _address)).toString('hex'))
