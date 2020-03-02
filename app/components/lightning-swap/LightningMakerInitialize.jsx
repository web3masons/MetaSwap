import React, { useState } from 'react'

import InputLightningInvoice from '../InputLightningInvoice'
import DepositedAmount from '../DepositedAmount'
import AssetAmountInput from '../AssetAmountInput'
import Json from '../Json'
import InvoiceDetails from '../InvoiceDetails'

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
    <form onSubmit={handleSubmit} className="form-group">
      <label className="form-label label-lg">I want to sell:</label>
      <AssetAmountInput
        onChange={handleChange}
        onUpdateChain={onUpdateChain}
        renderDeposited={<DepositedAmount metaSwap={metaSwap} asset={state.asset} />}
      />
      <label className="form-label label-lg">If this Lightning invoice gets paid:</label>
      {!state.invoice && <InputLightningInvoice value={state.invoice} onChange={handleChange} />}
      {state.invoice && <InvoiceDetails invoice={state.invoice} />}
      {state.amount && state.invoice && <button className="btn btn-primary btn-full" type="submit">Create Swap</button>}
    </form>
  )
}

export default LightningMakerInitialize
