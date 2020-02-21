import { useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { useMyReducer, parseCall } from '../utils'

export default function useProvider ({ chain, secret }) {
  const [state, { merge, set }] = useMyReducer()

  const provider = useRef(null)
  const wallet = useRef(null)

  useEffect(() => {
    if (!provider.current && chain) {
      actions.setProvider(chain)
    }
    if (provider.current && !wallet.current && secret) {
      actions.setWallet(secret)
    }
  }, [chain, secret])

  const actions = {
    getProvider () {
      return wallet || provider
    },

    async setProvider (chain) {
      console.log(chain)
      provider.current = new ethers.providers.JsonRpcProvider(chain.url)
      set(chain)
      if (wallet.current) {
        actions.setWallet(wallet.current.privateKey)
      }
      actions.getBlock()
    },

    setWallet (secret) {
      try {
        wallet.current = new ethers.Wallet(secret, provider.current)
        merge({ wallet: wallet.current.address })
        actions.getBalance(wallet.current.address)
      } catch (e) {
        console.log(e)
        return null
      }
    },

    async getBalance (address = state.wallet) {
      const payload = (await provider.current.getBalance(address)).toString()
      merge({ balance: { [address]: payload } })
    },

    async getBlockNumber () {
      const blockNumber = await provider.current.getBlockNumber()
      merge({ blockNumber: blockNumber.toString() })
      return blockNumber
    },

    async getBlock (_hashOrNumber) {
      const hashOrNumber = _hashOrNumber || await actions.getBlockNumber()
      const block = await provider.current.getBlock(hashOrNumber)
      merge({ block: { [block.hash]: parseCall(block) } })
    },

    async getTransaction (hash) {
      const tx = await provider.current.getTransaction(hash)
      merge({ tx: { [hash]: parseCall(tx) } })
    },

    async getTransactionReceipt (hash) {
      const receipt = await provider.current.getTransactionReceipt(hash)
      merge({ tx: { [hash]: { receipt: parseCall(receipt) } } })
    }
  }

  return {
    ...state,
    ...actions
  }
}
