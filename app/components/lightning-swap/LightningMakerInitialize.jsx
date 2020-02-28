import React from 'react'

const asset = '0xtest'
const amount = 42

const LightningMakerInitialize = ({ onInitialize }) => {
  return (
    <>
      <pre onClick={() => onInitialize({ asset, amount })}>Click me to initialize</pre>
    </>
  )
}

export default LightningMakerInitialize
