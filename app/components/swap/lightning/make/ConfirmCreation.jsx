import React from 'react'

const ConfirmLightningSwapCreation = ({ onConfirm }) => {
  return (
    <>
      <pre onClick={() => onConfirm()}>Click me to confirm the swap</pre>
    </>
  )
}

export default ConfirmLightningSwapCreation
