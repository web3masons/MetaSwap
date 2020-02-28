import { useLightningSwapTaker } from '../../hooks'

const LightningSwapTakerController = ({ peer }) => {
  const swap = useLightningSwapTaker({ peer })
  return (
    <>
      <h3>Lightning Taker</h3>
      <pre>{JSON.stringify(swap, null, 2)}</pre>
      {(() => {
        if (!swap.recipient) {
          return 'Please confirm swap and your address...'
        }
        if (!swap.signedSwap) {
          return 'Waiting for maker to sign the swap...'
        }
        if (!swap.preImage) {
          return 'Please pay invoice and paste the preImage'
        }
        if (!swap.txHash) {
          return 'Relaying...'
        }
        return <pre>{JSON.stringify(swap.provider.txs[swap.txHash], null, 2)}</pre>
      })()}
    </>
  )
}

export default LightningSwapTakerController
