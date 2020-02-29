import React, { useState } from 'react'

import { nullAddress, testAddress } from '../../utils'

const EvmMakerInitialize = ({ onInitialize }) => {
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
    onInitialize({
      recipient: testAddress,
      makerAsset: nullAddress,
      makerAmount: 2,
      takerAsset: nullAddress,
      takerAmount: 3
    })
  }
  const handleSubmit = (e) => {
    e && e.preventDefault()
    onInitialize(state)
  }
  // TODO validation (e.g. expires and such, also read contract!)
  return (
    <form onSubmit={handleSubmit}>
      <input name="recipient" value={state.recipient} placeholder="Recipient" onChange={handleChange} />
      <br />
      <input name="makerAsset" value={state.makerAsset} placeholder="Maker Asset" onChange={handleChange} />
      <br />
      <input name="makerAmount" value={state.makerAmount} placeholder="Maker Amount" onChange={handleChange} />
      <br/>
      <input name="takerAsset" value={state.takerAsset} placeholder="Taker Asset" onChange={handleChange} />
      <br />
      <input name="takerAmount" value={state.takerAmount} placeholder="Taker Amount" onChange={handleChange} />
      <br/>
      <button type="submit" onClick={handleAutoFill}>Auto-Fill</button>
      <button type="submit">Submit</button>
    </form>
  )
}

export default EvmMakerInitialize
