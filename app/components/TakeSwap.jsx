import { usePeer } from '../hooks'
import { bob as signer } from '../utils'
import Lightning from './swap/lightning/take/TakeController'
import { useState } from 'react'

const TakeSwap = ({ channelId }) => {
  const [swapType, setSwapType] = useState(null)
  const peer = usePeer({ signer, channelId, autoConnect: true })
  peer.onMessage('swapType', setSwapType)
  if (!swapType) {
    return 'Connecting...'
  }
  if (swapType === 'lightning') {
    return <Lightning peer={peer} />
  }
  return (
    <pre>Swap type not recognised</pre>
  )
}

export default TakeSwap
