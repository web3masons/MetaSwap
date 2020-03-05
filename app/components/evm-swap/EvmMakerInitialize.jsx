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
    <form onSubmit={handleSubmit} className="form-group">
      <label className="form-label label-lg">I want to sell:</label>
      <AssetAmountInput
        name="maker"
        onChange={handleChange}
        onUpdateChain={swap.maker.provider.setProvider}
        renderDeposited={
          <DepositedAmount
            metaSwap={swap.maker.metaSwap}
            asset={state.makerAsset}
          />
        }
      />
      <label className="form-label label-lg">
        I want to buy:
      </label>
      {state.makerAsset && (
        <AssetAmountInput
          name="taker"
          onChange={handleChange}
          onUpdateChain={swap.taker.provider.setProvider}
        />
      )}
      <br />
      <label className="form-label label-lg">
        I want my purchase to be sent to this address:
      </label>
      <input
        name="recipient"
        className="form-input input-lg"
        value={state.recipient}
        placeholder="Recipient"
        onChange={e =>
          handleChange({ target: { name: e.target.name, value: testAddress } })
        }
      />
      <button className="btn btn-primary btn-full" type="submit">
        Create Swap
      </button>
    </form>
  )
}

export default EvmMakerInitialize
