import React, { useState } from 'react'

import { nullAddress, testAddress } from '../../utils'

import AssetAmountInput from '../AssetAmountInput'
import DepositedAmount from '../DepositedAmount'
import Json from '../Json'

const EvmMakerInitialize = ({ onInitialize, swap }) => {
  const [state, setState] = useState({})

  function handleChange (e) {
    if (e.target) {
      setState({ ...state, [e.target.name]: e.target.value })
    } else {
      setState({ ...state, ...e })
    }
  }
  const handleSubmit = (e) => {
    e && e.preventDefault()
    onInitialize(state)
  }
  // TODO validation (e.g. expires and such, also read contract!)
  return (
    <form onSubmit={handleSubmit}>
      Recipient address:
      <br/>
      <input
        name="recipient"
        value={state.recipient}
        placeholder="Recipient"
        onChange={(e) => handleChange({ target: { name: e.target.name, value: testAddress } })}
      />
      <br />
      <br />
      I want to sell:
      <br />
      <AssetAmountInput
        name="maker"
        onChange={handleChange}
        onUpdateChain={swap.maker.provider.setProvider}
      />
      <br />
      Deposited:
      <DepositedAmount
        metaSwap={swap.maker.metaSwap}
        asset={state.makerAsset}
      />
      <br />
      <br />
      I want to buy:
      <br />
      {state.makerAsset && (
        <AssetAmountInput
          name="taker"
          onChange={handleChange}
          onUpdateChain={swap.taker.provider.setProvider}
        />
      )}
      <br />
      <br />
      <button type="submit">Submit</button>
      <Json>{state}</Json>
    </form>
  )
}

export default EvmMakerInitialize
