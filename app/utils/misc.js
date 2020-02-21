export const nullAddress = '0x0000000000000000000000000000000000000000'

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
    published: new Date().getTime()
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
  return { ...parsed, updated: new Date().getTime() }
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
