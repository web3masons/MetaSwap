import { useState } from 'react'

import { usePeer } from '../hooks'
import { bob as signer, LIGHTNING_SWAP_TYPE, EVM_SWAP_TYPE } from '../utils'

import Lightning from './lightning-swap/LightningTakerController'
import Evm from './evm-swap/EvmTakerController'
import Json from './Json'

const TakeSwap = ({ channelId }) => {
  const [swapType, setSwapType] = useState(null)
  const peer = usePeer({ signer, channelId, autoConnect: true })
  peer.onMessage('swapType', setSwapType)
  if (!swapType) {
    return <Json>{peer}</Json>
  }
  if (swapType === LIGHTNING_SWAP_TYPE) {
    return <Lightning peer={peer} />
  }
  if (swapType === EVM_SWAP_TYPE) {
    return <Evm peer={peer} />
  }

  return (
    <pre>Swap type not recognised</pre>
  )
}

export default TakeSwap
