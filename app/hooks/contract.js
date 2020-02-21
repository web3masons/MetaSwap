import { useReducer, useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { abi } from '../../contracts/build/contracts/MetaSwap'
import { mergeDeep, nullAddress } from '../utils/misc'

function reducer (state = {}, { type, payload }) {
  console.log(`>> ${type}`, payload)
  switch (type) {
    case 'merge':
      return mergeDeep(state, payload)
    default:
      throw new Error()
  }
}

export default function useContract ({ provider, address }) {
  const [state, dispatch] = useReducer(reducer)

  const contract = useRef(null)

  useEffect(() => {
    if (provider) {
      contract.current = new ethers.Contract(address, abi, provider)
      merge({ address })
    }
  }, [provider, address])

  function merge (payload) {
    dispatch({ type: 'merge', payload })
  }

  async function depositEther (value) {
    const tx = await contract.current.depositEther({ value })
    merge({ tx: { [tx.hash]: { ...tx, created: new Date() } } })
    await tx.wait()
    merge({ tx: { [tx.hash]: { mined: true } } })
    getAssetBalance()
  }

  async function getAssetBalance (walletAddress, assetAddress) {
    const address = assetAddress || nullAddress
    const balance = await contract.current.getBalance(walletAddress, address)
    merge({ assetBalance: { [walletAddress]: { [address]: balance.toString() } } })
  }

  return [state, { depositEther, getAssetBalance }]
}
