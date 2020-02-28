import { useLightningSwapTaker, useContractSuite } from '../../../../hooks'

const LightningSwapTakeController = ({ peer }) => {
  const { metaSwap, provider } = useContractSuite()
  const swap = useLightningSwapTaker({ peer, metaSwap })
  return (
    <>
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
        if (!swap.hash) {
          return 'Relaying...'
        }
        return <pre>{JSON.stringify(provider.txs[swap.hash], null, 2)}</pre>
      })()}
    </>
  )
}

export default LightningSwapTakeController
