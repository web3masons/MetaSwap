
import { useLightningSwapMaker } from '../../hooks'

import Initialize from './LightningMakerInitialize'

import Info from '../Info'
import ShareChannel from '../ShareChannel'
import CompleteSwap from '../CompleteSwap'

const LightningSwapMakeController = () => {
  const swap = useLightningSwapMaker()
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
    return <Info text='Waiting for the invoice to be paid and transaction to be relayed' />
  }
  return <CompleteSwap makerSwap={swap} takerSwap={swap.invoice} />
}

export default LightningSwapMakeController
