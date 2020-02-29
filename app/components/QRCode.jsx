import QR from 'qrcode.react'

import Json from './Json'

const QRCode = ({ data, type }) => {
  const code = data
  return (
    <>
      <QR value={code} />
      <Json>{code}</Json>
    </>
  )
}

export default QRCode
