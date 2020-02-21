import { useProvider, useContract } from '../hooks'
import { chains } from '../utils/config'

import SelectWallet from '../components/SelectWallet'
import SelectChain from '../components/SelectChain'

const chain = Object.values(chains).slice(0, 1)[0]

const secret = '0x6f362b01031d9cd0a650bfb8c8d5d541c322bbc8e565d18a19d69243ce897aaf'

const Setup = () => {
  const [providerState, pActions, provider] = useProvider({ secret, chain })
  const [contractState, cActions] = useContract({ provider, address: chain.address })
  // console.log('new state', providerState)
  return (
    <>
      <SelectWallet onChange={pActions.setWallet} />
      <SelectChain onChange={pActions.setProvider} />
      <pre onClick={() => cActions.getAssetBalance(providerState.wallet)}>
        {JSON.stringify({ contractState, providerState }, null, 2)}
      </pre>
      {/* <SelectChain onChange={setChain} />
      <SelectFundingAccount onChange={setFundingAccount} />
      {chain && <MetaSwapAdmin {...{ chain }} />} */}
    </>
  )
}

export default Setup
