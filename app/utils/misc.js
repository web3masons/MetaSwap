import crypto from 'crypto'
import generate from 'nanoid/generate'
import { Wallet } from 'ethers'
import { hashPreImage } from './signing'

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
