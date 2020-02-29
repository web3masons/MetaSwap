import { useProvider, useMetaSwap, useErc20 } from '../hooks'
import { chains, alice as signer, ganacheAccount as secret } from '../utils'

const chain = Object.values(chains).slice(0, 1)[0]

export default function useContractSuite () {
  // TODO make this configurable...
  const provider = useProvider({ secret, chain })
  const metaSwap = useMetaSwap({ provider, address: provider.contractAddress })
  const erc20 = useErc20({ provider, address: provider.tokenAddress })
  return { provider, metaSwap, signer, erc20 }
}
