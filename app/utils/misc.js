import crypto from 'crypto'
import generate from 'nanoid/generate'
import { Wallet } from 'ethers'

export const isClient =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement

export const nullAddress = '0x0000000000000000000000000000000000000000'
export const testAddress = '0x0000000000000000000000000000000000000b0b'
export const testTxHash = '0x0783297c83784d26ea1d134619b5122f49b96057abf3a117f0365ed875bf4a1b'
// EDIT THIS
export const ganacheAccount = '0x6f362b01031d9cd0a650bfb8c8d5d541c322bbc8e565d18a19d69243ce897aaf'

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
