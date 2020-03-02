import bolt11 from 'bolt11'
import { testInvoice } from './misc'
import { hashPreImage, prefixHex } from './signing'

export function decodeInvoice (passedInvoice) {
  const invoice = passedInvoice === 'test' ? testInvoice : passedInvoice
  try {
    const parsed = bolt11.decode(invoice)
    const { data: preImageHash } = parsed.tags.find(t => t.tagName === 'payment_hash')
    return {
      coinType: parsed.coinType,
      expires: new Date(parsed.timeExpireDate * 1000),
      milisats: parsed.milisatoshis || parsed.satoshis * 1000,
      preImageHash: `0x${preImageHash}`,
      invoice
    }
  } catch (e) {
    console.log('invalid invoice')
    return false
  }
}

export function validatePreImage (invoiceOrObj, preImage) {
  try {
    const { preImageHash } = invoiceOrObj.preImageHash ? invoiceOrObj : decodeInvoice(invoiceOrObj)
    const prefixed = prefixHex(preImage)
    const hash = hashPreImage(prefixed)
    return (hash === preImageHash) ? prefixed : false
  } catch (e) {
    return false
  }
}
