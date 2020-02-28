import React from 'react'

const LightningMakerConfirmCreation = ({ onConfirm }) => {
  return (
    <>
      <pre onClick={() => onConfirm()}>Click me to confirm the swap</pre>
    </>
  )
}

export default LightningMakerConfirmCreation
