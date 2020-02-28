import { useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { parseCall, parseTx } from '../utils'
import { useMyReducer } from '../hooks'

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
    async tx (promise, skipMining) {
      // TODO handle errors
      const tx = await promise
      merge({ txs: { [tx.hash]: parseTx(tx) } })
      const wait = async () => {
        await tx.wait()
        merge({ txs: { [tx.hash]: { mined: true } } })
      }
      skipMining ? wait() : await wait()
      return tx
    },

    getProvider () {
      return wallet || provider
    },

    setProvider (chain) {
      provider.current = new ethers.providers.JsonRpcProvider(chain.url)
      set({ ...chain, txs: {} })
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
      const balance = (await provider.current.getBalance(address)).toString()
      merge({ balance: { [address]: balance } })
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
      actions.tx(provider.current.getTransaction(hash))
    },

    async getTransactionReceipt (hash) {
      const receipt = await provider.current.getTransactionReceipt(hash)
      merge({ txs: { [hash]: { receipt: parseCall(receipt) } } })
    },

    async increaseTime (seconds) {
      await provider.current.send('evm_increaseTime', [seconds])
      await provider.current.send('evm_mine')
    }
  }

  return {
    ...state,
    ...actions
  }
}
