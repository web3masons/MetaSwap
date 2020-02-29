import React from 'react'
import QRCode from './QRCode'

const ShareChannel = ({ peerId }) => {
  const url = `http://localhost:3000/take/${peerId}`
  return (
    <>
      <QRCode data={url} />
      <a href={url} target="_blank">{url}</a>
    </>
  )
}

export default ShareChannel
