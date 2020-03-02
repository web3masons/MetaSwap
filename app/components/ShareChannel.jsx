import React from 'react'
import QRCode from './QRCode'

import { url } from '../utils'

const ShareChannel = ({ peerId }) => {
  const peerUrl = `${url}/take/${peerId}`
  return (
    <div className="text-center">
      <h6>Share this link with the swap taker:</h6>
      <a href={peerUrl} target="_blank">
        <QRCode data={peerUrl} />
        {peerUrl}
      </a>
    </div>
  )
}

export default ShareChannel
