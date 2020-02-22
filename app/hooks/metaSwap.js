import { abi } from '../../contracts/build/contracts/MetaSwap'
import { nullAddress, parseCall } from '../utils'
import { useContract } from '../hooks'

export default function useMetaSwap ({ provider, address }) {
  const [state, { merge, tx }, contract] = useContract({ provider, address, abi })

  const actions = {
    async getBalance (asset = nullAddress, wallet = provider.wallet) {
      const balance = await contract.getBalance(asset, wallet)
      merge({ balance: { [wallet]: { [asset]: balance.toString() } } })
    },

    async getAccountDetails (wallet = provider.wallet) {
      const res = await contract.getAccountDetails(wallet)
      merge({ accountDetails: { [wallet]: parseCall(res) } })
    },

    async getContractDetails () {
      const res = await contract.getContractDetails()
      merge({ contractDetails: parseCall(res) })
    },

    async depositEther (value) {
      await tx(contract.depositEther({ value }))
      actions.getBalance()
      provider.getBalance()
    },

    async depositToken (tokenAddress, value) {
      await tx(contract.depositToken(tokenAddress, value))
      actions.getBalance(tokenAddress)
    },

    async deposit (value, erc20) {
      if (!erc20) {
        return actions.depositEther(value)
      }
      await erc20.approve(address, value)
      await actions.depositToken(erc20.address, value)
    },

    async withdraw (value, erc20) {
      const assetAddress = (erc20 && erc20.address) || nullAddress
      await tx(contract.withdraw(assetAddress, value))
      actions.getBalance(assetAddress)
      if (erc20) {
        erc20.balanceOf()
      } else {
        provider.getBalance()
      }
    },

    async cooldown () {
      await tx(contract.cooldown())
      actions.getAccountDetails()
    },

    async warmUp () {
      await tx(contract.warmUp())
      actions.getAccountDetails()
    },

    async configureAccount (signerWallet, done) {
      await tx(contract.configureAccount(signerWallet, done))
      actions.getAccountDetails()
    }
  }

  return {
    ...state,
    ...actions
  }
}
