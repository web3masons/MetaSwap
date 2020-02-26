import { usePeer } from '../hooks'
import { alice as signer, bob as peer } from '../utils'

const CreateSwap = () => {
  // const { metaSwap, provider, erc20, signer } = useContractSuite()
  const [state, actions] = usePeer({ signer, peer })
  return (
    <pre onClick={() => actions.sendMessage('h')}>{JSON.stringify(state, null, 2)}</pre>
  )
  // return null
}

export default CreateSwap
