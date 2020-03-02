import { useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { useMyReducer } from '../hooks'

export default function useContract ({ provider, address, abi }) {
  const [state, actions] = useMyReducer()

  const providerRef = provider.getProvider().current
  const providerUrl = providerRef && providerRef.provider.connection.url

  const contract = useRef(null)

  useEffect(() => {
    if (providerUrl) {
      if (!address) {
        actions.set({})
      } else {
        contract.current = new ethers.Contract(address, abi, providerRef)
        actions.set({ address })
      }
    }
  }, [providerUrl, provider.wallet, address])

  actions.addTx = async (promise, skipMining) => {
    const tx = await provider.addTx(promise, true)
    actions.push('txs', tx.hash)
    if (!skipMining) {
      await tx.wait()
    }
    return tx
  }

  return [state, actions, contract.current]
}
