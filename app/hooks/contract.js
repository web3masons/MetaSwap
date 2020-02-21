import { useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { abi } from '../../contracts/build/contracts/MetaSwap'
import { useMyReducer, nullAddress, parseTx, parseCall } from '../utils'

export default function useContract ({ provider, address }) {
  const [state, { merge, set }] = useMyReducer()

  const providerRef = provider.getProvider().current
  const providerUrl = providerRef && providerRef.provider.connection.url

  const contract = useRef(null)

  useEffect(() => {
    if (providerUrl) {
      contract.current = new ethers.Contract(address, abi, providerRef)
      set({ address })
    }
  }, [providerRef, providerUrl, address])

  const actions = {
    async getBalance (wallet = provider.wallet, asset = nullAddress) {
      const balance = await contract.current.getBalance(wallet, asset)
      merge({ assetBalance: { [wallet]: { [asset]: balance.toString() } } })
    },

    async getAccountDetails (wallet = provider.wallet) {
      const res = await contract.current.getAccountDetails(wallet)
      merge({ accountDetails: { [wallet]: parseCall(res) } })
    },

    async depositEther (value) {
      if (!value) {
        throw new Error('no value specified')
      }
      const tx = await contract.current.depositEther({ value })
      merge({ tx: { [tx.hash]: parseTx(tx) } })
      await tx.wait()
      merge({ tx: { [tx.hash]: { mined: true } } })
      actions.getBalance()
      provider.getBalance()
    }
  }

  return {
    ...state,
    ...actions
  }
}
