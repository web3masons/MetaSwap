// from https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
import crypto from 'crypto'

export function encrypt (text, secret) {
  console.log({ text, secret })
  const iv = Buffer.from(crypto.randomBytes(16), 'hex')
  const key = Buffer.from(secret.slice(2), 'hex')
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt (text, secret) {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const key = Buffer.from(secret.slice(2), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
