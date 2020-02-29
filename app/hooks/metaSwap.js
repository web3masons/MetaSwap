import { abi } from '../../contracts/build/contracts/MetaSwap'
import { nullAddress, parseCall, createSignature, testPreImageHash, formatParams } from '../utils'
import { useContract } from '../hooks'

export default function useMetaSwap ({ provider, address }) {
  const [state, { merge, tx }, contract] = useContract({ provider, address, abi })

  const actions = {
    async getBalance (asset = nullAddress, wallet = provider.wallet) {
      const balance = await contract.getBalance(asset, wallet)
      merge({ balances: { [wallet]: { [asset]: balance.toString() } } })
    },

    async getAccountDetails (wallet = provider.wallet) {
      const res = parseCall(await contract.getAccountDetails(wallet))
      merge({ accountDetails: { [wallet]: res } })
      return res
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
        erc20.getBalance()
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

    async configureAccount (signerWallet, done = false) {
      await tx(contract.configureAccount(signerWallet, done))
      actions.getAccountDetails()
    },

    async signSwap ({
      amount,
      recipient,
      asset = nullAddress,
      preImageHash = testPreImageHash
    }) {
      const { nonce } = await actions.getAccountDetails()
      const signedSwap = {
        contractAddress: address,
        nonce: parseInt(nonce) + 1,
        preImageHash,
        amount,
        relayerAmount: 1,
        account: provider.wallet,
        asset,
        relayerAddress: provider.wallet,
        relayerAsset: asset,
        expirationTime: Math.floor(new Date().getTime() / 1000) + 10e8,
        relayerExpirationTime: Math.floor(new Date().getTime() / 1000) + 10e8,
        recipient
      }
      const signer = provider.getProvider().current
      signedSwap.signature = await createSignature(signedSwap, signer)
      return signedSwap
    },
    validateParams (params) {
      // todo, throw if problem
      return true
    },
    // TODO poll chain for published preImageHash
    relaySwap (params) {
      actions.validateParams(params)
      const methodParams = formatParams(params)
      return tx(contract.swap(...methodParams), true)
    },
    listenForPreImage (preImageHash) {
      // TODO poll the chain for this preImage...
    },
    balance (asset = nullAddress, account = provider.wallet) {
      return (
        (state.balances && state.balances[account] &&
          state.balances[account][asset]) ||
        0
      )
    },
    accountDetail (account = provider.wallet) {
      return (state.accountDetails && state.accountDetails[account])
    }
  }

  return {
    ...state,
    ...actions
  }
}
