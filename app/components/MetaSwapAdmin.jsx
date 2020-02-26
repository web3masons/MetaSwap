import { useEffect } from 'react'

import { useContractSuite } from '../hooks'
import { testAddress, nullAddress } from '../utils'

import SelectWallet from './SelectWallet'
import SelectChain from './SelectChain'

const MetaSwapAdmin = () => {
  const { metaSwap, provider, erc20, signer } = useContractSuite()

  useEffect(() => {
    if (metaSwap.address && erc20.address) {
      (async () => {
        await Promise.all([
          metaSwap.getBalance(),
          metaSwap.getBalance(erc20.address),
          metaSwap.getAccountDetails(),
          metaSwap.getContractDetails()
        ])
      })()
    }
  }, [metaSwap.address, erc20.address])

  return (
    <>
      <SelectWallet onChange={provider.setWallet} />
      <SelectChain onChange={provider.setProvider} />
      <hr/>
      Main:
      <button onClick={() => {
        metaSwap.getBalance()
        metaSwap.getBalance(erc20.address)
        metaSwap.getBalance(nullAddress, testAddress)
        metaSwap.getBalance(erc20.address, testAddress)
        provider.getBalance(testAddress)
        erc20.balanceOf()
        erc20.balanceOf(testAddress)
        metaSwap.getAccountDetails()
        metaSwap.getContractDetails()
      }}>Update Many</button>
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
      <button onClick={() => metaSwap.configureAccount(signer.address)}>Configure Account</button>
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
      <button onClick={() => metaSwap.swap(signer, erc20.address)}>Relay Swap</button>
      <hr />
      <pre>{JSON.stringify({ erc20, metaSwap, provider }, null, 2)}</pre>
    </>
  )
}

export default MetaSwapAdmin
