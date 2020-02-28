import { useMyReducer } from '../hooks'
import { useEffect } from 'react'
import { testAddress, testPreImage, EVM_SWAP_TYPE } from '../utils'

export function useEvmSwapMaker ({ peer, metaSwap, provider }) {
  const [state, { merge, set }] = useMyReducer()

  const actions = {
    initializeSwap ({ asset, amount }) {
      set({ asset, amount })
    },
    setInvoice () {
      merge({ invoice: 'testing' })
    },
    confirmCreation () {
      merge({ ready: true })
    },
    async signSwap () {
      const { recipient, asset, amount } = state
      const signedSwap = await metaSwap.signSwap({ recipient, asset, amount })
      merge({ signedSwap })
      peer.send('signedSwap', signedSwap)
    }
  }

  peer.onConnect(() => {
    peer.send('swapType', EVM_SWAP_TYPE)
  })
  peer.onMessage('getSwapDetails', () => {
    const { asset, amount, invoice } = state
    // TODO parse and verify invoice
    peer.send('swapDetails', { asset, amount, invoice })
  })
  peer.onMessage('confirmRecipient', (recipient) => {
    merge({ recipient })
    // TODO move this to a button?
    actions.signSwap()
    // TODO listen on chain for published preImage, update hash if it exists
  })
  peer.onMessage('relayedTx', async (hash) => {
    await provider.getTransaction(hash)
    merge({ hash })
  })

  return { ...state, ...actions, peer, metaSwap }
}

export function useEvmSwapTaker ({ peer, metaSwap }) {
  const [state, { merge, set }] = useMyReducer()
  useEffect(() => {
    peer.send('getSwapDetails')
  }, [])

  peer.onMessage('swapDetails', (details) => {
    // TODO parse and verify invoice
    set(details)
    // TODO this should be a button and input
    actions.confirmRecipient()
  })
  peer.onMessage('signedSwap', (signedSwap) => {
    // TODO validate this!
    merge({ signedSwap })
    actions.pubishPreImage()
  })
  const actions = {
    confirmRecipient () {
      const recipient = testAddress
      merge({ recipient })
      peer.send('confirmRecipient', recipient)
    },
    async pubishPreImage () {
      const preImage = testPreImage
      const { signedSwap } = state
      const params = { ...signedSwap, preImage }
      metaSwap.validateParams(params)
      merge({ preImage })
      const { hash } = await metaSwap.relaySwap(params)
      merge({ hash })
      peer.send('relayedTx', hash)
    }
  }
  return { ...state, ...actions, peer, metaSwap }
}
