import React, { useState } from 'react'

import InputLightningInvoice from '../InputLightningInvoice'
import { nullAddress } from '../../utils'
import { decodeInvoice } from '../../utils/lightning'

const LightningMakerInitialize = ({ onInitialize }) => {
  const [state, setState] = useState({})

  function handleChange (e) {
    if (e.target) {
      setState({ ...state, [e.target.name]: e.target.value })
    } else {
      setState({ ...state, invoice: e })
    }
  }
  function handleAutoFill (e) {
    e.preventDefault()
    onInitialize({ asset: nullAddress, amount: 10, invoice: decodeInvoice() })
  }
  const handleSubmit = (e) => {
    e && e.preventDefault()
    console.log('state is', state)
    onInitialize(state)
  }
  // TODO validation (e.g. expires and such, also read contract!)
  return (
    <form onSubmit={handleSubmit}>
      <input name="asset" value={state.asset} placeholder="Asset" onChange={handleChange} />
      <br />
      <input name="amount" value={state.amount} placeholder="Amount" onChange={handleChange} />
      <br/>
      <InputLightningInvoice value={state.invoice} onChange={handleChange} />
      <br/>
      <button type="submit" onClick={handleAutoFill}>Auto-Fill</button>
      <button type="submit">Submit</button>
    </form>
  )
}

export default LightningMakerInitialize
