import { useProvider, useMetaSwap, useErc20 } from '../hooks'
import { chains } from '../utils'

import SelectWallet from './SelectWallet'
import SelectChain from './SelectChain'
import { useEffect } from 'react'

const chain = Object.values(chains).slice(0, 1)[0]

const secret = '0x6f362b01031d9cd0a650bfb8c8d5d541c322bbc8e565d18a19d69243ce897aaf'
const txHash = '0x0783297c83784d26ea1d134619b5122f49b96057abf3a117f0365ed875bf4a1b'
const signer = '0x0000000000000000000000000000000000000b0b'

const MetaSwapAdmin = () => {
  const provider = useProvider({ secret, chain })
  const metaSwap = useMetaSwap({ provider, address: provider.contractAddress })
  const erc20 = useErc20({ provider, address: provider.tokenAddress })

  useEffect(() => {
    if (metaSwap.address && erc20.address) {
      metaSwap.getBalance()
      metaSwap.getBalance(erc20.address)
      metaSwap.getAccountDetails()
      metaSwap.getContractDetails()
    }
  }, [metaSwap.address, erc20.address])

  return (
    <>
      <SelectWallet onChange={provider.setWallet} />
      <SelectChain onChange={provider.setProvider} />
      <hr />
      Chain:
      <button onClick={() => provider.getBlock()}>Block</button>
      <button onClick={() => provider.getTransaction(txHash)}>Tx</button>
      <button onClick={() => provider.getTransactionReceipt(txHash)}>TxReceipt</button>
      <button onClick={() => erc20.balanceOf()}>Token Balance</button>
      <button onClick={() => provider.increaseTime(10 * 60)}>Time increase</button>
      <hr />
      Read Contract:
      <button onClick={() => metaSwap.getContractDetails()}>Contract Details</button>
      <button onClick={() => metaSwap.getAccountDetails()}>Account Details</button>
      <button onClick={() => metaSwap.getBalance()}>Ether Balance</button>
      <button onClick={() => metaSwap.getBalance(provider.tokenAddress)}>Token Balance</button>
      <hr />
      Account:
      <button onClick={() => metaSwap.configureAccount(signer, true)}>Configure Account</button>
      <button onClick={() => metaSwap.cooldown()}>Cool Down</button>
      <button onClick={() => metaSwap.warmUp()}>Warm Up</button>
      ||
      <button onClick={() => metaSwap.deposit(5)}>Deposit Ether</button>
      <button onClick={() => metaSwap.deposit(10, erc20)}>Deposit Tokens</button>
      ||
      <button onClick={() => metaSwap.withdraw(3)}>Withdraw Ether</button>
      <button onClick={() => metaSwap.withdraw(2, erc20)}>Withdraw Tokens</button>
      <hr/>
      Relay:
      <button disabled onClick={() => metaSwap.swap()}>Relay Swap</button>
      <hr />
      <pre>{JSON.stringify({ erc20, metaSwap, provider }, null, 2)}</pre>
    </>
  )
}

export default MetaSwapAdmin
