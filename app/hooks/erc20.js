import { abi } from '../../contracts/build/contracts/ERC20Mock'
import { useContract } from '../hooks'

export default function useErc20 ({ provider, address }) {
  const [state, { merge, tx }, contract] = useContract({ provider, address, abi })

  const actions = {
    async balanceOf (wallet = provider.wallet) {
      const balance = await contract.balanceOf(wallet)
      merge({ balance: { [wallet]: balance.toString() } })
    },
    approve (receiver, amount) {
      return tx(contract.approve(receiver, amount))
    }
  }

  return {
    ...state,
    ...actions
  }
}
