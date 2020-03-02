import { abi } from '../../contracts/build/contracts/ERC20Mock'
import { useContract } from '../hooks'

export default function useErc20 ({ provider, address }) {
  const [state, { merge, tx }, contract] = useContract({ provider, address, abi })

  const actions = {
    async getBalance (wallet = provider.wallet) {
      const balance = await contract.balanceOf(wallet)
      merge({ balances: { [wallet]: balance.toString() } })
    },
    approve (recipient, amount) {
      return addTx(contract.approve(recipient, amount))
    },
    balance (account = provider.wallet) {
      return (
        (state.balances && state.balances[account]) || '0'
      )
    }
    // transfer (recipient, amount) {
    //   return addTx(contract.transfer(recipient, amount))
    // }

  }

  return {
    ...state,
    ...actions
  }
}
