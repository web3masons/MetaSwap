import { abi } from '../../contracts/build/contracts/MetaSwap'
import { nullAddress, parseCall, createSignature, testPreImageHash, formatParams } from '../utils'
import { useContract } from '../hooks'
import { useEffect } from 'react'

export default function useMetaSwap ({ provider, signer, address, owner }) {
  const [state, { merge, addTx }, contract] = useContract({ provider, address, abi })

  const providerRef = provider.getProvider().current
  const walletRef = providerRef && providerRef
  const messageSigner = signer || walletRef
  const depositAccount = owner || (walletRef && walletRef.address)

  useEffect(() => {
    merge({
      messageSigner: messageSigner && messageSigner.address,
      txPublisher: walletRef && walletRef.address,
      depositAccount
    })
  }, [walletRef, messageSigner, depositAccount])

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
      await addTx(contract.depositEther({ value }))
      actions.getBalance()
      provider.getBalance()
    },

    async depositToken (tokenAddress, value) {
      await addTx(contract.depositToken(tokenAddress, value))
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
      await addTx(contract.withdraw(assetAddress, value))
      actions.getBalance(assetAddress)
      if (erc20) {
        erc20.getBalance()
      } else {
        provider.getBalance()
      }
    },

    async cooldown () {
      return addTx(contract.cooldown())
    },

    async warmUp () {
      return addTx(contract.warmUp())
    },

    async configureAccount (signerWallet, done = false) {
      return addTx(contract.configureAccount(signerWallet, done))
    },

    async signSwap ({
      amount,
      recipient,
      asset = nullAddress,
      preImageHash = testPreImageHash
    }) {
      const { nonce } = await actions.getAccountDetails(depositAccount)
      const signedSwap = {
        contractAddress: address,
        nonce: parseInt(nonce) + 1,
        preImageHash,
        amount,
        relayerAmount: 1,
        account: depositAccount,
        asset,
        relayerAddress: provider.wallet,
        relayerAsset: asset,
        expirationTime: Math.floor(new Date().getTime() / 1000) + 10e8,
        relayerExpirationTime: Math.floor(new Date().getTime() / 1000) + 10e8,
        recipient
      }
      signedSwap.signature = await createSignature(signedSwap, messageSigner)
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
      return addTx(contract.swap(...methodParams), true)
    },
    listenForPreImage (preImageHash) {
      // TODO poll the chain for this preImage...
    },
    balance (asset = nullAddress, account = provider.wallet) {
      // TODO use getDeep
      return (
        (state.balances &&
          state.balances[account] &&
          state.balances[account][asset]) ||
        0
      )
    },
    accountDetail (account = provider.wallet) {
      return state.accountDetails && state.accountDetails[account]
    }
  }

  return {
    ...state,
    ...actions
  }
}
