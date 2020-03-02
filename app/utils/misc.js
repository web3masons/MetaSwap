import crypto from 'crypto'
import generate from 'nanoid/generate'
import { Wallet } from 'ethers'
import { hashPreImage } from './signing'

export const url = 'https://metaswap.io'

export const testMode = false

export const isClient =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement

export const EVM_SWAP_TYPE = 'evm'
export const LIGHTNING_SWAP_TYPE = 'lightning'

// EDIT THIS
export const ganacheAccount = '0xbd9a50b02c327098944bddd44e8820e5e9eeb65280b4388648b6677e6c47d940'
export const nullAddress = '0x0000000000000000000000000000000000000000'
export const testAddress = '0x0000000000000000000000000000000000000b0b'
export const testTxHash = '0x0783297c83784d26ea1d134619b5122f49b96057abf3a117f0365ed875bf4a1b'

export const testPreImage = '0x561c9f2cc0e720388ff4e57611e7bce3d0b3d5b44563b15486646372b0f4ffc9'
export const testPreImageHash = '0x99fdc2e2d58d8e772cd819bd3ca41bbca56cc36dfc07e4bc97d7ed14bf2d2288'

export const testInvoice = 'lnbc20340620n1p0rcrufpp583ezcpuxluqx5lx5fdem4q0096wr6ljgj3atx8lputdtxpns2rksdqgvd58y6tncqzpgxqyz5vqsp5hmj9g4djz2rzxq6gl0lwr7m77ha90k7v80jn890t5hfngtkwss6s9qy9qsq9mdfd7qp8acrtpl5a7puwkxrqtnxdann25d6nahq0zfsgl99t9gzfuuax9r8a7lfuf3utztw6twlm0dqxycya4wfmmvakze02xksjxqqv067gd'
export const testInvoicePreImage = '58e119b63f8d1918b9b33d1971b01184557b68af385b1b17bfa23095780f3828'

export const owner = new Wallet(ganacheAccount)
export const alice = new Wallet('0x0000000000000000000000000000000000000000000000000000000000000002')
export const bob = new Wallet('0x0000000000000000000000000000000000000000000000000000000000000001')

export function randomId (n = 8) {
  return generate('2346789ABCDEFGHJKLMNPQRTUVWXYZabcdefghijkmnpqrtwxyz', n)
}
export function randomHex (n = 8) {
  return crypto.randomBytes(n).toString('hex').slice(0, n)
}
export function randomAddress () {
  return `0x${randomHex(40)}`
}
export function randomPreImage () {
  const preImage = `0x${randomHex(64)}`
  const preImageHash = hashPreImage(preImage)
  return { preImage, preImageHash }
}

export function parseTx (tx) {
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    nonce: tx.nonce,
    data: tx.data,
    value: tx.value.toString(),
    gasPrice: tx.gasPrice.toString(),
    gasLimit: tx.gasLimit.toString(),
    _lastSeen: new Date().getTime()
  }
}

export function parseCall (res) {
  const parsed = {}
  Object.keys(res).forEach(key => {
    const val = res[key]
    if (isNaN(parseInt(key))) {
      if (!val || Array.isArray(val) || !val._hex) {
        parsed[key] = res[key]
      } else {
        parsed[key] = res[key].toString()
      }
    }
  })
  return { ...parsed, _lastSeen: new Date().getTime() }
}

export function mergeDeep (target, source) {
  const isObject = obj => obj && typeof obj === 'object'

  if (!isObject(target) || !isObject(source)) {
    return source
  }

  Object.keys(source).forEach(key => {
    const targetValue = target[key]
    const sourceValue = source[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = sourceValue
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue)
    } else {
      target[key] = sourceValue
    }
  })

  return { ...target }
}

export function formatLongHex (str, n = 5) {
  return `0x${str.slice(2, 2 + n)}...${str.slice(-n)}`
}

