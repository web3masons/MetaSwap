import { useEffect, useState } from 'react'

import { useContractSuite } from '../hooks'
import { nullAddress, testAddress } from '../utils'

import SelectWallet from './SelectWallet'
import SelectChain from './SelectChain'
import Json from './Json'
import { takerAdmin, relayer } from '../utils/demo-accounts'

const MetaSwapAdmin = () => {
  const { metaSwap, provider, erc20 } = useContractSuite()
  const [signerAddress, setSignerAddress] = useState()

  function setWallet ({ wallet, signerWallet }) {
    provider.setWallet(wallet.privateKey)
    setSignerAddress(signerWallet.address)
  }

  async function getAllBalances (account) {
    await Promise.all([
      provider.getBalance(account),
      metaSwap.getBalance(nullAddress, account),
      metaSwap.getBalance(erc20.address, account),
      erc20.getBalance(account)
    ])
  }

  function updateAll () {
    getAllBalances(provider.wallet)
    getAllBalances(signerAddress)
    getAllBalances(testAddress)
    getAllBalances(metaSwap.address)
    metaSwap.getAccountDetails()
    metaSwap.getContractDetails()
  }

  useEffect(() => {
    if (signerAddress && provider.wallet && metaSwap.address && erc20.address) {
      updateAll()
    }
  }, [signerAddress, metaSwap.address, erc20.address, provider.address])

  return (
    <>
      <SelectChain onChange={provider.setProvider} autoSelect />
      {provider.url && (
        <SelectWallet onChange={setWallet} autoSelect />
      )}
      <hr />
      {provider.wallet && (
        <Json>
          {{
            api: provider.url,
            admin: {
              address: provider.wallet,
              ethBalance: provider.balance(),
              tokenBalance: erc20.balance(),
              etherDeposited: metaSwap.balance(),
              tokensDeposited: metaSwap.balance(erc20.address),
              metaSwapDetails: metaSwap.accountDetail()
            },
            signer: {
              address: signerAddress,
              ethBalance: provider.balance(signerAddress)
            },
            testAddress: {
              address: testAddress,
              ethBalance: provider.balance(testAddress),
              tokenbalance: erc20.balance(testAddress)
            },
            metaSwap: {
              address: metaSwap.address || 'NOT DEPLOYED!',
              ethBalance: provider.balance(metaSwap.address),
              tokenBalance: erc20.balance(metaSwap.address)
            }
            // signerAddress
          }}
        </Json>
      )}
      <ul></ul>
      <li>
        <button
          onClick={async () => {
            await metaSwap.cooldown()
            await provider.increaseTime(6 * 60)
            await metaSwap.getAccountDetails()
          }}
        >
          Freeze and Wait 6 Minutes
        </button>{' '}
        (Allows Withdraws and Config)
      </li>
      <li>
        <button
          onClick={() => {
            metaSwap.warmUp()
          }}
        >
          Unfreeze
        </button>{' '}
        (Allows Trading)
      </li>
      <li>
        <button
          onClick={() => {
            metaSwap.deposit(5e10)
          }}
        >
          Deposit Ether
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            metaSwap.deposit(2e10, erc20)
          }}
        >
          Deposit Tokens
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            metaSwap.withdraw(3e6)
          }}
        >
          Withdraw Ether
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            metaSwap.withdraw(3e8, erc20)
          }}
        >
          Withdraw Tokens
        </button>
      </li>
      <li>
        <button
          onClick={async () => {
            await metaSwap.configureAccount(signerAddress, true)
            await provider.increaseTime(6 * 60)
            await metaSwap.getAccountDetails()
          }}
        >
          Set Signer Wait 6 Minutes
        </button>
      </li>
      <hr />
      Misc:
      <ul>
        <li>
          <button onClick={async () => {
            console.log('sending...')
            await provider.send(takerAdmin.address, 1e15)
            const tx = await provider.send(relayer.address, 1e15)
            await tx.wait()
            provider.getBalance(provider.address)
            provider.getBalance(takerAdmin.address)
            provider.getBalance(relayer.address)
          }}>Send ETH to Relayer + Taker</button>
        </li>
      </ul>
      <Json>{provider.txs}</Json>
    </>
  )
}

export default MetaSwapAdmin
