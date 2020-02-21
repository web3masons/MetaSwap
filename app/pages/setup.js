import { useProvider, useContract } from '../hooks'
import { chains } from '../utils'

import SelectWallet from '../components/SelectWallet'
import SelectChain from '../components/SelectChain'

const chain = Object.values(chains).slice(0, 1)[0]

const secret = '0x6f362b01031d9cd0a650bfb8c8d5d541c322bbc8e565d18a19d69243ce897aaf'
const txHash = '0x0783297c83784d26ea1d134619b5122f49b96057abf3a117f0365ed875bf4a1b'

const Setup = () => {
  const provider = useProvider({ secret, chain })
  const contract = useContract({ provider, address: chain.address })
  return (
    <>
      <SelectWallet onChange={provider.setWallet} />
      <SelectChain onChange={provider.setProvider} />
      <hr />
      <button onClick={() => provider.getBlock()}>Block</button>
      <button onClick={() => provider.getTransaction(txHash)}>Tx</button>
      <button onClick={() => provider.getTransactionReceipt(txHash)}>TxReceipt</button>
      <hr />
      <button onClick={() => contract.depositEther(5)}>Deposit</button>
      <button onClick={() => contract.getAccountDetails()}>Account</button>
      <hr />
      <pre>{JSON.stringify({ provider, contract }, null, 2)}</pre>
    </>
  )
}

export default Setup
