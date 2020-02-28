import { useEffect } from 'react'

import { nullAddress } from '../../utils'
import { usePeer, useEvmSwapMaker, useContractSuite } from '../../hooks'

import TakeSwap from '../TakeSwap'

const style = { float: 'left', width: '50%', overflow: 'scroll' }

const EvmMakerController = () => {
  const { metaSwap, signer, provider } = useContractSuite()
  const peer = usePeer({ signer, host: true })
  const swap = useEvmSwapMaker({ peer, metaSwap, provider })
  useEffect(() => {
    swap.initializeSwap({ asset: nullAddress, amount: 12 })
    swap.setInvoice('blah')
    swap.confirmCreation()
    peer.connect()
  }, [])
  return (
    <>
      <div style={style}>
        <h3>EVM Maker</h3>
        <pre>{JSON.stringify(swap, null, 2)}</pre>
        {(() => {
          if (!swap.asset) {
            return 'Initialize'
          }
          if (!swap.invoice) {
            return 'SetInvoice'
          }
          if (!swap.ready) {
            return 'ConfirmCreation'
          }
          if (!swap.peer.ready) {
            return 'Share'
          }
          if (!swap.signedSwap) {
            return 'Waiting for taker to return address info...'
          }
          if (!swap.hash) {
            return 'Waiting for the transaction to be relayed...'
          }
          return <pre>{JSON.stringify(provider.txs[swap.hash], null, 2)}</pre>
        })()}
      </div>
      <div style={style}>
        {swap.ready && <TakeSwap channelId={swap.peer.channelId} />}
      </div>
    </>
  )
}

export default EvmMakerController
