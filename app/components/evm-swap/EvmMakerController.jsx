import { useEffect } from 'react'

import { useEvmSwapMaker } from '../../hooks'

import TakeSwap from '../TakeSwap'
import ShareChannel from '../ShareChannel'
import Initialize from './EvmMakerInitialize'

const style = { float: 'left', width: '50%', overflow: 'scroll' }

const EvmSwapMakeController = () => {
  const { maker, taker, ...swap } = useEvmSwapMaker()
  return (
    <>
      <div style={style}>
        <h3>Evm Maker</h3>
        {(() => {
          if (!swap.preImage) {
            return <Initialize onInitialize={swap.initialize} />
          }
          if (!swap.peer.channelId) {
            return 'Connecting...'
          }
          if (!swap.peer.ready) {
            return <ShareChannel peerId={swap.peer.id} />
          }
          if (!swap.makerSwap.recipient) {
            return 'Waiting for recipient to give address...'
          }
          if (!swap.signedTakerSwap) {
            return 'Waiting for taker to sign the taker swap...'
          }
          if (!swap.makerTxHash) {
            return 'Waiting for the transaction to be relayed...'
          }
          return (
            <>
              <div>Transactions</div>
              <pre>
                {JSON.stringify(maker.provider.txs[swap.makerTxHash], null, 2)}
              </pre>
              <pre>
                {JSON.stringify(taker.provider.txs[swap.takerTxHash], null, 2)}
              </pre>
            </>
          )
        })()}
        <pre>{JSON.stringify(swap, null, 2)}</pre>
      </div>
      <div style={style}>
        {swap.peer.channelId && <TakeSwap channelId={swap.peer.channelId} />}
      </div>
    </>
  )
}

export default EvmSwapMakeController
