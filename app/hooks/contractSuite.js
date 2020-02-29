import { useProvider, useMetaSwap, useErc20 } from '../hooks'
import { chains } from '../utils'

const defaultChain = Object.values(chains)[0]

export default function useContractSuite ({ secret, chain = defaultChain } = {}) {
  const provider = useProvider({ secret, chain })
  const metaSwap = useMetaSwap({
    provider,
    address: provider.contractAddress
  })
  const erc20 = useErc20({
    provider,
    address: provider.tokenAddress
  })
  return { provider, metaSwap, erc20 }
}
