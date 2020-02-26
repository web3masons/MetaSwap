import { abi } from '../../contracts/build/contracts/MetaSwap'
import { testAddress, nullAddress, parseCall, createSignature, formatParams } from '../utils'
import { useContract } from '../hooks'

export default function useMetaSwap ({ provider, address }) {
  const [state, { merge, tx }, contract] = useContract({ provider, address, abi })

  const actions = {
    async getBalance (asset = nullAddress, wallet = provider.wallet) {
      const balance = await contract.getBalance(asset, wallet)
      merge({ balance: { [wallet]: { [asset]: balance.toString() } } })
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

    async configureAccount (signerWallet, done = false) {
      await tx(contract.configureAccount(signerWallet, done))
      actions.getAccountDetails()
    },

    async swap (signer, asset = nullAddress) {
      const { nonce } = await actions.getAccountDetails()
      const params = {
        contractAddress: address,
        nonce: parseInt(nonce) + 1,
        preImage: '0x561c9f2cc0e720388ff4e57611e7bce3d0b3d5b44563b15486646372b0f4ffc9',
        preImageHash: '0x99fdc2e2d58d8e772cd819bd3ca41bbca56cc36dfc07e4bc97d7ed14bf2d2288',
        amount: 5,
        relayerAmount: 1,
        account: provider.wallet,
        asset,
        relayerAddress: provider.wallet,
        relayerAsset: asset,
        expirationTime: Math.floor(new Date().getTime() / 1000) + 10e8,
        relayerExpirationTime: Math.floor(new Date().getTime() / 1000) + 10e8,
        receiver: testAddress
      }
      params.signature = await createSignature(params, signer)
      const methodParams = formatParams(params)
      // const message = hashMessage(params)
      // use getSignatureIsValid...
      console.log(methodParams)
      await tx(contract.swap(...methodParams))
      // console.log('got', params, methodParams)
    }
  }

  return {
    ...state,
    ...actions
  }
}
