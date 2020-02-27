import React from 'react'

const SetLightningSwapInvoice = ({ onSetInvoice }) => {
  return (
    <>
      <pre onClick={() => onSetInvoice()}>Click me to set invoice</pre>
    </>
  )
}

export default SetLightningSwapInvoice
