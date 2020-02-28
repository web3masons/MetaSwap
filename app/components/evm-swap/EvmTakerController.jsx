import { useEvmSwapTaker, useContractSuite } from '../../hooks'

const EvmTakerController = ({ peer }) => {
  const { metaSwap, provider } = useContractSuite()
  const swap = useEvmSwapTaker({ peer, metaSwap })
  return (
    <>
      <h3>EVM Taker</h3>
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

export default EvmTakerController
