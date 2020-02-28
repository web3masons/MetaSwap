import { useEffect } from 'react'

import { nullAddress } from '../../utils'
import { useLightningSwapMaker } from '../../hooks'

import TakeSwap from '../TakeSwap'

import Initialize from './LightningMakerInitialize'
import SetInvoice from './LightningMakerSetInvoice'
import Share from './LightningMakerShare'
import ConfirmCreation from './LightningMakerConfirmCreation'

const style = { float: 'left', width: '50%', overflow: 'scroll' }

const LightningSwapMakeController = () => {
  const swap = useLightningSwapMaker()
  useEffect(() => {
    swap.initialize({ asset: nullAddress, amount: 12 })
    swap.setInvoice('blah')
    swap.confirmCreation()
  }, [])
  return (
    <>
      <div style={style}>
        <h3>Lightning Maker</h3>
        <pre>{JSON.stringify(swap, null, 2)}</pre>
        {(() => {
          if (!swap.asset) {
            return <Initialize onInitialize={swap.initializeSwap} />
          }
          if (!swap.invoice) {
            return <SetInvoice onSetInvoice={swap.setInvoice} />
          }
          if (!swap.ready) {
            return <ConfirmCreation onConfirm={swap.confirmCreation} />
          }
          if (!swap.peer.ready) {
            return <Share peerId={swap.peer.id} />
          }
          if (!swap.signedSwap) {
            return 'Waiting for taker to return address info...'
          }
          if (!swap.txHash) {
            return 'Waiting for the transaction to be relayed...'
          }
          return <pre>{JSON.stringify(swap.provider.txs[swap.txHash], null, 2)}</pre>
        })()}
      </div>
      <div style={style}>
        {swap.ready && <TakeSwap channelId={swap.peer.channelId} />}
      </div>
    </>
  )
}

export default LightningSwapMakeController
