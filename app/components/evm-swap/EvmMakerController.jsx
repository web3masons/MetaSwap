import { useEvmSwapMaker } from '../../hooks'

import ShareChannel from '../ShareChannel'
import Initialize from './EvmMakerInitialize'
import Info from '../Info'
import CompleteSwap from '../CompleteSwap'

const EvmSwapMakeController = () => {
  const swap = useEvmSwapMaker()
  if (!swap.preImage) {
    return <Initialize onInitialize={swap.initialize} swap={swap} />
  }
  if (!swap.peer.channelId) {
    return <Info text='Creating peer to peer connection' />
  }
  if (!swap.peer.ready) {
    return <ShareChannel peerId={swap.peer.id} />
  }
  if (!swap.makerSwap.recipient) {
    return <Info text='Waiting for recipient to give address' />
  }
  if (!swap.signedTakerSwap) {
    return <Info text='Waiting for taker to sign the taker swap' />
  }
  if (!swap.makerSwap.txHash) {
    return <Info text='Waiting for the transaction to be relayed' />
  }
  return (
    <CompleteSwap
      makerSwap={{ ...swap.maker, ...swap.makerSwap }}
      takerSwap={{ ...swap.taker, ...swap.takerSwap }}
    />
  )
}

export default EvmSwapMakeController
