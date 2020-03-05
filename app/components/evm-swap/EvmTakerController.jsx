import { useEvmSwapTaker } from '../../hooks'
import EvmTakerConfirm from './EvmTakerConfirm'
import CompleteSwap from '../CompleteSwap'
import Info from '../Info'

const EvmSwapTakerController = ({ peer }) => {
  const swap = useEvmSwapTaker({ peer })
  if (!swap.makerSwap) {
    return <Info text='Fetching swap details' />
  }
  if (!swap.makerSwap.recipient) {
    return <EvmTakerConfirm {...{ swap, maker: swap.makerSwap, taker: swap.takerSwap }} />
  }
  if (!swap.signedTakerSwap) {
    return <Info text='Waiting for maker to sign his swap' />
  }
  if (!swap.preImage) {
    return <Info text='Waiting for taker to publish the preImage' />
  }
  if (!swap.makerSwap.txHash) {
    return <Info text='Relaying' />
  }
  // TODO clean this up!
  return <CompleteSwap makerSwap={{ ...swap.maker, ...swap.makerSwap }} takerSwap={{ ...swap.taker, ...swap.takerSwap }} />
}

export default EvmSwapTakerController