export const sampleSwap = {
  asset: {
    chain: 'kovan',
    name: 'Kovan ETH',
    address: '0x0000000000000000000000000000000000000000',
    key: 'kovan'
  },
  amount: '1',
  invoice: {
    coinType: 'bitcoin',
    expires: '2020-02-07T13:07:21.000Z',
    milisats: 2034062000,
    preImageHash:
             '0x3c722c0786ff006a7cd44b73ba81ef2e9c3d7e48947ab31fe1e2dab3067050ed',
    invoice:
             'lnbc20340620n1p0rcrufpp583ezcpuxluqx5lx5fdem4q0096wr6ljgj3atx8lputdtxpns2rksdqgvd58y6tncqzpgxqyz5vqsp5hmj9g4djz2rzxq6gl0lwr7m77ha90k7v80jn890t5hfngtkwss6s9qy9qsq9mdfd7qp8acrtpl5a7puwkxrqtnxdann25d6nahq0zfsgl99t9gzfuuax9r8a7lfuf3utztw6twlm0dqxycya4wfmmvakze02xksjxqqv067gd'
  },
  maker: '0x4b496D3b9B33e58a019103850fC471Ca3Db75E7A',
  ready: true,
  recipient: '0x0000000000000000000000000000000000000b0b',
  signedSwap: {
    contractAddress: '0x54e4a494dF47dc2d48dA487a7A1FB29820Ed4fd7',
    nonce: 16,
    preImageHash:
             '0x99fdc2e2d58d8e772cd819bd3ca41bbca56cc36dfc07e4bc97d7ed14bf2d2288',
    amount: '1',
    relayerAmount: 1,
    account: '0x4b496D3b9B33e58a019103850fC471Ca3Db75E7A',
    asset: '0x0000000000000000000000000000000000000000',
    relayerAddress: '0x0E22A0F27fd673D8b50E1f512F4Cd085aFDb0153',
    relayerAsset: '0x0000000000000000000000000000000000000000',
    expirationTime: 2583144776,
    relayerExpirationTime: 2583144776,
    recipient: '0x0000000000000000000000000000000000000b0b',
    signature:
             '0xd0fbc0e76478aed0aa5a623f16b807b8796041bacdb806128de7c9d44fb40d6d4f28805d9c9264d93859f96d5e93d8344b150ea3e9283b0f16c29d3a5f6db60d1c'
  },
  txHash:
           '0x89a9ef1738caf1099de7c4b062e3dba64a807b0115b99bd88b7d2e40e111c8b6',
  peer: {
    id: 'NCxAqY7K',
    host: true,
    channelId: 'NCxAqY7K',
    open: true,
    peerId: 'yG3dkMEx',
    connected: true,
    peerPubKey:
             '0x049f230b12ff126b0c4e49ea40dc79959bdca303ca66f95fae9cd3efb00eb4ca78749e7e61ef72efd536c04621eb5682452a7db69f08430e5ca330d5e2e96008ac',
    peerAddress: '0xe3D3648531A64bFa4669AD40E3c53ea790E2B461',
    ready: true,
    peerLastSeen: 1583144780319
  },
  provider: {
    name: 'Kovan',
    explorer: 'https://kovan.etherscan.io/tx/',
    url: 'https://kovan.infura.io/v3/7d0d81d0919f4f05b9ab6634be01ee73',
    contractAddress: '0x54e4a494dF47dc2d48dA487a7A1FB29820Ed4fd7',
    tokenAddress: '0x97D1D6c34F1fC82BEC451592c06aCE89a23a5F07',
    key: 'kovan',
    wallet: '0x0E22A0F27fd673D8b50E1f512F4Cd085aFDb0153',
    blockNumber: '17119768',
    balances: {
      '0x0E22A0F27fd673D8b50E1f512F4Cd085aFDb0153': '89287494000000011'
    },
    blocks: {
      '0x860f23be2e4372b32e237d1213004a9e205498c761f6849db362a95917668aca': {
        hash:
                 '0x860f23be2e4372b32e237d1213004a9e205498c761f6849db362a95917668aca',
        parentHash:
                 '0x0e0cc412610fbb54d2c370ccc7805bdc90c3059c406f76c2c5bbce3566c048f4',
        number: 17119768,
        timestamp: 1583144748,
        difficulty: null,
        gasLimit: '10000000',
        gasUsed: '327762',
        miner: '0x596e8221A30bFe6e7eFF67Fee664A01C73BA3C56',
        extraData:
                 '0xde830206088f5061726974792d457468657265756d86312e34302e30826c69',
        transactions: [
          '0x7a8db3338dc1554ebe328483ca1e66d85200205c5ac447554de03415b2b82b14',
          '0x70fef5a7ff352a203ca2a0c0d89311a02db652fe655af7fedb2a0dd728b7231f'
        ],
        _lastSeen: 1583144753664
      }
    }
  },
  metaSwap: {
    address: '0x54e4a494dF47dc2d48dA487a7A1FB29820Ed4fd7',
    messageSigner: '0xf9eaE093BBb915381913E38F71e2e1d265EfAf86',
    txPublisher: '0x0E22A0F27fd673D8b50E1f512F4Cd085aFDb0153',
    depositAccount: '0x4b496D3b9B33e58a019103850fC471Ca3Db75E7A',
    balances: {
      '0x4b496D3b9B33e58a019103850fC471Ca3Db75E7A': {
        '0x0000000000000000000000000000000000000000': '49999999978'
      }
    },
    accountDetails: {
      '0x4b496D3b9B33e58a019103850fC471Ca3Db75E7A': {
        nonce: '15',
        signerWallet: '0xf9eaE093BBb915381913E38F71e2e1d265EfAf86',
        cooldownStart: '0',
        warmupTriggered: true,
        frozenTime: '300',
        isFrozen: false,
        _lastSeen: 1583144776962
      }
    }
  }
}
