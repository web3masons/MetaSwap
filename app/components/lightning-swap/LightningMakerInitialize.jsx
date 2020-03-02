import React, { useState } from 'react'

import InputLightningInvoice from '../InputLightningInvoice'
import DepositedAmount from '../DepositedAmount'
import AssetAmountInput from '../AssetAmountInput'
import Json from '../Json'

const LightningMakerInitialize = ({ onInitialize, onUpdateChain, metaSwap }) => {
  const [state, setState] = useState({})

  function handleChange (e) {
    if (e.target) {
      setState({ ...state, [e.target.name]: e.target.value })
    } else {
      setState({ ...state, invoice: e })
    }
  }
  const handleSubmit = e => {
    e && e.preventDefault()
    onInitialize(state)
  }
  // TODO validation (e.g. expires and such, also read contract!)
  return (
    <form onSubmit={handleSubmit}>
      <Json>{state}</Json>
      I want to sell:
      <br/>
      <AssetAmountInput onChange={handleChange} onUpdateChain={onUpdateChain} />
      <br/>
      Deposited: <DepositedAmount metaSwap={metaSwap} asset={state.asset} />
      <br/>
      If this invoice gets paid:
      <br/>
      <InputLightningInvoice value={state.invoice} onChange={handleChange} />
      <br />
      <button type="submit">Submit</button>
    </form>
  )
}

export default LightningMakerInitialize
