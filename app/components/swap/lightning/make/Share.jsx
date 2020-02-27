import React from 'react'

const ShareLightningSwap = ({ peerId }) => {
  const url = `http://localhost:3000/s/${peerId}`
  return (
    <>
      <a href={url} target="_blank">{url}</a>
    </>
  )
}

export default ShareLightningSwap
