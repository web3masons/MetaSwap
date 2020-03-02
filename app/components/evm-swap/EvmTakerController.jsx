import { useEvmSwapTaker } from '../../hooks'
import EvmTakerConfirm from './EvmTakerConfirm'

const EvmSwapTakerController = ({ peer }) => {
  const { taker, maker, ...swap } = useEvmSwapTaker({ peer })
  return (
    <>
      <h3>Evm Taker</h3>
      {(() => {
        if (!swap.makerSwap) {
          return 'Fetching swap details...'
        }
        if (!swap.makerSwap.recipient) {
          return <EvmTakerConfirm onConfirm={swap.confirmRecipient} />
        }
        if (!swap.signedTakerSwap) {
          return 'Waiting for maker to sign his swap...'
        }
        if (!swap.preImage) {
          return 'Waiting for taker to publish the preImage...'
        }
        if (!swap.makerTxHash) {
          return 'Relaying...'
        }
        return (
          <>
            <div>Transactions:</div>
            <pre>
              {JSON.stringify(maker.provider.tx(swap.makerTxHash), null, 2)}
            </pre>
            <pre>
              {JSON.stringify(taker.provider.tx(swap.takerTxHash), null, 2)}
            </pre>
          </>
        )
      })()}
      <pre>{JSON.stringify({ swap, maker, taker }, null, 2)}</pre>
    </>
  )
}

export default EvmSwapTakerController
