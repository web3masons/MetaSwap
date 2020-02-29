import { utils } from 'ethers'

export function hashMessage (p) {
  const params = [p.contractAddress, p.account, p.recipient, p.asset, p.relayerAddress, p.relayerAsset, p.nonce, p.amount, p.expirationTime, p.relayerAmount, p.relayerExpirationTime, p.preImageHash]
  const types = ['address', 'address', 'address', 'address', 'address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'bytes32']
  return utils.solidityKeccak256(types, params)
}

export function prefixHex (hex) {
  return hex.slice(0, 2) === '0x' ? hex : `0x${hex}`
}

export function hashPreImage (preImage) {
  return utils.soliditySha256(['bytes32'], [preImage])
}

export function signMessage (message, provider) {
  return provider.signMessage(utils.arrayify(message))
}

export function createSignature (p, provider) {
  return signMessage(hashMessage(p), provider)
}

export function verifySignature () {

}

export function formatParams (p) {
  return [
    [p.account, p.recipient, p.asset, p.relayerAddress, p.relayerAsset],
    [p.nonce, p.amount, p.expirationTime, p.relayerAmount, p.relayerExpirationTime],
    [p.preImageHash, p.preImage],
    p.signature
  ]
}
