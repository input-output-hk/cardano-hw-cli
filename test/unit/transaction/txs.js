/* eslint-disable max-len */
const transactions = {
  TxWithWithdrawal: {
    /*
    * txBody: a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aa
    * d1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1
    * a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a05a1581de11d227aefa4b77314917088
    * 5aadba30aab3127cc611ddbc4999def61c186f
    */
    unsignedCborHex: '82a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a05a1581de11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c186ff6',
    hashHex: 'dfc63f395fba4bbf8d3507d05c455f0db7d85d0cabdd6f033c6112d6c32a6b93',
    parsed: {
      inputs: [
        {
          txHash: Buffer.from('3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7', 'hex'),
          outputIndex: 0,
        },
      ],
      outputs: [
        {
          address: Buffer.from(
            '82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c2561',
            'hex',
          ),
          coins: 3003112,
        },
      ],
      fee: 42,
      ttl: 10,
      certificates: [],
      withdrawals: [
        {
          address: Buffer.from('e11d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c', 'hex'),
          coins: 111,
        },
      ],
      metaDataHash: undefined,
      meta: null,
    },
    // witnesses: [
    //   {
    //     path: str_to_path("1852'/1815'/0'/0/0"),
    //     witnessSignatureHex:
    //       "22ef3b54a54a1f5390436911b23328225f92c660eb251189fceab2fa428187a2cec584ea5f6f9c9fcdf7f19bc496b3b2b9bb416ad07a3d31d73fbc0c05bec10c"
    //   },
    //   {
    //     path: str_to_path("1852'/1815'/0'/2/0"),
    //     witnessSignatureHex:
    //       "04b995979c2072b469c1e0ace5331c3d188e3e65d5a6f06aa4e608fb18a3588621370ee1b5d39d55afe0744aa4906785baa07210dc4cb49594eba507f7215102",
    //   }
    // ]
  },
  TxWithRegistrationCertificate: {
    /*
    * txBody: a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163
    * f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2
    * e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182008200581c1d227aefa4b77
    * 3149170885aadba30aab3127cc611ddbc4999def61c
    */
    unsignedCborHex: '82a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182008200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61cf6',
    hashHex: '15116b11165fe2dad588fe87ae64211ded6d47a5ac29c6b8c5e5008a820fe73a',
    parsed: {
      inputs: [
        {
          txHash: Buffer.from('1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc', 'hex'),
          outputIndex: 0,
        },
      ],
      outputs: [
        {
          address: Buffer.from('82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c2561', 'hex'),
          coins: 3003112,
        },
      ],
      fee: 42,
      ttl: 10,
      certificates: [{
        type: 0,
        pubKeyHash: Buffer.from('1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c', 'hex'),
      }],
      withdrawals: [],
      metaDataHash: undefined,
      meta: null,
    },
    // witnesses: [
    //   {
    //     path: str_to_path("1852'/1815'/0'/0/0"),
    //     witnessSignatureHex:
    //       "9825594e5a91333b9f5762665ba316af34c2208bd7ef073178af5e48f2aae8673d50436045e292d5bb9be7492eeeda475a04e58621a326c91049a2ef26a33200"
    //   },
    //   {
    //     path: str_to_path("1852'/1815'/0'/2/0"),
    //     witnessSignatureHex:
    //       "a2a22faa4ac4ba4b5a89c770dd7b2afe877ba8c86f0205df8c01a2184275aaafada9b6be4640aa573cafbbca26ac2eccd98f804065b39b10a0559c7dc441fa0a",
    //   }
    // ]
  },
  TxWithDelegationCertificate: {
    /*
    * txBody: a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163
    * f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2
    * e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048183028200581c1d227aefa4b77
    * 3149170885aadba30aab3127cc611ddbc4999def61c581cf61c42cbf7c8c53af3f520508212ad
    * 3e72f674f957fe23ff0acb4973
    */
    unsignedCborHex: '82a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048183028200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581cf61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973f6',
    hashHex: '17c2cf344736b8f4dbbd7f0b57ec13cee79f77fb4df7b32d859d26efbffe918c',
    parsed: {
      inputs: [
        {
          txHash: Buffer.from('1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc', 'hex'),
          outputIndex: 0,
        },
      ],
      outputs: [
        {
          address: Buffer.from('82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c2561', 'hex'),
          coins: 3003112,
        },
      ],
      fee: 42,
      ttl: 10,
      certificates: [{
        type: 2,
        pubKeyHash: Buffer.from('1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c', 'hex'),
        poolHash: Buffer.from('f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973', 'hex'),
      }],
      withdrawals: [],
      metaDataHash: undefined,
      meta: null,
    },
    // witnesses: [
    //   {
    //     path: str_to_path("1852'/1815'/0'/0/0"),
    //     witnessSignatureHex:
    //       "d94c8f8fe73946c25f3bd0919d05a60b8373ef0a7261fa73eefe1f2a20e8a4c3401feb5eea701222184fceab2c45b47bd823ac76123e2d17f804d3e4ed2df909"
    //   },
    //   {
    //     path: str_to_path("1852'/1815'/0'/2/0"),
    //     witnessSignatureHex:
    //       "035b4e6ae6f7a8089f2a302ddcb60bc56d48bcf267fdcb071844da5ce3086d51e816777a6fb5eabfcb326a32b830674ac0de40ee1b2360a69adba4b64c662404",
    //   }
    // ]
  },
  TxWithDeregistrationCertificate: {
    /*
    * txBody: a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163
    * f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2
    * e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182018200581c1d227aefa4b77
    * 3149170885aadba30aab3127cc611ddbc4999def61c
    */
    unsignedCborHex: '82a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a048182018200581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61cf6',
    hashHex: 'ef78852e3f95bf812a6974b1534831672d314a92cb947f5122345e7a1acadd7d',
    parsed: {
      inputs: [
        {
          txHash: Buffer.from('1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc', 'hex'),
          outputIndex: 0,
        },
      ],
      outputs: [
        {
          address: Buffer.from('82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c2561', 'hex'),
          coins: 3003112,
        },
      ],
      fee: 42,
      ttl: 10,
      certificates: [{
        type: 1,
        pubKeyHash: Buffer.from('1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c', 'hex'),
      }],
      withdrawals: [],
      metaDataHash: undefined,
      meta: null,
    },
    // witnesses: [
    //   {
    //     path: str_to_path("1852'/1815'/0'/0/0"),
    //     witnessSignatureHex:
    //       "6136510eb91449474f6137c8d1c7c69eb518e3844a3e63a626be8cf4af91afa24e12f4fa578398bf0e7992e22dcfc5f9773fb8546b88c19e3abfdaa3bbe7a304"
    //   },
    //   {
    //     path: str_to_path("1852'/1815'/0'/2/0"),
    //     witnessSignatureHex:
    //       "77210ce6533a76db3673af1076bf3933747a8d81cabda80c8bc9c852c78685f8a42c9372721bdfe9b47611039364afb3391031211b5c427cfec0c5c505cfec0c",
    //   }
    // ]
  },
  TxWithMetaData: {
    /*
    * txBody: a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163
    * f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2
    * e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a075820deadbeefdeadbeefdeadbee
    * fdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef
    */
    unsignedCborHex: '82a500818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018182582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e802182a030a075820deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeeff6',
    hashHex: 'a85a4830ae401ba3c9c6d1a1fa20357101928aaf4af977fff4a179be9076fe6f',
    parsed: {
      inputs: [
        {
          txHash: Buffer.from('1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc', 'hex'),
          outputIndex: 0,
        },
      ],
      outputs: [
        {
          address: Buffer.from('82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c2561', 'hex'),
          coins: 3003112,
        },
      ],
      fee: 42,
      ttl: 10,
      certificates: [],
      withdrawals: [],
      metaDataHash: Buffer.from('deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'hex'),
      meta: null,
    },
    // witnesses: [
    //   {
    //     path: str_to_path("1852'/1815'/0'/0/0"),
    //     witnessSignatureHex:
    //       "953c5243ba09570dd4e52642236834c138ad4abbbb21796a90540a11e8dc96e47043401d370cdaed70ebc332dd4db80c9b167fd7f20971c4f142875cea57200c"
    //   }
    // ]
  },
  TxWithPoolRegistrationCertficate: {
    /*
    * txBody: a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad848400190bb84436e44b9af68400190bb84436e44b9b500178ff2483e3a2330a34c4a5e576c2078301190bb86d616161612e626262622e636f6d82026d616161612e626262632e636f6d82782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb
    */
    unsignedCborHex: '82a500818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7000181825839017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b090102182a030a04818a03581c13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad582007821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d0844501b0000000ba43b74001a1443fd00d81e82031864581de1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad82581c1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c581c794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad848400190bb84436e44b9af68400190bb84436e44b9b500178ff2483e3a2330a34c4a5e576c2078301190bb86d616161612e626262622e636f6d82026d616161612e626262632e636f6d82782968747470733a2f2f7777772e76616375756d6c6162732e636f6d2f73616d706c6555726c2e6a736f6e5820cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bbf6',
    hashHex: 'bc678441767b195382f00f9f4c4bddc046f73e6116fa789035105ecddfdee949',
    parsed: {
      inputs: [
        {
          txHash: Buffer.from('3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7', 'hex'),
          outputIndex: 0,
        },
      ],
      outputs: [
        {
          address: Buffer.from('017cb05fce110fb999f01abb4f62bc455e217d4a51fde909fa9aea545443ac53c046cf6a42095e3c60310fa802771d0672f8fe2d1861138b09', 'hex'),
          coins: 1,
        },
      ],
      fee: 42,
      ttl: 10,
      certificates: [
        {
          type: 3,
          poolKeyHash: Buffer.from('13381d918ec0283ceeff60f7f4fc21e1540e053ccf8a77307a7a32ad', 'hex'),
          vrfPubKeyHash: Buffer.from('07821cd344d7fd7e3ae5f2ed863218cb979ff1d59e50c4276bdc479b0d084450', 'hex'),
          pledge: 50000000000,
          cost: 340000000,
          margin: { numerator: 3, denominator: 100 },
          rewardAddress: Buffer.from('e1794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad', 'hex'),
          poolOwnersPubKeyHashes: [
            Buffer.from('1d227aefa4b773149170885aadba30aab3127cc611ddbc4999def61c', 'hex'),
            Buffer.from('794d9b3408c9fb67b950a48a0690f070f117e9978f7fc1d120fc58ad', 'hex'),
          ],
          relays: [
            {
              ipv4: Buffer.from('36e44b9a', 'hex'),
              ipv6: null,
              portNumber: 3000,
              type: 0,
            },
            {
              ipv4: Buffer.from('36e44b9b', 'hex'),
              ipv6: Buffer.from('0178ff2483e3a2330a34c4a5e576c207', 'hex'),
              portNumber: 3000,
              type: 0,
            },
            {
              dnsName: 'aaaa.bbbb.com',
              portNumber: 3000,
              type: 1,
            },
            {
              dnsName: 'aaaa.bbbc.com',
              type: 2,
            },
          ],
          metadata: {
            metadataUrl: 'https://www.vacuumlabs.com/sampleUrl.json',
            metadataHash: Buffer.from('cdb714fd722c24aeb10c93dbb0ff03bd4783441cd5ba2a8b6f373390520535bb', 'hex'),
          },
        },
      ],
      withdrawals: [],
      metaDataHash: undefined,
      meta: null,
    },
  },
}

module.exports = {
  transactions,
}
