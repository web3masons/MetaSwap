import { useLightningSwapTaker } from '../../hooks'
import LightningTakerConfirm from './LightningTakerConfirm'
import LightningTakerInputPreImage from './LightningTakerInputPreImage'

const LightningSwapTakerController = ({ peer }) => {
  const swap = useLightningSwapTaker({ peer })
  return (
    <>
      <h3>Lightning Taker</h3>
      {(() => {
        if (!swap.recipient) {
          return <LightningTakerConfirm onConfirm={swap.confirmRecipient}/>
        }
        if (!swap.signedSwap) {
          return 'Waiting for maker to sign the swap...'
        }
        if (!swap.preImage) {
          return <LightningTakerInputPreImage invoice={swap.invoice} onChange={swap.publishPreImage} />
        }
        if (!swap.txHash) {
          return 'Relaying...'
        }
        return (
          <pre>{JSON.stringify(swap.provider.tx(swap.txHash), null, 2)}</pre>
        )
      })()}
      <pre>{JSON.stringify(swap, null, 2)}</pre>
    </>
  )
}

export default LightningSwapTakerController
