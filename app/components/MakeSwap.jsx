import { usePeer } from '../hooks'
import { alice } from '../utils'

const MakeSwap = () => {
  const peer = usePeer({ signer: alice, host: true })
  return (
    <pre>{JSON.stringify({ peer }, null, 2)}</pre>
  )
}

export default MakeSwap
