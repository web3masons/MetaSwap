import { useMyReducer } from '../hooks'
import { useEffect } from 'react'
import { encrypt, decrypt } from '../utils/crypto'

export default function ({ signer, peer }) {
  // with state or reducer
  const [state, { merge, set }] = useMyReducer()

  useEffect(() => {
    if (signer) {
      const sharedSecret = signer.signingKey.computeSharedSecret(
        peer.signingKey.publicKey
      )
      set({ peer: peer.address, sharedSecret })
    }
  }, [signer, peer])

  const actions = {
    encrypt (msg) {
      return encrypt(msg, state.sharedSecret)
    },
    decrypt (msg) {
      return decrypt(msg, state.sharedSecret)
    },
    async sendMessage (msg) {
      const encrypted = actions.encrypt(msg)
      const decrypted = actions.decrypt(encrypted)
      merge({ encrypted, decrypted })
      // console.log('shared', shared, shared2)
      // console.log('hi', signer)
      // encrypt
    }
  }

  return [state, actions]
}
