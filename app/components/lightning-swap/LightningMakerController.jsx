
import { useLightningSwapMaker } from '../../hooks'

import TakeSwap from '../TakeSwap'
import ShareChannel from '../ShareChannel'

import Initialize from './LightningMakerInitialize'

const style = { float: 'left', width: '50%', overflow: 'scroll' }

const LightningSwapMakeController = () => {
  const swap = useLightningSwapMaker()
  return (
    <>
      <div style={style}>
        <h3>Lightning Maker</h3>
        {(() => {
          if (!swap.ready) {
            return (
              <Initialize
                onInitialize={swap.initialize}
                onUpdateChain={swap.provider.setProvider}
                metaSwap={swap.metaSwap}
              />
            )
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
            return 'Waiting invoice to be paid and transaction to be relayed...'
          }
          return <pre>{JSON.stringify(swap.provider.tx(swap.txHash), null, 2)}</pre>
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
