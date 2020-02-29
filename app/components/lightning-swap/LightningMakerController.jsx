import { useEffect } from 'react'

import { useLightningSwapMaker } from '../../hooks'

import TakeSwap from '../TakeSwap'
import ShareChannel from '../ShareChannel'

import Initialize from './LightningMakerInitialize'

const style = { float: 'left', width: '50%', overflow: 'scroll' }

const LightningSwapMakeController = () => {
  const swap = useLightningSwapMaker()
  useEffect(() => {
    // uncomment me to test flow
    // swap.initialize({ asset: '0x0', amount: 12 })
  }, [])
  return (
    <>
      <div style={style}>
        <h3>Lightning Maker</h3>
        {/* <p>TODO: Chain / Account Selection</p> */}
        {(() => {
          if (!swap.ready) {
            return <Initialize onInitialize={swap.initialize} />
          }
          if (!swap.peer.channelId) {
            return 'Connecting...'
          }
          if (!swap.peer.ready) {
            return <ShareChannel peerId={swap.peer.id} />
          }
          if (!swap.signedSwap) {
            return 'Waiting for taker to return address info...'
          }
          if (!swap.txHash) {
            return 'Waiting for the transaction to be relayed...'
          }
          return <pre>{JSON.stringify(swap.provider.txs[swap.txHash], null, 2)}</pre>
        })()}
        <pre>{JSON.stringify(swap, null, 2)}</pre>
      </div>
      <div style={style}>
        {swap.peer.channelId && <TakeSwap channelId={swap.peer.channelId} />}
      </div>
    </>
  )
}

export default LightningSwapMakeController
