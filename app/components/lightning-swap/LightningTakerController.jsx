import { useLightningSwapTaker } from '../../hooks'
import LightningTakerConfirm from './LightningTakerConfirm'
import LightningTakerInputPreImage from './LightningTakerInputPreImage'
import Info from '../Info'
import CompleteSwap from '../CompleteSwap'

const LightningSwapTakerController = ({ peer }) => {
  const swap = useLightningSwapTaker({ peer })
  if (!swap.asset) {
    return <Info text="Fetching swap details" />
  }
  if (!swap.recipient) {
    return <LightningTakerConfirm swap={swap} />
  }
  if (!swap.signedSwap) {
    return <Info text="Waiting for maker to sign the swap" />
  }
  if (!swap.preImage) {
    return <LightningTakerInputPreImage invoice={swap.invoice} onChange={swap.publishPreImage} />
  }
  if (!swap.txHash) {
    return <Info text="Relaying" />
  }
  return <CompleteSwap makerSwap={swap} takerSwap={swap.invoice} />
}

export default LightningSwapTakerController
