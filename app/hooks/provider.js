import { useReducer, useRef, useEffect } from 'react'
import { ethers } from 'ethers'
import { mergeDeep } from '../utils/misc'

function reducer (state = {}, { type, payload }) {
  console.log(`>> ${type}`, payload)
  switch (type) {
    case 'merge':
      return mergeDeep(state, payload)
    case 'provider':
      return {
        ...state,
        provider: payload,
        balance: {}
      }
    default:
      throw new Error()
  }
}

export default function useProvider ({ chain, secret }) {
  const [state, dispatch] = useReducer(reducer)

  const provider = useRef(null)
  const wallet = useRef(null)

  useEffect(() => {
    if (!provider.current && chain) {
      setProvider(chain)
    }
    if (provider.current && !wallet.current && secret) {
      setWallet(secret)
    }
  }, [chain, secret])

  function merge (payload) {
    dispatch({ type: 'merge', payload })
  }

  function setProvider (chain) {
    provider.current = new ethers.providers.JsonRpcProvider(chain.url)
    if (wallet.current) {
      wallet.current.connect(provider.current)
    }
    dispatch({ type: 'provider', payload: provider.current.connection.url })
  }

  function setWallet (secret) {
    if (!provider.current) {
      throw new Error('Provider not set')
    }
    try {
      wallet.current = new ethers.Wallet(secret, provider.current)
      merge({ wallet: wallet.current.address })
      getBalance(wallet.current.address)
    } catch (e) {
      return null
    }
  }

  async function getBalance (address) {
    const payload = (await provider.current.getBalance(address)).toString()
    merge({ balance: { [address]: payload } })
  }

  return [state, { setProvider, setWallet, getBalance }, provider.current]
}
