
import { useLightningSwapMaker } from '../../hooks'

import Initialize from './LightningMakerInitialize'

import TakeSwap from '../TakeSwap'
import Info from '../Info'
import ShareChannel from '../ShareChannel'
import CompleteSwap from '../CompleteSwap'

import { testMode, sampleSwap } from '../../utils'

const style = testMode ? { float: 'left', width: '50%', overflow: 'scroll' } : {}

const LightningSwapMakeController = () => {
  const swap = useLightningSwapMaker()
  return (
    <>
      <div className="swap-contents" style={style}>
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
            return <Info text="Creating peer-to-peer connection" />
          }
          if (!swap.peer.ready) {
            return <ShareChannel peerId={swap.peer.id} />
          }
          if (!swap.signedSwap) {
            return <Info text='Waiting for taker to return address info' />
          }
          if (!swap.txHash) {
            return <Info text='Waiting invoice to be paid and transaction to be relayed' />
          }
          return <CompleteSwap makerSwap={swap} takerSwap={swap.invoice} />
          // return <pre>{JSON.stringify(swap.provider.tx(swap.txHash), null, 2)}</pre>
        })()}
        {/* <pre>{JSON.stringify(swap, null, 2)}</pre> */}
      </div>
      {testMode &&
      <div style={style}>
        {swap.peer.channelId && <TakeSwap channelId={swap.peer.channelId} />}
      </div>
      }
    </>
  )
}

export default LightningSwapMakeController
