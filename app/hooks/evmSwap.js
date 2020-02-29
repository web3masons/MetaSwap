import { useMyReducer, useContractSuite, usePeer } from '../hooks'
import { useEffect } from 'react'
import { testAddress, EVM_SWAP_TYPE, randomPreImage, nullAddress } from '../utils'

export function useEvmSwapMaker () {
  const [state, { merge, set }] = useMyReducer()

  // For now these are on the same chain but will be updated...
  const maker = useContractSuite()
  const taker = useContractSuite() // TODO populate with correct chain id etc...
  const peer = usePeer({ signer: maker.signer, host: true })

  const actions = {
    initialize ({ recipient = testAddress, makerAsset = nullAddress, makerAmount = 1, takerAsset = nullAddress, takerAmount = 2 } = {}) {
      const { preImage, preImageHash } = randomPreImage()
      const makerSwap = {
        asset: makerAsset, amount: makerAmount, preImageHash
      }
      const takerSwap = {
        asset: takerAsset, amount: takerAmount, recipient, preImageHash
      }
      set({ makerSwap, takerSwap, preImage, ready: true })
      peer.connect()
    }
  }

  peer.onConnect(() => {
    peer.send('swapType', EVM_SWAP_TYPE)
  })
  peer.onMessage('getSwapDetails', () => {
    const { makerSwap, takerSwap } = state
    peer.send('swapDetails', { makerSwap, takerSwap })
  })
  peer.onMessage('confirmRecipient', async (recipient) => {
    merge({ makerSwap: { recipient } })
    const { makerSwap } = state
    const signedMakerSwap = await maker.metaSwap.signSwap(makerSwap)
    merge({ signedMakerSwap })
    peer.send('signedMakerSwap', signedMakerSwap)
  })
  peer.onMessage('signedTakerSwap', async (signedTakerSwap) => {
    // TODO validate this
    merge({ signedTakerSwap })
    const { signedMakerSwap, preImage } = state
    // send the preImage (not really necessary)
    peer.send('preImage', preImage)
    // also relay the preImage to both chains
    const { hash: makerTxHash } = await maker.metaSwap.relaySwap({ ...signedMakerSwap, preImage })
    merge({ makerTxHash })
    peer.send('relayedTx', { makerTxHash })
    const { hash: takerTxHash } = await taker.metaSwap.relaySwap({ ...signedTakerSwap, preImage })
    merge({ takerTxHash })
    peer.send('relayedTx', { takerTxHash })
  })

  return { ...state, ...actions, peer, maker, taker }
}

export function useEvmSwapTaker ({ peer }) {
  const [state, { merge, set }] = useMyReducer()

  const maker = useContractSuite()
  const taker = useContractSuite()

  useEffect(() => {
    peer.send('getSwapDetails')
  }, [])

  peer.onMessage('swapDetails', (details) => {
    // TODO parse and verify invoice
    set(details)
    // TODO this should be a button and input
    // actions.confirmRecipient()
  })
  peer.onMessage('signedMakerSwap', async (signedMakerSwap) => {
    // TODO validate this!
    merge({ signedMakerSwap })
    // then i sign the taker swap
    const signedTakerSwap = await maker.metaSwap.signSwap(state.takerSwap)
    merge({ signedTakerSwap })
    peer.send('signedTakerSwap', signedTakerSwap)
    // TODO listen on chain for the preImage in case bob is evil
  })
  peer.onMessage('relayedTx', async ({ makerTxHash, takerTxHash }) => {
    if (makerTxHash) {
      await maker.provider.getTransaction(makerTxHash)
      merge({ makerTxHash })
    }
    if (takerTxHash) {
      await taker.provider.getTransaction(takerTxHash)
      merge({ takerTxHash })
    }
  })
  peer.onMessage('preImage', (preImage) => merge({ preImage }))

  const actions = {
    confirmRecipient ({ recipient = testAddress }) {
      merge({ makerSwap: { recipient } })
      peer.send('confirmRecipient', recipient)
    }
  }
  return { ...state, ...actions, peer, maker, taker }
}
