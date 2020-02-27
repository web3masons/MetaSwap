import useLightningSwap from '../hooks/lightningSwap'
import { bob } from '../utils'

const TakeSwap = ({ channelId }) => {
  const swap = useLightningSwap({ signer: bob, channelId })
  return (
    <pre>{JSON.stringify({ swap }, null, 2)}</pre>
  )
}

export default TakeSwap
