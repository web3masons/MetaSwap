import { usePeer } from '../hooks'
import { bob } from '../utils'

const TakeSwap = ({ channelId }) => {
  const peer = usePeer({ signer: bob, channelId })
  return (
    <pre>{JSON.stringify({ peer }, null, 2)}</pre>
  )
}

export default TakeSwap
