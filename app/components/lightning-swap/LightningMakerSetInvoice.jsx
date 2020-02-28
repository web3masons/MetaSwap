import React from 'react'

const LightningMakerSetInvoice = ({ onSetInvoice }) => {
  return (
    <>
      <pre onClick={() => onSetInvoice()}>Click me to set invoice</pre>
    </>
  )
}

export default LightningMakerSetInvoice
