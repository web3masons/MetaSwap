import { useMyReducer, usePeer } from '../hooks'

export default function useLightningSwap ({ signer, maker, channelId }) {
  const [state, { merge, set }] = useMyReducer()
  // only connect host when the invoice is available
  const host = !!maker
  const connect = !host || !!state.ready // EDIT disbale default connect
  const peer = usePeer({ signer, host, channelId, connect: true })

  peer.onConnect(() => {
    console.log('you connected!')
    peer.send('test', { something: 'wtf' })
  })
  peer.onData((data) => {
    console.log('hi data', data)
  })
  peer.onMessage('test', (data) => {
    console.log('got test message', data)
  })

  const actions = {
    // mixed actions
    publishPreImage () {
      // todo
    },
    // taker actions
    confirmTakerAddress () {
      peer.send('confirmTakerAddress', { address: 'some address' })
    },
    // maker actions
    initializeSwap ({ asset, amount }) {
      set({ asset, amount })
    },
    setInvoice () {
      merge({ invoice: 'testing' })
    },
    confirmCreation () {
      merge({ ready: true })
    }
  }

  return {
    ...state,
    ...actions,
    peer
  }
}
