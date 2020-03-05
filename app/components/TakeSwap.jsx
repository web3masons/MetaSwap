import { useState } from 'react'

import { usePeer } from '../hooks'
import { LIGHTNING_SWAP_TYPE, EVM_SWAP_TYPE } from '../utils'
import { takerSigner } from '../utils/demo-accounts'

import Lightning from './lightning-swap/LightningTakerController'
import Evm from './evm-swap/EvmTakerController'
import Info from './Info'

const TakeSwap = ({ channelId }) => {
  const [swapType, setSwapType] = useState(null)
  const peer = usePeer({ signer: takerSigner, channelId, autoConnect: true })
  peer.onMessage('swapType', setSwapType)
  if (!swapType) {
    return <Info text="Connecting to peer" />
  }
  if (swapType === LIGHTNING_SWAP_TYPE) {
    return <Lightning peer={peer} />
  }
  if (swapType === EVM_SWAP_TYPE) {
    return <Evm peer={peer} />
  }
  return (
    <pre>Error: Swap type not recognized</pre>
  )
}

export default TakeSwap
